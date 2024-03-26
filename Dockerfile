FROM node:18.18.0-alpine AS base

ARG PNPM_VERSION=8.7.6
ENV PNPM_HOME=/usr/local/bin
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

RUN pnpm add -g turbo rimraf vite

FROM base as setup
COPY . .
RUN turbo prune --scope=@streetwhere/mail --docker

# BUILDER STAGE
FROM base AS cached 
RUN apk add --update --no-cache libc6-compat && rm -rf /var/cache/apk/*

COPY .gitignore .gitignore
COPY --from=setup /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=setup /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
# ↑ By caching the content-addressable store we stop downloading the same packages again and again

FROM base as deps
COPY --from=setup /app/out/json/ ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
 pnpm install --prod --filter=@streetwhere/mail... -r --workspace-root --frozen-lockfile \
 --unsafe-perm \
# ↑ Docker runs pnpm as root and then pnpm won't run package scripts unless we pass this arg
 | grep -v "cross-device link not permitted\|Falling back to copying packages from store"
# ↑ Unfortunately using Docker's 'cache' mount type causes Docker to place the pnpm content-addressable store
# on a different virtual drive, which prohibits pnpm from symlinking its content to its virtual store
# (in node_modules/.pnpm), and that causes pnpm to fall back on copying the files.
# And that's fine!, except pnpm emits many warnings of this, so here we filter those out.

# First install dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm add turbo --ignore-workspace-root-check

FROM base as builder
COPY --from=setup /app/out/json/ ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
 pnpm install --filter=@streetwhere/mail... -r --workspace-root --frozen-lockfile \
 --unsafe-perm \
# ↑ Docker runs pnpm as root and then pnpm won't run package scripts unless we pass this arg
 | grep -v "cross-device link not permitted\|Falling back to copying packages from store"
# ↑ Unfortunately using Docker's 'cache' mount type causes Docker to place the pnpm content-addressable store
# on a different virtual drive, which prohibits pnpm from symlinking its content to its virtual store
# (in node_modules/.pnpm), and that causes pnpm to fall back on copying the files.
# And that's fine!, except pnpm emits many warnings of this, so here we filter those out.

COPY --from=setup /app/out/full/ ./
COPY turbo.json turbo.json
RUN pnpm build:docker --filter=@streetwhere/mail...

FROM alpine:3.19.0 AS runner
ARG PNPM_VERSION=8.7.6
ENV PNPM_HOME=/usr/local/bin
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/node_modules ./node_modules

# MAIL
COPY --from=builder /app/apps/mail/tsconfig.json ./apps/mail/tsconfig.json
COPY --from=builder /app/apps/mail/package.json ./apps/mail/package.json
COPY --from=builder /app/apps/mail/dist ./apps/mail/dist
COPY --from=builder /app/apps/mail/src/server ./apps/mail/src/server
COPY --from=deps /app/apps/mail/node_modules ./apps/mail/node_modules

COPY --from=builder /app/packages ./packages

RUN apk add --no-cache nodejs && wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

EXPOSE 3000

CMD ["pnpm", "start:docker"]
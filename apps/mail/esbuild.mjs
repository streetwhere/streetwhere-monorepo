import { build } from "esbuild";
import { cp } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import readJSON from "read-package-json";

const read = promisify(readJSON);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC = resolve(__dirname, "public");
const VIEW = resolve(__dirname, "views");

const DEST = (folder) => resolve(__dirname, "dist", folder[0]);

const recursive = true;

const packageJSON = await read(
	resolve(__dirname, "package.json"),
	console.error,
	false,
);

const deps = Object.keys(packageJSON.dependencies);

await build({
	entryPoints: ["server.ts"],
	bundle: true,
	platform: "node",
	target: "node18.18.0",
	external: deps.filter((v) => !v.startsWith("@streetwhere/")),
	outdir: "dist",
});

await cp(PUBLIC, DEST`public`, { recursive });
await cp(VIEW, DEST`views`, { recursive });

import type { SerwistGlobalConfig } from "@serwist/core";
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "@serwist/sw";
import type { PrecacheEntry } from "@serwist/sw/precaching";

declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		// Change this attribute's name to your `injectionPoint`.
		// `injectionPoint` is an InjectManifest option.
		// See https://serwist.pages.dev/docs/build/inject-manifest/configuring
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
	}
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist();

serwist.install({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	runtimeCaching: defaultCache,
});

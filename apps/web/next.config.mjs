import {
	PHASE_DEVELOPMENT_SERVER,
	PHASE_PRODUCTION_BUILD,
} from "next/constants.js";
import million from "million/compiler";

const withMillion = (config) =>
	million.next(config, {
		auto: {
			threshold: 0.05,
			rsc: true,
		},
	});

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
export default async (phase) => {
	/** @type {import("next").NextConfig} */
	const nextConfig = { reactStrictMode: true };

	if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
		const withSerwist = (await import("@serwist/next")).default({
			// Note: This is only an example. If you use Pages Router,
			// use something else that works, such as "service-worker/index.ts".
			swSrc: "app/sw.ts",
			swDest: "public/sw.js",
		});
		return withSerwist(withMillion(nextConfig));
	}

	return withMillion(nextConfig);
};

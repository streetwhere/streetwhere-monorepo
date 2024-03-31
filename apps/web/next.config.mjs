import million from "million/compiler";
import { withAxiomNextConfig } from "next-axiom";

/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		removeConsole: {
			exclude: ["error"],
		},
	},
	experimental: {
		useLightningcss: true,
		typedRoutes: true,
	},
};

const millionConfig = {
	auto: {
		threshold: 0.05,
		rsc: true,
	},
};

export default million.next(withAxiomNextConfig(nextConfig), millionConfig);

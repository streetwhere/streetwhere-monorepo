import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		useLightningcss: true,
	},
};

const millionConfig = {
	auto: {
		threshold: 0.05,
		rsc: true,
	},
};

export default million.next(nextConfig, millionConfig);

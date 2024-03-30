import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
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

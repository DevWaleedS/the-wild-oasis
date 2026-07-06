import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "**.googleusercontent.com",
				port: "",
			},

			{
				protocol: "https",
				hostname: "authjs.dev",
				port: "",
			},
		],
	},
};

export default withPlaiceholder(nextConfig);

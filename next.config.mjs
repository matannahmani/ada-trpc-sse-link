import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  experimental: { serverActions: true },
};
export default config;

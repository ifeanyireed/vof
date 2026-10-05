import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: {
      "next/app": path.resolve(__dirname, "node_modules/next/app.js"),
      "next/app.js": path.resolve(__dirname, "node_modules/next/app.js"),
    },
  },
  transpilePackages: ["framer-motion", "@tabler/icons-react"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "vonf.org",
      },
      {
        protocol: "https",
        hostname: "www.vonf.org",
      },
      {
        protocol: "http",
        hostname: "vonf.org",
      },
    ],
  },
};

export default nextConfig;

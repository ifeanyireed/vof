import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  transpilePackages: ["framer-motion", "@tabler/icons-react"],
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

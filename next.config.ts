import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/gallery/**", search: "" },
      { pathname: "/previews/**", search: "" },
      { pathname: "/logo/**", search: "" },
    ],
  },
};

export default nextConfig;

// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["jsdom"],



  images: {
    remotePatterns: [
   
      { protocol: "https", hostname: "images.unsplash.com",        pathname: "/**" },
    
    ],
  },
};

export default nextConfig;
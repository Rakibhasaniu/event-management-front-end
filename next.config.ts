import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images:{
  domains:['localhost','picsum.photos']
 },
 env:{
   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
 }
};

export default nextConfig;

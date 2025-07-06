import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(
        "https://fra.cloud.appwrite.io/v1/storage/buckets/**/files/***/view?project=684b3c5600261b4fa7ca"
      ),
    ],
  },
};

export default nextConfig;
//https://fra.cloud.appwrite.io/v1/storage/buckets/684c089700291c6d4e3e/files/68610ade003b41cbd19d/view?project=684b3c5600261b4fa7ca
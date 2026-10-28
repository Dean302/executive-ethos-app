import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Room for the voice signature upload (schemas/voiceSignatureSchema).
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;

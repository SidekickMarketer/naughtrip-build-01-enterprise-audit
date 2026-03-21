import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/referrals",
        destination: "/platform-health",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

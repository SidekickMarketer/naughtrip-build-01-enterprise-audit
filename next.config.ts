import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/platform-health",
        permanent: false,
      },
      {
        source: "/referrals",
        destination: "/platform-health",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/platform-health",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

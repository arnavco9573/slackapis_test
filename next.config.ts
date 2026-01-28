import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.slack.com',
        pathname: '/**',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/slack-file',
        search: '?**',
      },
    ],
  },
};

export default nextConfig;

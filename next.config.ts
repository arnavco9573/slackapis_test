import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.slack.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.google.com',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/slack-file',
        search: '?**',
      },
      {
        pathname: '/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;

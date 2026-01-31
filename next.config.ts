import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.reddit.com',
      },
      {
        protocol: 'https',
        hostname: 'i.redd.it',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '*.pinimg.com',
      },
      // Brave search thumbnail proxy
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
      },
    ],
    // Allow any external image (for search results from any domain)
    unoptimized: false,
  },
};

export default nextConfig;

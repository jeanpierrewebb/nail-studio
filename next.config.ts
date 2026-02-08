import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "unsplash-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        urlPattern: /^https:\/\/.*\.reddit\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "reddit-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: /^https:\/\/i\.redd\.it\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "reddit-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: /^https:\/\/.*\.pinimg\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "pinterest-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: /^https:\/\/i\.imgur\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "imgur-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: /\/api\/collections.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "collections-api",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 24 hours
          },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: /\/api\/saves.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "saves-api",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24,
          },
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
      {
        urlPattern: /\/_next\/image\?.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  // Silence Turbopack warning since next-pwa uses webpack
  turbopack: {},
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
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
      },
    ],
    unoptimized: false,
  },
};

export default withPWA(nextConfig);

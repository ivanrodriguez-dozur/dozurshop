
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next knows the project root for output tracing when multiple lockfiles exist
  outputFileTracingRoot: __dirname,
  images: {
    domains: [
      'placehold.co',
      'ktpajrnflcqwgaoaywuu.supabase.co',
      'images.unsplash.com',
      // Uncomment the next line if you want to use the old domains format for dicebear
      // "api.dicebear.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
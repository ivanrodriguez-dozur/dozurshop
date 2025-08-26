const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next knows the project root for output tracing when multiple lockfiles exist
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['placehold.co', 'ktpajrnflcqwgaoaywuu.supabase.co'],
  },
};

module.exports = nextConfig;

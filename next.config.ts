import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Output file tracing for standalone deployment
  output: 'standalone',

  // Enable React strict mode for development
  reactStrictMode: true,

  // Configure image domains if needed
  images: {
    domains: [],
  },

  // Environment variables that should be public
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  },
}

export default nextConfig

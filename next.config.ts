import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cfImageLoader.ts',
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      {
        // Firebase Storage
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        // Firebase Storage (new bucket format)
        protocol: 'https',
        hostname: '*.firebasestorage.app',
        pathname: '/**',
      },
      {
        // Cloudflare Images
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/**',
      },
      {
        // Unsplash
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

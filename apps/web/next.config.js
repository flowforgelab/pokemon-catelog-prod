const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@pokemon-catalog/shared", "@pokemon-catalog/database"],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@pokemon-catalog/database': path.resolve(__dirname, '../../packages/database/src'),
      '@pokemon-catalog/shared': path.resolve(__dirname, '../../packages/shared/src'),
    }
    
    // Fix Prisma bundling issues on Vercel
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pokemontcg.io',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

module.exports = nextConfig
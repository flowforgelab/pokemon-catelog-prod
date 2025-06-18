const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@pokemon-catalog/shared", "@pokemon-catalog/database"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@pokemon-catalog/database': path.resolve(__dirname, '../../packages/database/src'),
      '@pokemon-catalog/shared': path.resolve(__dirname, '../../packages/shared/src'),
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
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@pokemon-catalog/shared", "@pokemon-catalog/ui"],
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
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
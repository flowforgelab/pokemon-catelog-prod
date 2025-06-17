/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@pokemon-catalog/shared", "@pokemon-catalog/ui", "@pokemon-catalog/database"],
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
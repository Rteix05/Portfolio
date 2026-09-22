/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rafaelteixeira.fr',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.34'],
  // Canonicalisation : www renvoie vers le domaine nu, celui utilisé partout dans les metadata
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.rafaelteixeira.fr' }],
        destination: 'https://rafaelteixeira.fr/:path*',
        permanent: true,
      },
    ];
  },
};

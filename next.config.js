/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rafaelteixeira.fr',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  // Adresses du PC sur le réseau local (box et partage de connexion) pour tester sur téléphone
  allowedDevOrigins: ['192.168.1.34', '172.20.10.2'],
  // Canonicalisation : www renvoie vers le domaine nu, celui utilisé partout dans les metadata
  async redirects() {
    return [
      // Les trois pages projets ont été fusionnées : les anciennes adresses mènent à /projets
      ...['/projets-scolaires', '/projets-perso', '/projets-pro'].map((source) => ({ source, destination: '/projets', permanent: true })),
      // La page Référencement a été supprimée : son résumé vit désormais dans Compétences
      { source: '/referencement', destination: '/competences', permanent: true },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.rafaelteixeira.fr' }],
        destination: 'https://rafaelteixeira.fr/:path*',
        permanent: true,
      },
    ];
  },
};

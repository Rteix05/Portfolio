import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compétences — Stack technique & outils',
  description:
    'Stack complète : React, Next.js, React Native, TypeScript et Three.js en front, PHP, Symfony et Node.js en back, Figma en design, Docker et Vercel en déploiement.',
  alternates: { canonical: '/competences' },
  openGraph: {
    title: 'Compétences — Stack technique & outils | Rafael Teixeira',
    description:
      'Stack complète : React, Next.js, React Native, TypeScript et Three.js en front, PHP, Symfony et Node.js en back, Figma en design, Docker et Vercel en déploiement.',
    url: '/competences',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

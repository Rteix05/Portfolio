import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets perso — Side projects React & 3D',
  description:
    'Projets personnels et expérimentations : interfaces React et Vue, expériences 3D temps réel et explorations d’animation web.',
  alternates: { canonical: '/projets-perso' },
  openGraph: {
    title: 'Projets perso — Side projects React & 3D | Rafael Teixeira',
    description:
      'Projets personnels et expérimentations : interfaces React et Vue, expériences 3D temps réel et explorations d’animation web.',
    url: '/projets-perso',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

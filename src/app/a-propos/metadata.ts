import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos — Parcours & profil',
  description:
    'Étudiant en BUT MMI à Troyes et développeur full stack : parcours, façon de travailler, centres d’intérêt et disponibilité en alternance.',
  alternates: { canonical: '/a-propos' },
  openGraph: {
    title: 'À propos — Parcours & profil | Rafael Teixeira',
    description:
      'Étudiant en BUT MMI à Troyes et développeur full stack : parcours, façon de travailler, centres d’intérêt et disponibilité en alternance.',
    url: '/a-propos',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

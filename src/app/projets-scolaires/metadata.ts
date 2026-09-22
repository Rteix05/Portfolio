import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projets scolaires — BUT MMI Troyes',
  description:
    'SAE et projets universitaires du BUT MMI : sites dynamiques PHP et Symfony, applications Vue et React, architectures headless et bases de données.',
  alternates: { canonical: '/projets-scolaires' },
  openGraph: {
    title: 'Projets scolaires — BUT MMI Troyes | Rafael Teixeira',
    description:
      'SAE et projets universitaires du BUT MMI : sites dynamiques PHP et Symfony, applications Vue et React, architectures headless et bases de données.',
    url: '/projets-scolaires',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

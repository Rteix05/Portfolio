import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import SmoothScroll from '../components/SmoothScroll';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const SITE_URL = 'https://rafaelteixeira.fr';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rafael Teixeira — Développeur Full Stack à Troyes & Paris',
    template: '%s | Rafael Teixeira',
  },
  description:
    'Développeur full stack : React, Next.js, Symfony et TypeScript, du design UI/UX au déploiement. Étudiant en BUT MMI à Troyes, disponible en alternance.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Rafael Teixeira — Développeur Full Stack',
    description:
      'Portfolio de Rafael Teixeira : projets web full stack, maquettes UI/UX et expériences 3D. React, Next.js, Symfony, TypeScript.',
    url: SITE_URL,
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafael Teixeira — Développeur Full Stack',
    description:
      'Portfolio de Rafael Teixeira : projets web full stack, maquettes UI/UX et expériences 3D.',
    images: ['/og-image.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  authors: [{ name: 'Rafael Teixeira', url: SITE_URL }],
  creator: 'Rafael Teixeira',
  verification: {
    google: 'RHaEUb71xv0DD795uCO9Mq7XN_xYVx3ClvuBJYI_QKQ',
  },
};

// Données structurées : identité de l auteur + site, pour les résultats enrichis
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Rafael Teixeira',
      url: SITE_URL,
      image: `${SITE_URL}/Raf.webp`,
      jobTitle: 'Développeur Full Stack',
      description:
        'Développeur full stack spécialisé en React, Next.js, Symfony et TypeScript, du design UI/UX au déploiement.',
      knowsAbout: ['React', 'Next.js', 'TypeScript', 'Symfony', 'PHP', 'Three.js', 'UI/UX Design', 'SEO', 'Docker'],
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'IUT de Troyes — BUT MMI' },
      address: { '@type': 'PostalAddress', addressLocality: 'Troyes', addressCountry: 'FR' },
      sameAs: ['https://github.com/Rteix05'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Rafael Teixeira — Portfolio',
      inLanguage: 'fr-FR',
      publisher: { '@id': `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preload" href="/background.mp4" as="video" type="video/mp4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${spaceGrotesk.className}`}>
        {/* On enveloppe notre app avec notre propre composant Client */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

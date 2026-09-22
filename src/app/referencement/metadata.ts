import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Référencement naturel — SEO technique & Core Web Vitals',
  description:
    'Audit et optimisation SEO : indexation, metadata, données structurées, structure sémantique, Core Web Vitals et suivi Search Console. Une méthode en quatre étapes.',
  alternates: { canonical: '/referencement' },
  openGraph: {
    title: 'Référencement naturel — SEO technique & Core Web Vitals | Rafael Teixeira',
    description:
      'Audit et optimisation SEO : indexation, metadata, données structurées, structure sémantique, Core Web Vitals et suivi Search Console.',
    url: '/referencement',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

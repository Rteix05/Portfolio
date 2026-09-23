import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Référencement naturel — La chaîne SEO de A à Z',
  description:
    'Les huit maillons du référencement naturel : mots-clés, arborescence, SEO technique, balises title, données structurées, Core Web Vitals, maillage interne et suivi Search Console.',
  keywords: [
    'référencement naturel',
    'SEO technique',
    'audit SEO',
    'Core Web Vitals',
    'Google Search Console',
    'données structurées',
    'maillage interne',
    'indexation',
    'trafic organique',
  ],
  alternates: { canonical: '/referencement' },
  openGraph: {
    title: 'Référencement naturel — La chaîne SEO de A à Z | Rafael Teixeira',
    description:
      'Des mots-clés au code, du code à l’indexation, de l’indexation aux résultats mesurés : les huit maillons du référencement naturel, expliqués un par un.',
    url: '/referencement',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Une mission, une alternance ou une question ? Écrivez à Rafael Teixeira, développeur full stack à Troyes et Paris — réponse rapide.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Rafael Teixeira',
    description:
      'Une mission, une alternance ou une question ? Écrivez à Rafael Teixeira, développeur full stack à Troyes et Paris — réponse rapide.',
    url: '/contact',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

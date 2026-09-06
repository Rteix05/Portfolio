import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import SmoothScroll from '../components/SmoothScroll';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Rafael Teixeira - Développeur Full Stack & SEO | React • Next.js • Symfony • TypeScript • PHP | UI/UX | Étudiant BUT MMI 3',
    template: '%s | Rteixeira',
  },
  description: 'Rafael Teixeira - Développeur Full Stack & SEO | React • Next.js • Symfony • TypeScript • PHP | UI/UX | Étudiant BUT MMI 3',
  openGraph: {
    title: 'Rafael Teixeira - Portfolio',
    description: 'Rafael Teixeira - Développeur Full Stack & SEO | React • Next.js • Symfony • TypeScript • PHP | UI/UX | Étudiant BUT MMI 3',
    url: 'https://rafaelteixeira.fr',
    siteName: 'Rteixeira',
    images: [{ url: 'https://rafaelteixeira.fr/og-image.webp', width: 1200, height: 630, alt: 'Rteixeira Portfolio' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafael Teixeira - Portfolio',
    description: 'Rafael Teixeira - Développeur Full Stack & SEO | React • Next.js • Symfony • TypeScript • PHP | UI/UX | Étudiant BUT MMI 3',
    images: ['https://rafaelteixeira.fr/og-image.webp'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/background.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/og-image.webp" as="image" type="image/webp" crossOrigin="anonymous" />
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
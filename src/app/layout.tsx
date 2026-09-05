import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import SmoothScroll from '../components/SmoothScroll';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Rteixeira - Portfolio',
    template: '%s | Rteixeira',
  },
  description: 'Portfolio Personnel — Rafael Teixeira, développeur full-stack et designer UX/UI.',
  openGraph: {
    title: 'Rteixeira - Portfolio',
    description: 'Portfolio Personnel — Rafael Teixeira, développeur full-stack et designer UX/UI.',
    url: 'https://rafaelteixeira.fr',
    siteName: 'Rteixeira',
    images: [{ url: 'https://rafaelteixeira.fr/og-image.png', width: 1200, height: 630, alt: 'Rteixeira Portfolio' }],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rteixeira - Portfolio',
    description: 'Portfolio Personnel — Rafael Teixeira, développeur full-stack et designer UX/UI.',
    images: ['https://rafaelteixeira.fr/og-image.png'],
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
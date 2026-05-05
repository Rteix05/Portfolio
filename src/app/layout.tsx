import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import SmoothScroll from '../components/SmoothScroll';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rteixeira - Portfolio',
  description: 'Portfolio Personnel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className={`${spaceGrotesk.className}`}>
        {/* On enveloppe notre app avec notre propre composant Client */}
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expériences 3D — Three.js & React Three Fiber',
  description:
    'Expériences 3D interactives sur le web : modèles glTF, shaders GLSL et animations temps réel, construits avec Three.js et React Three Fiber.',
  alternates: { canonical: '/3d' },
  openGraph: {
    title: 'Expériences 3D — Three.js & React Three Fiber | Rafael Teixeira',
    description:
      'Expériences 3D interactives sur le web : modèles glTF, shaders GLSL et animations temps réel, construits avec Three.js et React Three Fiber.',
    url: '/3d',
    siteName: 'Rafael Teixeira',
    images: [
      { url: '/og-image.webp', width: 1200, height: 630, alt: 'Rafael Teixeira — Développeur Full Stack' },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

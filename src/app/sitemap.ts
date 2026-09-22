import type { MetadataRoute } from 'next';
import { SITE_URL } from './layout';

// Une seule source pour les URLs du site : plus de sitemap.xml à tenir à jour à la main.
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'monthly' },
  { path: '/projets-scolaires', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projets-pro', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projets-perso', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/competences', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/design', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/referencement', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/3d', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/a-propos', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

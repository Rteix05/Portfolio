// Rubriques du portfolio : le même média sert de carte au survol sur l'accueil et
// d'ouverture en haut de la page, pour que la transition au clic soit continue.

export type Rubrique = {
  titre: string;
  video?: string;
  affiche: string;
  infos: { label: string; valeur: string }[];
};

export const rubriques: Record<string, Rubrique> = {
  '3d': {
    titre: 'Expériences 3D',
    video: '/3d-accueil.mp4',
    affiche: '/3d-accueil.webp',
    infos: [
      { label: 'Discipline', valeur: 'Modélisation et rendu 3D' },
      { label: 'Outils', valeur: 'Blender · Three.js · React Three Fiber' },
      { label: 'Contenu', valeur: 'Scènes, animations et expériences web' },
    ],
  },
  projets: {
    titre: 'Projets',
    // Montage des meilleurs sites (Sommeval, Matos, E.S.I.C., Montagne de la Prière)
    video: '/projets-accueil.mp4',
    affiche: '/projets-accueil.webp',
    infos: [
      { label: 'Sélection', valeur: 'Pro, scolaire et perso' },
      { label: 'Stack', valeur: 'Next.js · React Native · Symfony' },
      { label: 'Contenu', valeur: 'Plateformes en production, app mobile, 3D' },
    ],
  },
  design: {
    titre: 'Design',
    video: '/design-accueil.mp4',
    affiche: '/design-accueil.webp',
    infos: [
      { label: 'Discipline', valeur: 'UI / UX design' },
      { label: 'Outils', valeur: 'Figma · Prototypage' },
      { label: 'Contenu', valeur: 'Maquettes, prototypes et design systems' },
    ],
  },
  competences: {
    titre: 'Compétences',
    video: '/competences-accueil.mp4',
    affiche: '/competences-accueil.webp',
    infos: [
      { label: 'Domaines', valeur: 'Front-end · Back-end · DevOps' },
      { label: 'Stack', valeur: 'React · Symfony · Docker · Three.js' },
      { label: 'Contenu', valeur: 'Technologies et outils maîtrisés' },
    ],
  },
  'a-propos': {
    titre: 'À propos',
    affiche: '/competences.webp',
    infos: [
      { label: 'Rôle', valeur: 'Développeur full-stack' },
      { label: 'Formation', valeur: 'BUT MMI · IUT de Troyes' },
      { label: 'Statut', valeur: 'Disponible en alternance' },
    ],
  },
};

// Pages qui s'ouvrent avec ce hero : elles jouent leur propre entrée, sans le fondu général
export const PAGES_AVEC_HERO = Object.keys(rubriques).map((id) => `/${id}`);

// Clé de session : moment de la vidéo de la carte au clic, repris par la page d'arrivée
export const CLE_REPRISE_VIDEO = 'reprise-video';

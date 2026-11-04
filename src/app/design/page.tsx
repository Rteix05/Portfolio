'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reveler } from '@/lib/reveal';
import { Space_Grotesk } from 'next/font/google';
import PageFooter from '@/components/PageFooter';
import Navbar from '@/components/Navbar';
import HeroProjet from '@/components/HeroProjet';
import { getTechIcon } from '@/lib/techIcons';
import CarrouselProjet, { type Slide } from '@/components/CarrouselProjet';
import CarrouselTelephones, { type ProjetTelephone } from '@/components/CarrouselTelephones';
import GalerieProjets, { type EcranGalerie, type ProjetGalerie } from '@/components/GalerieProjets';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

type Projet = {
  id: string;
  name: string;
  tags: string[];
  resume: string;
  infos: { label: string; valeur: string }[];
  // Fichier Figma du projet, quand il y en a un
  figmaLink?: string;
  accent: string;
  // Grande carte sur toute la largeur (projets phares) ou demi-largeur
  large: boolean;
  // Premier slide du carrousel : la composition des maquettes posées sur un fond coloré
  maquettes: React.ReactNode;
  premier: { titre: string; texte: string; vignette: string; etape?: string };
  // Slides suivants : autres pages de la maquette, puis intégration et rendu quand le projet a été développé
  etapes: Slide[];
  // Écrans affichés sur la carte de tous les projets (placés automatiquement)
  ecrans: EcranGalerie[];
};

/* ---------- Maquettes : écrans Figma réels dans un cadre de navigateur ou de téléphone ---------- */

// ratio : format de l'écran exporté (16/10 par défaut, 16/9 pour un écran 1920 × 1080)
function Ordi({ src, alt, className = '', ratio = 'aspect-16/10' }: { src: string; alt: string; className?: string; ratio?: string }) {
  return (
    <div className={`absolute overflow-hidden rounded-lg md:rounded-xl bg-white ring-1 ring-black/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] ${className}`}>
      <div className="flex h-3 md:h-5 items-center gap-1 bg-neutral-100 px-2 md:px-3" aria-hidden="true">
        <span className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-black/20" />
        <span className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-black/20" />
        <span className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-black/20" />
      </div>
      <div className={`relative ${ratio}`}>
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 80vw, 45vw" className="object-cover object-top" />
      </div>
    </div>
  );
}

function Tel({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[10%/5%] bg-black ring-[3px] md:ring-4 ring-neutral-900 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] aspect-393/817 ${className}`}
    >
      <div className="relative h-full w-full">
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 30vw, 14vw" className="object-cover object-top" />
      </div>
    </div>
  );
}

// Léger soulèvement des maquettes au survol de la carte, chacune à son rythme
const souleve = 'transition-transform duration-700 ease-out-soft';

const projets: Projet[] = [
  {
    id: 'penderie',
    ecrans: [{ src: '/design/penderie-tenues.webp' }, { src: '/design/penderie-1.webp', tel: true }, { src: '/design/penderie-2.webp', tel: true }, { src: '/design/penderie-4.webp', tel: true }],
    name: 'Penderie',
    tags: ['Mobile', 'UX', 'UI'],
    resume:
      'Application de garde-robe numérique : recherche UX (benchmark, personas, parcours), puis design system mobile et prototype des parcours clés — numériser ses vêtements, composer des tenues, organiser son dressing.',
    infos: [
      { label: 'Contexte', valeur: 'WR506D · BUT MMI' },
      { label: 'Statut', valeur: 'Projet en cours' },
      { label: 'Support', valeur: 'Application mobile' },
      { label: 'Livrables', valeur: 'UX research, design system, prototype' },
    ],
    figmaLink: 'https://www.figma.com/design/vUbnJMQ2c02Q8gvG4DB4Ug/WR506D---Penderie?node-id=135-1772&t=08UGP1SQbgHjce84-1',
    accent: '#D31D66',
    large: true,
    premier: { titre: 'Accueil clair et sombre', texte: 'Écran d’accueil dans les deux thèmes et menu d’ajout rapide.', vignette: '/design/penderie-2.webp' },
    etapes: [
      {
        etape: 'Maquette',
        titre: 'Générateur de tenues',
        texte: 'Suggestions de looks selon la météo, les préférences et les pièces disponibles.',
        image: '/design/penderie-tenues.webp',
        vignette: '/design/penderie-tenues.webp',
      },
      {
        etape: 'Intégration',
        titre: 'L’app développée',
        texte: 'Les écrans intégrés en React Native avec Expo, branchés sur l’API Symfony.',
        video: '/projets/penderie.mp4',
        vignette: '/projets/penderie.webp',
        cadrage: 'entier',
      },
    ],
    maquettes: (
      <div className="absolute inset-0 flex items-center justify-center gap-[2.5%] px-[6%]">
        <Tel src="/design/penderie-1.webp" alt="Penderie — accueil, thème clair" className={`h-[74%] md:h-[80%] translate-y-[4%] group-hover:translate-y-[1%] ${souleve}`} />
        <Tel src="/design/penderie-2.webp" alt="Penderie — accueil, thème sombre" className={`h-[74%] md:h-[80%] -translate-y-[4%] group-hover:-translate-y-[8%] ${souleve}`} />
        <Tel src="/design/penderie-3.webp" alt="Penderie — menu d’ajout" className={`h-[74%] md:h-[80%] translate-y-[4%] group-hover:translate-y-[1%] ${souleve}`} />
        <Tel src="/design/penderie-4.webp" alt="Penderie — choix vêtement ou objet" className={`hidden md:block h-[80%] -translate-y-[4%] group-hover:-translate-y-[8%] ${souleve}`} />
      </div>
    ),
  },
  {
    id: 'sommeval',
    ecrans: [{ src: '/design/sommeval.webp' }, { src: '/design/sommeval-actus.webp' }],
    name: 'Sommeval',
    tags: ['Desktop', 'UI'],
    resume:
      'Site de la mairie de Sommeval : accueil, actualités, démarches et formulaire de cantine, appuyés sur une charte graphique complète.',
    infos: [
      { label: 'Contexte', valeur: 'SAE 301 · BUT MMI' },
      { label: 'Équipe', valeur: '3 personnes' },
      { label: 'Support', valeur: 'Site desktop' },
      { label: 'Livrables', valeur: 'Charte, composants, maquettes, prototype' },
    ],
    figmaLink: 'https://www.figma.com/design/f4zaIVAKcbR1ZSqSoDmMZU/SAE-301---Sommeval---Lou-CALMES---Lucas-CORRIERAS---Rafael-TEIXEIRA?node-id=0-1&t=GfFna88C8grUnim4-1',
    accent: '#23A25F',
    large: true,
    premier: { titre: 'Accueil et actualités', texte: 'Les maquettes desktop des pages principales.', vignette: '/design/sommeval.webp' },
    etapes: [
      {
        etape: 'Intégration',
        titre: 'Le site développé',
        texte: 'Front React et back Symfony, fidèles à la maquette.',
        image: '/projets/sommeval-image.webp',
        vignette: '/projets/sommeval-image.webp',
        lien: { href: 'http://sae301.mmi24b11.mmi-troyes.fr/', label: 'Voir le site' },
      },
      {
        etape: 'Rendu',
        titre: 'En ligne',
        texte: 'Navigation dans le site publié.',
        video: '/projets/sommeval.mp4',
        vignette: '/projets/sommeval.webp',
        lien: { href: 'http://sae301.mmi24b11.mmi-troyes.fr/', label: 'Voir le site' },
      },
    ],
    maquettes: (
      <>
        <Ordi src="/design/sommeval.webp" alt="Sommeval — page d’accueil" className={`left-[7%] top-[11%] w-[70%] md:left-[12%] md:top-[10%] md:w-[50%] group-hover:-translate-y-2 ${souleve}`} />
        <Ordi src="/design/sommeval-actus.webp" alt="Sommeval — page actualités" className={`right-[6%] bottom-[9%] w-[50%] md:right-[12%] md:bottom-[9%] md:w-[38%] group-hover:-translate-y-4 ${souleve}`} />
      </>
    ),
  },
  {
    id: 'carbon',
    ecrans: [{ src: '/design/carbon.webp' }, { src: '/design/carbon-mobile.webp', tel: true }],
    name: 'Carb’On',
    tags: ['Web', 'Mobile', 'UI'],
    resume:
      'Suivi d’empreinte carbone gamifié : tableau de bord, classement entre amis et ajout d’activités, pensé mobile-first pour encourager les gestes éco-responsables.',
    infos: [
      { label: 'Contexte', valeur: 'WS401 · BUT MMI' },
      { label: 'Équipe', valeur: '5 personnes' },
      { label: 'Support', valeur: 'Web et mobile' },
      { label: 'Livrables', valeur: 'Charte, pictos, composants, maquettes' },
    ],
    figmaLink: 'https://www.figma.com/design/X2muTfFrU4o62ABzqQwtlU/Carb-On---WS401-%7C-Lou-CALMES-%7C-Rafael-TEIXEIRA-%7C-Marwan-BOUCHEBBAT-%7C-Radouan-OURIRI-%7C-Rahman-TURKMEN?node-id=0-1&t=khOQ4HSUyCeqN3lc-1',
    accent: '#117D6F',
    large: true,
    premier: { titre: 'Tableau de bord', texte: 'La même vue sur ordinateur et sur téléphone.', vignette: '/design/carbon.webp' },
    etapes: [
      {
        etape: 'Intégration',
        titre: 'L’app développée',
        texte: 'Front Vue 3 et Tailwind, back-office Symfony.',
        image: '/carbon.webp',
        vignette: '/carbon.webp',
        lien: { href: 'https://sae401.mmi24b07.mmi-troyes.fr', label: 'Voir le site' },
      },
      {
        etape: 'Rendu',
        titre: 'En ligne',
        texte: 'Parcours dans l’application publiée.',
        video: '/projets/carbon.mp4',
        vignette: '/projets/carbon.webp',
        lien: { href: 'https://sae401.mmi24b07.mmi-troyes.fr', label: 'Voir le site' },
      },
    ],
    maquettes: (
      <>
        <Ordi src="/design/carbon.webp" alt="Carb’On — tableau de bord desktop" className={`left-[6%] top-[15%] w-[72%] md:left-[10%] md:top-[12%] md:w-[56%] group-hover:-translate-y-2 ${souleve}`} />
        <Tel src="/design/carbon-mobile.webp" alt="Carb’On — tableau de bord mobile" className={`absolute right-[7%] bottom-[8%] h-[70%] md:right-[13%] md:top-[9%] md:bottom-auto md:h-[82%] group-hover:-translate-y-4 ${souleve}`} />
      </>
    ),
  },
  {
    id: 'matos',
    ecrans: [{ src: '/design/matos-accueil.webp' }, { src: '/design/matos-admin.webp' }, { src: '/design/matos-mobile-accueil.webp', tel: true }],
    name: 'Matos',
    tags: ['Web', 'Mobile', 'UI', 'UX'],
    resume:
      'Application de prêt de matériel du département MMI de l’IUT de Troyes. Refonte complète de l’interface étudiant et du back-office : parcours de réservation en étapes, planning des disponibilités, version mobile avec barre d’onglets, e-mails et fiche PDF redessinés.',
    infos: [
      { label: 'Contexte', valeur: 'Outil interne · IUT de Troyes' },
      { label: 'Rôle', valeur: 'Refonte UI/UX étudiant et admin' },
      { label: 'Support', valeur: 'Web responsive' },
      { label: 'Stack', valeur: 'Symfony · Twig · Tailwind · daisyUI' },
    ],
    accent: '#0EA5E9',
    large: true,
    maquettes: (
      <>
        <Ordi src="/design/matos-accueil.webp" alt="Matos — accueil étudiant" className={`left-[6%] top-[16%] w-[66%] md:left-[10%] md:top-[11%] md:w-[58%] group-hover:-translate-y-2 ${souleve}`} />
        <Tel src="/design/matos-mobile-accueil.webp" alt="Matos — accueil mobile" className={`absolute right-[6%] top-[12%] h-[76%] md:right-[13%] md:top-[9%] md:h-[82%] group-hover:-translate-y-4 ${souleve}`} />
      </>
    ),
    premier: { etape: 'Refonte', titre: 'Accueil étudiant', texte: 'Prochain retrait, catégories de matériel et planning, sur ordinateur et téléphone.', vignette: '/design/matos-accueil.webp' },
    etapes: [
      {
        etape: 'Parcours',
        titre: 'Réservation en 3 étapes',
        texte: 'Créneau, matériel puis projet, avec le récapitulatif de la demande toujours visible.',
        image: '/design/matos-reservation.webp',
        vignette: '/design/matos-reservation.webp',
      },
      {
        etape: 'Mobile',
        titre: 'Pensé pour le téléphone',
        texte: 'Barre d’onglets, sélection des jours au pouce et bouton d’action fixe en bas d’écran.',
        image: '/design/matos-mobile-reservation.webp',
        vignette: '/design/matos-mobile-reservation.webp',
        cadrage: 'entier',
      },
      {
        etape: 'Back-office',
        titre: 'Tableau de bord admin',
        texte: 'Demandes à traiter, départs et retours à venir, matériel actuellement sorti.',
        image: '/design/matos-admin.webp',
        vignette: '/design/matos-admin.webp',
      },
    ],
  },
  {
    id: 'niche',
    ecrans: [{ src: '/design/niche.webp', ratio: 16 / 9 }, { src: '/design/niche-dlc.webp', ratio: 16 / 9 }, { src: '/design/niche-mobile.webp', tel: true }],
    name: 'Jeux de Niche',
    tags: ['Web', 'Mobile', 'UX'],
    resume:
      'Plateforme façon Steam dédiée aux jeux de niche : deux prototypes d’expériences — bibliothèque et boutique sur ordinateur, fil d’actualité sur téléphone — dans une identité sombre et immersive.',
    infos: [
      { label: 'Contexte', valeur: 'WR403D · BUT MMI' },
      { label: 'Équipe', valeur: '4 personnes' },
      { label: 'Support', valeur: 'Web et mobile' },
      { label: 'Livrables', valeur: 'Storyboard, charte, 2 prototypes' },
    ],
    figmaLink: 'https://www.figma.com/design/hn98fGNUkjNcm2jeSnKCTG/WR403D---Lou-CALMES-_-Rafael-TEIXEIRA-_-Marwan-BOUCHEBBAT-_-Radouan-OURIRI?node-id=37-3&t=XR5rbCbAUBuj2eca-1',
    accent: '#7c3aed',
    large: true,
    premier: { titre: 'Découvrir', texte: 'La boutique sur ordinateur et le fil d’actualité sur téléphone.', vignette: '/design/niche.webp' },
    etapes: [
      {
        etape: 'Maquette',
        titre: 'Bibliothèque',
        texte: 'Les jeux récents et toute la collection, avec temps de jeu et succès.',
        image: '/design/niche-bibliotheque.webp',
        vignette: '/design/niche-bibliotheque.webp',
      },
      {
        etape: 'Maquette',
        titre: 'Page d’un DLC',
        texte: 'Présentation, avis de la communauté et score Metacritic.',
        image: '/design/niche-dlc.webp',
        vignette: '/design/niche-dlc.webp',
      },
      {
        etape: 'Prototype',
        titre: 'Achat',
        texte: 'Le panier et le paiement, dernière étape du prototype.',
        image: '/design/niche-dlc-achat.webp',
        vignette: '/design/niche-dlc-achat.webp',
      },
    ],
    maquettes: (
      <>
        <Ordi src="/design/niche.webp" alt="Jeux de Niche — page Découvrir" ratio="aspect-video" className={`left-[6%] top-[16%] w-[66%] md:left-[10%] md:top-[12%] md:w-[58%] group-hover:-translate-y-2 ${souleve}`} />
        <Tel src="/design/niche-mobile.webp" alt="Jeux de Niche — fil d’actualité mobile" className={`absolute right-[6%] top-[12%] h-[76%] md:right-[13%] md:top-[9%] md:h-[82%] group-hover:-translate-y-4 ${souleve}`} />
      </>
    ),
  },
];

// Section « savoir-faire » : le maquettage, avec les compétences associées
// Section 01 : les maquettes mobiles en éventail, comme dans le CV vidéo
const projetsTelephone: ProjetTelephone[] = [
  {
    nom: 'Penderie',
    etape: 'App mobile · Expo',
    texte: 'Garde-robe intelligente : chaque vêtement rangé, retrouvé et associé en tenues.',
    couleur: '#D31D66',
    arriere: { src: '/design/penderie-2.webp', alt: 'Penderie — accueil en thème sombre', fond: '#141414', haut: true },
    // Ajouter un vêtement : son type, ses infos, et il est rangé dans le dressing
    parcours: {
      alt: 'Penderie — parcours d’ajout d’un vêtement',
      w: 393,
      pad: 30,
      fond: '#fbf8fb',
      ecrans: ['/design/parcours/pen-1.webp', '/design/parcours/pen-2.webp', '/design/parcours/pen-3.webp', '/design/parcours/pen-4.webp'],
      etapes: [{ tap: [288, 187], vers: 1 }, { tap: [75, 249] }, { tap: [197, 699], vers: 2 }, { defile: 396 }, { tap: [197, 776], vers: 3 }],
    },
  },
  {
    nom: 'Matos',
    etape: 'Web app mobile · Symfony',
    texte: 'Emprunter du matériel à l’IUT : une catégorie, un appareil, et c’est réservé.',
    couleur: '#2563EB',
    arriere: { src: '/design/matos-mobile-accueil.webp', alt: 'Matos — accueil mobile', fond: '#ffffff', haut: true },
    // Emprunter un appareil : une catégorie, un appareil, et c'est réservé
    parcours: {
      alt: 'Matos — parcours d’emprunt d’un appareil',
      w: 390,
      pad: 0,
      fond: '#ffffff',
      ecrans: ['/design/parcours/mat-1.webp', '/design/parcours/mat-2.webp', '/design/parcours/mat-3.webp', '/design/parcours/mat-4.webp', '/design/parcours/mat-5.webp'],
      etapes: [{ tap: [58, 390], vers: 1 }, { tap: [195, 404], vers: 2, fondu: true }, { tap: [194, 785], vers: 3, fondu: true }, { tap: [285, 785], vers: 4 }],
    },
  },
  {
    nom: 'Carb’On',
    etape: 'Web app mobile · Vue 3',
    texte: 'Ajouter une activité et voir tout de suite son empreinte carbone.',
    couleur: '#16A34A',
    arriere: { src: '/design/carbon-mobile.webp', alt: 'Carb’On — tableau de bord et score', fond: '#ffffff', haut: true },
    // Prototype : ajouter une activité et voir tout de suite son empreinte carbone
    parcours: {
      alt: 'Carb’On — prototype d’ajout d’une activité',
      w: 393,
      pad: 30,
      fond: '#ffffff',
      ecrans: ['/design/parcours/car-2.webp', '/design/parcours/car-3.webp', '/design/parcours/car-4.webp', '/design/parcours/car-1.webp'],
      etapes: [{ tap: [197, 290], vers: 1 }, { tap: [233, 635] }, { tap: [292, 782], vers: 2 }, { tap: [292, 783], vers: 3 }],
    },
  },
];

function SectionSavoirFaire({ numero, surtitre, titre, texte, competences, outils, visuel, accent, id }: { numero: string; surtitre: string; titre: string; texte: string; competences: string[]; outils: string[]; visuel: React.ReactNode; accent: string; id: string }) {
  return (
    <section aria-labelledby={`titre-${id}`} className="border-t border-black/10 dark:border-white/10 px-6 md:px-10 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        {/* Texte et compétences à gauche */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
            {numero} — {surtitre}
          </p>
          <h2 id={`titre-${id}`} className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
            {titre}
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-black/60 dark:text-white/60">{texte}</p>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {competences.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm text-black/80 dark:text-white/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2">
            {outils.map((o) => {
              const icone = getTechIcon(o);
              return (
                <span key={o} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-xs text-black/70 dark:text-white/70">
                  {icone && <span className="text-sm">{icone}</span>}
                  {o}
                </span>
              );
            })}
          </div>
        </div>
        {/* Carrousel à droite */}
        {visuel}
      </div>
    </section>
  );
}

// Entrées de la fiche, calées sur les scènes projet du CV vidéo : surtitre qui monte, titre
// qui sort d'un masque, cases d'infos puis étiquettes qui arrivent l'une après l'autre
const easeFiche: [number, number, number, number] = [0.76, 0, 0.24, 1];
const monte = (delai: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeFiche, delay: delai } },
});

function CarteProjet({ projet, index, total }: { projet: Projet; index: number; total: number }) {
  const numero = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const contexte = projet.infos.find((i) => i.label === 'Contexte')?.valeur;
  const support = projet.infos.find((i) => i.label === 'Support')?.valeur;
  // Étiquettes de la fiche : l'outil, puis les disciplines du projet
  const etiquettes = [...(projet.figmaLink ? ['Figma'] : []), ...projet.tags];

  return (
    <article aria-labelledby={`fiche-${projet.id}`}>
      {/* Repère du projet, comme l'en-tête de la vidéo : numéro à droite et fine ligne de progression */}
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-black/45 dark:text-white/45">
        <span>Projet</span>
        <span className="tabular-nums">{numero}</span>
      </div>
      <div className="relative mt-3 h-px bg-black/10 dark:bg-white/15">
        <motion.span
          className="absolute inset-y-0 left-0 block origin-left"
          style={{ background: projet.accent, width: `${((index + 1) / total) * 100}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1, transition: { duration: 1.1, ease: easeFiche } }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute -top-[3px] block h-[7px] w-[7px] -translate-x-1/2"
          style={{ background: projet.accent, left: `${((index + 1) / total) * 100}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.9 } }}
        />
      </div>

      {/* Titre à gauche, présentation à droite */}
      <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.15fr_1fr] md:items-end md:gap-16">
        <div>
          <motion.p {...monte(0.05)} className="font-mono text-[11px] uppercase tracking-[0.25em] text-black/45 md:text-xs dark:text-white/45">
            {[contexte, support].filter(Boolean).join(' · ')}
          </motion.p>
          <h2 id={`fiche-${projet.id}`} className="mt-3 overflow-hidden text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            <motion.span
              className="block pb-[0.08em]"
              initial={{ y: '105%' }}
              animate={{ y: 0, transition: { duration: 0.9, ease: easeFiche, delay: 0.1 } }}
            >
              {projet.name}
            </motion.span>
          </h2>
        </div>
        <motion.div {...monte(0.3)}>
          <p className="text-base leading-relaxed text-black/65 md:text-lg dark:text-white/65">{projet.resume}</p>
          {projet.figmaLink && (
            <a
              href={projet.figmaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/figma mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.03] dark:bg-white dark:text-black"
            >
              Voir la maquette sur Figma
              <span aria-hidden="true" className="transition-transform duration-300 group-hover/figma:translate-x-0.5 group-hover/figma:-translate-y-0.5">↗</span>
              <span className="sr-only">(nouvel onglet)</span>
            </a>
          )}
        </motion.div>
      </div>

      {/* Le carrousel posé dans une fenêtre, comme les captures de la vidéo */}
      <motion.figure {...monte(0.45)} className="mt-10 overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)] md:mt-14 md:rounded-3xl dark:ring-white/10">
        <div className="flex items-center gap-2 border-b border-black/10 bg-neutral-100 px-4 py-2.5 dark:border-white/10 dark:bg-[#111]" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-black/15 dark:bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15 dark:bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/15 dark:bg-white/20" />
          <span className="ml-3 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 md:text-[11px] dark:text-white/45">
            Figma · {projet.name}
          </span>
        </div>
        <div className="[&>div]:rounded-none!">
          <CarrouselProjet
            id={projet.id}
            accent={projet.accent}
            large={projet.large}
            slides={[
              {
                ...projet.premier,
                etape: projet.premier.etape ?? 'Maquette',
                composition: projet.maquettes,
                lien: projet.figmaLink ? { href: projet.figmaLink, label: 'Voir sur Figma' } : undefined,
              },
              ...projet.etapes,
            ]}
          />
        </div>
      </motion.figure>

      {/* Infos en cases, comme les chiffres clés de la vidéo, puis les compétences mobilisées */}
      <dl className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4">
        {projet.infos.map(({ label, valeur }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: easeFiche, delay: 0.6 + i * 0.07 } }}
            className="rounded-xl border border-black/10 bg-white/75 p-4 backdrop-blur-sm md:p-5 dark:border-white/10 dark:bg-[#0b0b0b]/75"
          >
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 dark:text-white/45">{label}</dt>
            <dd className="mt-2 text-sm font-medium leading-snug text-black/85 md:text-base dark:text-white/85">{valeur}</dd>
          </motion.div>
        ))}
      </dl>
      <div className="mt-8">
        <motion.p {...monte(0.85)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/45 dark:text-white/45">
          Compétences mobilisées
        </motion.p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {etiquettes.map((e, i) => {
            const icone = getTechIcon(e);
            return (
              <motion.li
                key={e}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'backOut', delay: 0.95 + i * 0.08 } }}
                className="inline-flex items-center gap-2 border border-black/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-black/75 dark:border-white/15 dark:text-white/75"
              >
                {icone ? <span className="text-sm">{icone}</span> : <span aria-hidden="true" className="h-1.5 w-1.5" style={{ background: projet.accent }} />}
                {e}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

export default function DesignPage() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      reveler(textRefs.current);
    });
    return () => ctx.revert();
  }, []);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el);
  };
  // Projet affiché en grand ; les autres restent visibles dans la rangée de vignettes
  const [choisi, setChoisi] = useState(0);
  const projet = projets[choisi];
  const lenis = useLenis();
  const ouvrir = (i: number) => {
    setChoisi(i);
    const cible = document.getElementById('projet-affiche');
    if (cible) lenis?.scrollTo(cible, { offset: -110, duration: 1.2 });
  };
  const galerie: ProjetGalerie[] = projets.map((p) => ({ nom: p.name, accent: p.accent, legende: p.resume, tags: p.tags, ecrans: p.ecrans }));

  return (
    <main className={`${spaceGrotesk.className} text-black dark:text-white min-h-screen overflow-x-clip transition-colors duration-500`}>
      <Navbar />

      {/* OUVERTURE : bandeau titre + média de la carte d’accueil */}
      <HeroProjet id="design" />

      {/* INTRO */}
      <section className="relative z-10 pt-10 px-6 md:px-10 pb-16 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-black/10 dark:border-white/20 pt-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-black/90 dark:text-white/90">
                Interfaces pensées pour l&apos;utilisateur
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
                Du wireframe au prototype cliquable, chaque projet est conçu avec
                une approche centrée sur l&apos;expérience utilisateur, la cohérence
                visuelle et la simplicité d&apos;usage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETS : galerie de tous les projets façon ORE, le projet cliqué s'affiche en grand dessous */}
      <section aria-label="Projets de design" className="px-6 md:px-10 pb-32">
        <div ref={addRef} className="max-w-7xl mx-auto">
          <GalerieProjets projets={galerie} choisi={choisi} onChoisir={ouvrir} />

          <div id="projet-affiche" aria-live="polite" className="mt-14 md:mt-20">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={projet.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              >
                <CarteProjet projet={projet} index={choisi} total={projets.length} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SAVOIR-FAIRE : maquettage, compétences à gauche, téléphones à droite */}
      <SectionSavoirFaire
        id="maquettage"
        numero="01"
        surtitre="Création de maquettes"
        titre="De l’idée à la maquette"
        texte="Je pars des besoins des utilisateurs pour construire des parcours clairs, puis je les mets en forme dans Figma jusqu’au prototype cliquable, avec un design system réutilisable."
        competences={['UX research : benchmark, personas, parcours', 'Wireframes et architecture de l’information', 'UI design desktop et mobile', 'Design system : composants, styles, variables', 'Prototypage interactif', 'Chartes graphiques et iconographie']}
        outils={['Figma', 'Prototypage', 'UX Research', 'UI Design']}
        visuel={<CarrouselTelephones projets={projetsTelephone} />}
        accent="#D31D66"
      />

      {/* FOOTER NAV + COPYRIGHT */}
      <PageFooter precedent={{ href: '/projets', label: 'Projets' }} suivant={{ href: '/competences', label: 'Compétences' }} />
    </main>
  );
}

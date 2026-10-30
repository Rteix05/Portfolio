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

// Sections « savoir-faire » : du maquettage à l'intégration, avec les compétences associées
const slidesMaquettes: Slide[] = [
  { etape: 'Penderie · Mobile', titre: 'Générateur de tenues', texte: 'Parcours complet, des préférences à la tenue enregistrée.', image: '/design/penderie-tenues.webp', vignette: '/design/penderie-tenues.webp' },
  { etape: 'Sommeval · Desktop', titre: 'Accueil de la mairie', texte: 'Hiérarchie de l’information et charte graphique appliquée.', image: '/design/sommeval.webp', vignette: '/design/sommeval.webp' },
  { etape: 'Carb’On · Web', titre: 'Tableau de bord', texte: 'Gamification : score, points et classement entre amis.', image: '/design/carbon.webp', vignette: '/design/carbon.webp' },
  { etape: 'Jeux de Niche · Prototype', titre: 'Bibliothèque', texte: 'Identité sombre et immersive pour une plateforme de jeux.', image: '/design/niche-bibliotheque.webp', vignette: '/design/niche-bibliotheque.webp' },
  { etape: 'Jeux de Niche · Prototype', titre: 'Page d’un DLC', texte: 'Fiche produit, avis et parcours d’achat prototypé.', image: '/design/niche-dlc.webp', vignette: '/design/niche-dlc.webp' },
  { etape: 'Sommeval · Desktop', titre: 'Actualités', texte: 'Grille de contenus pensée pour la mise à jour par la mairie.', image: '/design/sommeval-actus.webp', vignette: '/design/sommeval-actus.webp' },
];

const slidesIntegration: Slide[] = [
  { etape: 'React Native · Expo', titre: 'Penderie', texte: 'Application mobile branchée sur une API Symfony.', video: '/projets/penderie.mp4', vignette: '/projets/penderie.webp', cadrage: 'entier' },
  { etape: 'React · Symfony', titre: 'Sommeval', texte: 'Site headless intégré depuis la maquette, accessible (RGAA).', image: '/projets/sommeval-image.webp', vignette: '/projets/sommeval-image.webp', lien: { href: 'http://sae301.mmi24b11.mmi-troyes.fr/', label: 'Voir le site' } },
  { etape: 'Vue 3 · Tailwind', titre: 'Carb’On', texte: 'Application mobile-first avec back-office EasyAdmin.', video: '/projets/carbon.mp4', vignette: '/projets/carbon.webp', lien: { href: 'https://sae401.mmi24b07.mmi-troyes.fr', label: 'Voir le site' } },
  { etape: 'Symfony · Twig · Tailwind', titre: 'Matos', texte: 'Refonte responsive de l’app de prêt de matériel de l’IUT.', image: '/design/matos-accueil.webp', vignette: '/design/matos-accueil.webp' },
  { etape: 'Next.js · GSAP · R3F', titre: 'Ce portfolio', texte: 'Animations au scroll, 3D temps réel et transitions entre pages.', video: '/projets/portfolio.mp4', vignette: '/projets/portfolio.webp', lien: { href: 'https://rafaelteixeira.fr', label: 'Voir le site' } },
];

function SectionSavoirFaire({ numero, surtitre, titre, texte, competences, outils, slides, accent, id }: { numero: string; surtitre: string; titre: string; texte: string; competences: string[]; outils: string[]; slides: Slide[]; accent: string; id: string }) {
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
        <CarrouselProjet id={id} slides={slides} accent={accent} large={false} />
      </div>
    </section>
  );
}

function CarteProjet({ projet, index, addRef }: { projet: Projet; index: number; addRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={addRef} className={`group ${projet.large ? 'md:col-span-2' : ''}`}>
      {/* En-tête : — Nom →, lien vers le fichier Figma, et ses étiquettes */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {projet.figmaLink ? (
            <a href={projet.figmaLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3" aria-label={`${projet.name} — voir la maquette sur Figma (nouvel onglet)`}>
              <span className="text-black/30 dark:text-white/30 font-mono text-sm">0{index + 1}</span>
              <span>— {projet.name}</span>
              <span aria-hidden="true" className="transition-transform duration-500 ease-out-soft group-hover:translate-x-1.5" style={{ color: projet.accent }}>
                →
              </span>
            </a>
          ) : (
            <span className="flex items-center gap-3">
              <span className="text-black/30 dark:text-white/30 font-mono text-sm">0{index + 1}</span>
              <span>— {projet.name}</span>
            </span>
          )}
        </h2>
        <div className="hidden sm:flex flex-wrap justify-end gap-2">
          {projet.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-black/15 dark:border-white/20 px-3 py-0.5 text-[11px] uppercase tracking-widest text-black/60 dark:text-white/60">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Carrousel : maquette, puis intégration et rendu (ou d'autres pages de la maquette) */}
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

      {/* Infos en petit, à la manière d'un cartel */}
      <div className={`mt-6 grid gap-6 ${projet.large ? 'md:grid-cols-[1.4fr_1fr]' : ''}`}>
        <p className="text-sm md:text-base leading-relaxed text-black/65 dark:text-white/65 max-w-xl">{projet.resume}</p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
          {projet.infos.map(({ label, valeur }) => (
            <div key={label}>
              <dt className="uppercase tracking-widest text-black/40 dark:text-white/40">{label}</dt>
              <dd className="mt-1 text-sm text-black/80 dark:text-white/80">{valeur}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
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
                <CarteProjet projet={projet} index={choisi} addRef={() => {}} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SAVOIR-FAIRE : maquettage puis intégration, compétences à gauche, carrousel à droite */}
      <SectionSavoirFaire
        id="maquettage"
        numero="01"
        surtitre="Création de maquettes"
        titre="De l’idée à la maquette"
        texte="Je pars des besoins des utilisateurs pour construire des parcours clairs, puis je les mets en forme dans Figma jusqu’au prototype cliquable, avec un design system réutilisable."
        competences={['UX research : benchmark, personas, parcours', 'Wireframes et architecture de l’information', 'UI design desktop et mobile', 'Design system : composants, styles, variables', 'Prototypage interactif', 'Chartes graphiques et iconographie']}
        outils={['Figma', 'Prototypage', 'UX Research', 'UI Design']}
        slides={slidesMaquettes}
        accent="#D31D66"
      />
      <SectionSavoirFaire
        id="integration"
        numero="02"
        surtitre="Intégration front-end"
        titre="De la maquette au code"
        texte="Je transforme ces maquettes en interfaces réelles, fidèles au pixel près, responsives et accessibles, avec des animations qui servent l’expérience."
        competences={['Intégration fidèle à la maquette', 'Responsive et mobile-first', 'Composants réutilisables et typés', 'Animations et transitions (GSAP, Framer Motion)', 'Accessibilité (RGAA) et performance', 'Branchement à une API (Symfony, API Platform)']}
        outils={['Next.js', 'React', 'React Native', 'Expo', 'Vue.js', 'TypeScript', 'TailwindCSS', 'GSAP', 'Framer Motion', 'Symfony']}
        slides={slidesIntegration}
        accent="#0EA5E9"
      />

      {/* FOOTER NAV + COPYRIGHT */}
      <PageFooter precedent={{ href: '/projets', label: 'Projets' }} suivant={{ href: '/competences', label: 'Compétences' }} />
    </main>
  );
}

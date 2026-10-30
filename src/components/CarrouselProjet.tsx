'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

export type Slide = {
  // Étape du projet affichée en petit : Maquette, Intégration, Rendu…
  etape: string;
  titre: string;
  texte: string;
  // Fond du slide : une composition de maquettes, une image ou une vidéo (avec son affiche)
  composition?: React.ReactNode;
  image?: string;
  video?: string;
  // Image de la carte en attente dans la file
  vignette: string;
  // « entier » : média affiché en entier sur un fond flou (vidéo d'app au format téléphone…)
  cadrage?: 'plein' | 'entier';
  lien?: { href: string; label: string };
};

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];
const DUREE = 0.85;

// Texte qui sort du flou, ligne après ligne, comme sur la démo
const flou = {
  cache: { opacity: 0, filter: 'blur(12px)', y: 12 },
  visible: (i: number) => ({ opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.6, ease: 'easeOut' as const, delay: DUREE * 0.75 + i * 0.12 } }),
  sortie: { opacity: 0, filter: 'blur(8px)', transition: { duration: 0.25 } },
};

function Fond({ slide, accent }: { slide: Slide; accent: string }) {
  if (slide.composition) {
    return (
      <div className="absolute inset-0" style={{ background: `color-mix(in oklab, ${accent} 22%, #0b0b0b)` }}>
        {slide.composition}
      </div>
    );
  }
  const entier = slide.cadrage === 'entier';
  const ajustement = entier ? 'object-contain' : 'object-cover object-top';
  return (
    <>
      {entier && <Image src={slide.vignette} alt="" fill sizes="40vw" className="object-cover blur-2xl scale-125 opacity-80" />}
      {slide.video ? (
        <video autoPlay muted loop playsInline disablePictureInPicture aria-hidden="true" poster={slide.vignette} className={`absolute inset-0 h-full w-full ${ajustement}`}>
          <source src={slide.video} type="video/mp4" />
        </video>
      ) : (
        <Image src={slide.image ?? slide.vignette} alt="" fill sizes="(max-width: 768px) 100vw, 80vw" className={ajustement} />
      )}
    </>
  );
}

// Bouton rond en verre dépoli avec une flèche au trait, qui glisse vers sa direction au survol
function BoutonFleche({ sens, onClick }: { sens: 'precedent' | 'suivant'; onClick: () => void }) {
  const gauche = sens === 'precedent';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={gauche ? 'Étape précédente' : 'Étape suivante'}
      className="group/fleche flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-[background-color,color,box-shadow] duration-300 hover:bg-white hover:text-black hover:ring-white md:h-11 md:w-11"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 transition-transform duration-300 ease-out-soft md:h-5 md:w-5 ${gauche ? 'rotate-180 group-hover/fleche:-translate-x-0.5' : 'group-hover/fleche:translate-x-0.5'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}

/**
 * Carrousel d'un projet, d'après la démo slide.mp4 : le slide actif occupe tout le panneau,
 * les suivants attendent en cartes à droite. Au clic sur « suivant », la première carte
 * s'agrandit jusqu'à remplir le fond, puis le texte apparaît en sortant du flou.
 */
export default function CarrouselProjet({ id, slides, accent, large }: { id: string; slides: Slide[]; accent: string; large: boolean }) {
  const [actif, setActif] = useState(0);
  // Slide affiché sous celui qui s'agrandit, pour ne jamais voir de vide pendant l'animation
  const [dessous, setDessous] = useState<number | null>(null);
  const [enCours, setEnCours] = useState(false);
  const total = slides.length;

  const aller = (cible: number) => {
    if (enCours || cible === actif) return;
    setDessous(actif);
    setActif(cible);
    setEnCours(true);
  };
  const suivant = () => aller((actif + 1) % total);
  const precedent = () => aller((actif - 1 + total) % total);

  // File d'attente : les slides suivants, dans l'ordre, sans le slide actif
  const file = Array.from({ length: total - 1 }, (_, k) => (actif + 1 + k) % total).slice(0, large ? 3 : 2);
  const slide = slides[actif];

  return (
    <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl bg-black ${large ? 'aspect-4/3 md:aspect-16/7' : 'aspect-4/3'}`}>
      <LayoutGroup id={`carrousel-${id}`}>
        {/* Slide précédent, laissé en dessous pendant que le nouveau s'agrandit */}
        {dessous !== null && (
          <div className="absolute inset-0">
            <Fond slide={slides[dessous]} accent={accent} />
          </div>
        )}

        {/* Slide actif : même layoutId que sa carte dans la file, framer-motion anime la carte jusqu'au plein cadre */}
        <motion.div
          key={`fond-${actif}`}
          layoutId={`slide-${id}-${actif}`}
          transition={{ duration: DUREE, ease }}
          onLayoutAnimationComplete={() => {
            setDessous(null);
            setEnCours(false);
          }}
          className="absolute inset-0 overflow-hidden"
          style={{ borderRadius: 0 }}
        >
          <Fond slide={slide} accent={accent} />
        </motion.div>

        {/* Voile pour la lisibilité du texte */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent md:bg-linear-to-r md:from-black/75 md:via-black/30" />

        {/* Texte du slide : à gauche, centré verticalement (en bas sur téléphone) */}
        <div className="absolute bottom-0 left-0 z-10 max-w-[78%] p-5 text-white md:bottom-auto md:top-1/2 md:max-w-[44%] md:-translate-y-1/2 md:p-10">
          <AnimatePresence mode="popLayout">
            <motion.div key={`texte-${actif}`} initial="cache" animate="visible" exit="sortie">
              <motion.p variants={flou} custom={0} className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em]" style={{ color: `color-mix(in oklab, ${accent} 55%, white)` }}>
                {String(actif + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {slide.etape}
              </motion.p>
              <motion.p variants={flou} custom={1} className="mt-2 text-xl md:text-4xl font-semibold tracking-tight leading-tight">
                {slide.titre}
              </motion.p>
              <motion.p variants={flou} custom={2} className="mt-2 hidden sm:block text-sm text-white/75 leading-relaxed">
                {slide.texte}
              </motion.p>
              {slide.lien && (
                <motion.a
                  variants={flou}
                  custom={3}
                  href={slide.lien.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs md:text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.04]"
                >
                  {slide.lien.label} <span aria-hidden="true">↗</span>
                </motion.a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* En bas à droite : la file des slides suivants et les commandes dessous */}
        <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-4 md:bottom-7 md:right-8">
          <div className="hidden items-end gap-3 md:flex">
            {file.map((index, rang) => {
              const prochain = rang === 0;
              const taille = large ? (prochain ? 'h-52 w-36' : 'h-44 w-28') : prochain ? 'h-40 w-28' : 'h-32 w-22';
              return (
                <motion.button
                  key={`carte-${index}`}
                  type="button"
                  // Le slide qui vient de quitter le fond rejoint la file en simple fondu, sans
                  // rapetisser à travers le panneau : seul le slide choisi s'agrandit
                  layoutId={index === dessous ? undefined : `slide-${id}-${index}`}
                  transition={{ duration: DUREE, ease }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => aller(index)}
                  aria-label={`Voir l’étape ${index + 1} : ${slides[index].titre}`}
                  className={`group/carte relative overflow-hidden ${taille}`}
                  style={{ borderRadius: 18 }}
                >
                  {/* Le soulèvement au survol vit sur un calque intérieur : le bouton, lui, est animé par framer-motion */}
                  <span className="absolute inset-0 block overflow-hidden rounded-[18px] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.8)] ring-1 ring-white/20 transition-[transform,box-shadow] duration-500 ease-out-soft group-hover/carte:-translate-y-1.5 group-hover/carte:ring-white/50">
                    <Image src={slides[index].vignette} alt="" fill sizes="150px" className="object-cover object-top transition-transform duration-700 ease-out-soft group-hover/carte:scale-[1.07]" />
                    <span className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 block p-3 text-left">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">
                        {prochain ? 'Suivant' : String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-medium leading-tight text-white line-clamp-2">{slides[index].titre}</span>
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Commandes : précédent, progression segmentée (cliquable), suivant */}
          <div className="flex items-center gap-3 rounded-full bg-black/35 p-1.5 ring-1 ring-white/10 backdrop-blur-md">
            <BoutonFleche sens="precedent" onClick={precedent} />
            <div className="hidden items-center gap-1.5 sm:flex" role="group" aria-label="Étapes">
              {slides.map((s, i) => (
                <button
                  key={s.titre + i}
                  type="button"
                  onClick={() => aller(i)}
                  aria-label={`Étape ${i + 1} : ${s.titre}`}
                  aria-current={i === actif ? 'step' : undefined}
                  className="group/seg flex h-6 items-center"
                >
                  <span
                    className={`block h-0.75 rounded-full transition-all duration-500 ease-out-soft ${i === actif ? 'w-8' : 'w-3 bg-white/35 group-hover/seg:bg-white/70'}`}
                    style={i === actif ? { background: 'white' } : undefined}
                  />
                </button>
              ))}
            </div>
            <span className="font-mono text-[11px] tabular-nums tracking-widest text-white/70 sm:hidden">
              {String(actif + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </span>
            <BoutonFleche sens="suivant" onClick={suivant} />
          </div>
        </div>
      </LayoutGroup>
    </div>
  );
}

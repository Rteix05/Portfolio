'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

// Écran fixe (téléphone de gauche). `haut` : bande sous l'île dynamique, de la couleur de
// l'écran, pour les captures qui n'ont pas de barre d'état.
type Ecran = { src: string; alt: string; fond: string; haut?: boolean };

// Parcours joué dans le téléphone de devant, repris du CV vidéo. Coordonnées en px de la
// maquette (largeur `w`) ; `pad` : hauteur de la barre d'état ajoutée au-dessus des écrans.
type Etape = { tap?: [number, number]; vers?: number; fondu?: boolean; defile?: number };
export type Parcours = { alt: string; w: number; pad: number; fond: string; ecrans: string[]; etapes: Etape[] };

export type ProjetTelephone = {
  nom: string;
  etape: string;
  texte: string;
  couleur: string;
  arriere: Ecran;
  parcours: Parcours;
};

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];
// Rythme du parcours (ms) : plus posé que dans la vidéo, pour qu'on ait le temps de suivre
const DEBUT = 900;
const APRES_NAV = 1000;
const APRES_TAP = 750;
const APRES_DEFILE = 1100;
const FIN = 1700;
const dureeParcours = (pc: Parcours) =>
  DEBUT + FIN + pc.etapes.reduce((t, e) => t + (e.defile ? APRES_DEFILE : e.vers !== undefined ? APRES_NAV : APRES_TAP), 0);

// Coque de téléphone dessinée en CSS : coque noire, filet clair et île dynamique
function Telephone({ fond, children }: { fond: string; children: React.ReactNode }) {
  return (
    <div className="relative aspect-9/19.5 w-full rounded-[17%/7.8%] bg-[#0a0a0a] p-[3.4%] shadow-[inset_0_0_0_2px_#3a3a3a,inset_0_0_0_5px_#050505,0_50px_90px_-30px_rgba(0,0,0,0.9)]">
      <div className="relative h-full w-full overflow-hidden rounded-[14%/6.4%]" style={{ background: fond }}>
        {children}
        <span aria-hidden="true" className="absolute left-1/2 top-[2.2%] z-10 h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

function EcranFixe({ ecran, sizes }: { ecran: Ecran; sizes: string }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 ${ecran.haut ? 'top-[6.5%]' : 'top-0'}`}>
      <Image src={ecran.src} alt={ecran.alt} fill sizes={sizes} className="object-cover object-top" />
    </div>
  );
}

/**
 * Parcours simulé, comme dans le CV vidéo : un doigt se pose sur un bouton, l'écran suivant
 * glisse depuis la droite (navigation) ou apparaît en fondu (fenêtre), et la page défile.
 * Le parcours tourne en boucle tant que `joue` est vrai ; sinon le premier écran reste affiché.
 */
function EcranParcours({ pc, joue }: { pc: Parcours; joue: boolean }) {
  const ecranRef = useRef<HTMLDivElement>(null);
  const [largeur, setLargeur] = useState(0);
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [fondu, setFondu] = useState(false);
  const [defile, setDefile] = useState<Record<number, number>>({});
  const [tap, setTap] = useState<{ x: number; y: number; n: number } | null>(null);

  useEffect(() => {
    const el = ecranRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setLargeur(el.clientWidth));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!joue) return;
    let fini = false;
    const minuteries: ReturnType<typeof setTimeout>[] = [];
    const attendre = (ms: number) => new Promise<void>((r) => minuteries.push(setTimeout(r, ms)));
    let n = 0;
    (async () => {
      let ici = 0;
      while (!fini) {
        await attendre(DEBUT);
        for (const e of pc.etapes) {
          if (fini) return;
          if (e.defile) {
            const ecran = ici;
            const y = e.defile;
            setDefile((d) => ({ ...d, [ecran]: y }));
            await attendre(APRES_DEFILE);
            continue;
          }
          if (e.tap) setTap({ x: e.tap[0], y: e.tap[1], n: ++n });
          if (e.vers !== undefined) {
            await attendre(140);
            setFondu(!!e.fondu);
            setPrev(ici);
            setCur(e.vers);
            ici = e.vers;
            await attendre(APRES_NAV - 140);
            setPrev(null);
          } else await attendre(APRES_TAP);
        }
        await attendre(FIN);
        if (fini) return;
        // Retour au premier écran en fondu, puis le parcours recommence
        setFondu(true);
        setPrev(ici);
        setCur(0);
        ici = 0;
        await attendre(500);
        setPrev(null);
        setDefile({});
      }
    })();
    return () => {
      fini = true;
      minuteries.forEach(clearTimeout);
    };
  }, [joue, pc]);

  const k = largeur / pc.w;
  return (
    <div ref={ecranRef} className="absolute inset-0" aria-label={pc.alt} role="img">
      {pc.ecrans.map((src, i) => {
        const etat = i === cur ? 'actif' : i === prev ? 'parti' : 'cache';
        return (
          <motion.div
            key={src}
            className="absolute inset-x-0"
            style={{ top: pc.pad * k, zIndex: etat === 'actif' ? 2 : etat === 'parti' ? 1 : 0 }}
            initial={false}
            animate={
              etat === 'actif'
                ? { x: '0%', opacity: 1, y: -(defile[i] ?? 0) * k }
                : etat === 'parti'
                  ? { x: fondu ? '0%' : '-25%', opacity: 1 }
                  : { x: '100%', opacity: 0, y: 0 }
            }
            transition={
              etat === 'cache'
                ? { duration: 0 }
                : {
                    x: { duration: fondu ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: fondu && etat === 'actif' ? 0.35 : 0 },
                    y: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
                  }
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" draggable={false} className="block h-auto w-full select-none" loading={i ? 'lazy' : 'eager'} />
          </motion.div>
        );
      })}
      {/* Barre d'état : le contenu défile dessous */}
      <div className="absolute inset-x-0 top-0 z-3" style={{ height: pc.pad * k, background: pc.fond }} />
      {/* Le doigt : un rond qui se pose sur le bouton puis s'efface */}
      {tap && (
        <motion.span
          key={tap.n}
          aria-hidden="true"
          className="absolute z-5 -ml-[5.5%] -mt-[5.5%] aspect-square w-[11%] rounded-full bg-black/20 ring-2 ring-black/60"
          style={{ left: tap.x * k, top: (pc.pad + tap.y) * k }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1, 1.5], opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, times: [0, 0.25, 1], ease: 'easeOut' }}
        />
      )}
    </div>
  );
}

function BoutonFleche({ sens, onClick }: { sens: 'precedent' | 'suivant'; onClick: () => void }) {
  const gauche = sens === 'precedent';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={gauche ? 'Projet précédent' : 'Projet suivant'}
      className="group/fleche flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black ring-1 ring-black/15 transition-[background-color,color,box-shadow] duration-300 hover:bg-black hover:text-white hover:ring-black md:h-11 md:w-11 dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white dark:hover:text-black dark:hover:ring-white"
    >
      <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-300 ease-out-soft md:h-5 md:w-5 ${gauche ? 'rotate-180 group-hover/fleche:-translate-x-0.5' : 'group-hover/fleche:translate-x-0.5'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  );
}

/**
 * Carrousel des maquettes mobiles, d'après la scène Penderie du CV vidéo : deux téléphones
 * en éventail, celui de gauche en retrait, celui de droite devant. Chaque projet arrive en
 * pivotant, et le carrousel avance seul tant qu'on ne le survole pas.
 */
export default function CarrouselTelephones({ projets }: { projets: ProjetTelephone[] }) {
  const [actif, setActif] = useState(0);
  const [sens, setSens] = useState(1);
  const [pause, setPause] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduit, setReduit] = useState(false);
  const cadre = useRef<HTMLDivElement>(null);
  const total = projets.length;
  const projet = projets[actif];
  // Le carrousel attend la fin du parcours joué dans le téléphone avant de passer au suivant
  const delai = dureeParcours(projet.parcours);

  const aller = (cible: number, s: number) => {
    setSens(s);
    setActif((cible + total) % total);
  };

  useEffect(() => {
    setReduit(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = cadre.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Défilement automatique, seulement à l'écran, sans survol ni focus, et sans mouvement réduit
  useEffect(() => {
    if (pause || !visible || reduit) return;
    const t = setTimeout(() => aller(actif + 1, 1), delai);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actif, pause, visible, reduit, delai]);

  // Arrivée façon CV vidéo : chaque téléphone pivote depuis le côté jusqu'à sa place
  const arrivee = (rang: number, ry: number, rz: number) => ({
    initial: reduit ? { opacity: 0 } : { opacity: 0, x: sens * (rang ? 90 : 60), rotateY: ry - sens * 55, rotateZ: rz },
    animate: { opacity: 1, x: 0, rotateY: ry, rotateZ: rz, transition: { duration: 0.9, ease, delay: rang * 0.12 } },
    exit: reduit ? { opacity: 0 } : { opacity: 0, x: -sens * 70, rotateY: ry + sens * 35, transition: { duration: 0.45, ease: 'easeIn' as const, delay: rang * 0.05 } },
  });

  return (
    <div
      ref={cadre}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Maquettes mobiles"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={() => setPause(false)}
      className="relative aspect-3/4 overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/5 sm:aspect-4/3 md:rounded-3xl dark:bg-[#0b0b0b] dark:ring-white/5"
    >
      {/* Halo de la couleur du projet, qui change en fondu */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`halo-${actif}`}
          aria-hidden="true"
          className="absolute inset-0 [--force-halo:22%] dark:[--force-halo:34%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.9 } }}
          exit={{ opacity: 0, transition: { duration: 0.9 } }}
          style={{ background: `radial-gradient(70% 65% at 68% 42%, color-mix(in oklab, ${projet.couleur} var(--force-halo), transparent), transparent 70%)` }}
        />
      </AnimatePresence>

      {/* Les deux téléphones en éventail */}
      <div className="absolute inset-x-0 top-0 h-[60%] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-full sm:w-[64%]" style={{ perspective: 1400 }}>
        <AnimatePresence initial={false} mode="popLayout" custom={sens}>
          <motion.div
            key={`arriere-${actif}`}
            {...arrivee(0, 16, -3)}
            className="absolute left-[19%] top-[12%] w-[29%] sm:left-[9%] sm:top-[17%] sm:w-[34%]"
            style={{ transformStyle: 'preserve-3d', zIndex: 1 }}
          >
            <Telephone fond={projet.arriere.fond}>
              <EcranFixe ecran={projet.arriere} sizes="(max-width: 640px) 33vw, 18vw" />
            </Telephone>
          </motion.div>
          <motion.div
            key={`avant-${actif}`}
            {...arrivee(1, -12, 2)}
            className="absolute left-[50%] top-[6%] w-[31%] sm:left-[52%] sm:top-[9%] sm:w-[36%]"
            style={{ transformStyle: 'preserve-3d', zIndex: 2 }}
          >
            <Telephone fond={projet.parcours.fond}>
              <EcranParcours pc={projet.parcours} joue={visible && !reduit} />
            </Telephone>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Projet affiché, annoncé aux lecteurs d'écran */}
      <div className="absolute bottom-16 left-0 z-10 max-w-full p-5 text-black dark:text-white sm:bottom-auto sm:top-1/2 sm:max-w-[40%] sm:-translate-y-1/2 md:p-10" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`texte-${actif}`}
            initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: 'easeOut', delay: 0.25 } }}
            exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.25 } }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-(--etape-clair) md:text-xs dark:text-(--etape-sombre)" style={{ '--etape-clair': `color-mix(in oklab, ${projet.couleur} 80%, black)`, '--etape-sombre': `color-mix(in oklab, ${projet.couleur} 55%, white)` } as React.CSSProperties}>
              {String(actif + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {projet.etape}
            </p>
            <p className="mt-2 text-2xl font-semibold leading-tight tracking-tight md:text-4xl">{projet.nom}</p>
            <p className="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/75">{projet.texte}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Commandes : flèches et segments, le segment actif se remplit pendant l'attente */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3 rounded-full bg-white/60 p-1.5 ring-1 ring-black/10 backdrop-blur-md md:bottom-7 md:right-8 dark:bg-black/35 dark:ring-white/10">
        <BoutonFleche sens="precedent" onClick={() => aller(actif - 1, -1)} />
        <div className="flex items-center gap-1.5" role="group" aria-label="Projets">
          {projets.map((p, i) => (
            <button
              key={p.nom}
              type="button"
              onClick={() => aller(i, i >= actif ? 1 : -1)}
              aria-label={`Voir ${p.nom}`}
              aria-current={i === actif ? 'true' : undefined}
              className="flex h-6 items-center"
            >
              <span className={`relative block h-1 overflow-hidden rounded-full bg-black/20 transition-[width] duration-500 dark:bg-white/25 ${i === actif ? 'w-8' : 'w-3 hover:bg-black/40 dark:hover:bg-white/50'}`}>
                {i === actif && (
                  <motion.span
                    key={`jauge-${actif}-${pause || !visible || reduit}`}
                    className="absolute inset-y-0 left-0 rounded-full bg-black dark:bg-white"
                    initial={{ width: pause || !visible || reduit ? '100%' : '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: pause || !visible || reduit ? 0 : delai / 1000, ease: 'linear' }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <BoutonFleche sens="suivant" onClick={() => aller(actif + 1, 1)} />
      </div>
    </div>
  );
}

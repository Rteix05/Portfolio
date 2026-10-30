'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export type EcranGalerie = { src: string; tel?: boolean; ratio?: number };

export type ProjetGalerie = {
  nom: string;
  accent: string;
  legende: string;
  tags: string[];
  ecrans: EcranGalerie[];
};

/* ---------- Disposition automatique : rien à placer à la main quand on ajoute un projet ---------- */

// Taille d'un îlot dans le monde de la carte (px à l'échelle 1)
const ILOT_L = 440;
const ILOT_H = 300;
const PAS_X = 600;
const PAS_Y = 440;

type Placement = { x: number; y: number; l: number; h: number; ecran: EcranGalerie };
type Ilot = { cx: number; cy: number; placements: Placement[] };

// Petit générateur pseudo-aléatoire stable, pour un léger désordre qui ne bouge pas d'un rendu à l'autre
const hasard = (graine: number) => {
  const x = Math.sin(graine * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// Compose un îlot à partir de ses écrans : grand écran desktop à gauche, second desktop
// en décalé dessous, téléphones en éventail à droite
function composer(ecrans: EcranGalerie[]): Placement[] {
  const ordis = ecrans.filter((e) => !e.tel);
  const tels = ecrans.filter((e) => e.tel);
  const placements: Placement[] = [];
  const largeurTels = tels.length ? 120 + (tels.length - 1) * 66 : 0;
  const largeurOrdi = Math.max(220, ILOT_L - largeurTels * 0.55);
  ordis.slice(0, 2).forEach((e, k) => {
    const ratio = e.ratio ?? 16 / 10;
    const l = k === 0 ? largeurOrdi : largeurOrdi * 0.66;
    placements.push({ x: k === 0 ? 0 : largeurOrdi * 0.42, y: k === 0 ? 40 : 40 + (largeurOrdi / ratio) * 0.62, l, h: l / ratio, ecran: e });
  });
  tels.slice(0, 3).forEach((e, k) => {
    const h = 262 - k * 22;
    const l = h * (e.ratio ?? 390 / 844);
    placements.push({ x: ILOT_L - l - k * 66, y: 8 + k * 26, l, h, ecran: e });
  });
  // Les téléphones passent devant les écrans desktop
  return placements;
}

// Place les îlots en quinconce autour du centre, avec un léger désordre
function disposer(projets: ProjetGalerie[]): Ilot[] {
  const n = projets.length;
  const colonnes = Math.max(2, Math.ceil(Math.sqrt(n * 1.7)));
  return projets.map((p, i) => {
    const ligne = Math.floor(i / colonnes);
    const col = i % colonnes;
    const cx = col * PAS_X + (ligne % 2) * (PAS_X / 2) + (hasard(i + 1) - 0.5) * 90;
    const cy = ligne * PAS_Y + (hasard(i + 7) - 0.5) * 70;
    return { cx, cy, placements: composer(p.ecrans) };
  });
}

type Camera = { x: number; y: number; s: number };
const ECHELLE_MIN = 0.12;
const ECHELLE_MAX = 2.4;
const borner = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Carte interactive de tous les projets, dans l'esprit de la galerie ORE : on la fait glisser,
 * on zoome, on filtre par étiquette, et un clic centre la caméra sur un projet avec ses infos.
 * Les îlots se placent automatiquement : ajouter un projet suffit à l'y faire apparaître.
 */
export default function GalerieProjets({ projets, choisi, onChoisir }: { projets: ProjetGalerie[]; choisi: number; onChoisir: (i: number) => void }) {
  const vueRef = useRef<HTMLDivElement | null>(null);
  const mondeRef = useRef<HTMLDivElement | null>(null);
  const ilots = useMemo(() => disposer(projets), [projets]);
  const [survole, setSurvole] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [filtre, setFiltre] = useState<string | null>(null);
  const [echelleAffichee, setEchelleAffichee] = useState(1);
  const tags = useMemo(() => Array.from(new Set(projets.flatMap((p) => p.tags))), [projets]);

  // Caméra : la position affichée glisse toujours vers la cible, tous les mouvements sont doux
  const camera = useRef<Camera>({ x: 0, y: 0, s: 0.6 });
  const cible = useRef<Camera>({ x: 0, y: 0, s: 0.6 });
  const taille = useRef({ l: 1, h: 1 });
  const miniRef = useRef<HTMLDivElement | null>(null);
  const cadreMiniRef = useRef<HTMLDivElement | null>(null);

  // Bornes du monde (tous les îlots + leur étiquette)
  const bornes = useMemo(() => {
    const xs = ilots.flatMap((i) => [i.cx - ILOT_L / 2, i.cx + ILOT_L / 2]);
    const ys = ilots.flatMap((i) => [i.cy - ILOT_H / 2, i.cy + ILOT_H / 2 + 50]);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  }, [ilots]);
  const centre = { x: (bornes.x0 + bornes.x1) / 2, y: (bornes.y0 + bornes.y1) / 2 };

  const vueEnsemble = useCallback((): Camera => {
    const { l, h } = taille.current;
    const s = borner(Math.min(l / (bornes.x1 - bornes.x0 + 160), h / (bornes.y1 - bornes.y0 + 160)), ECHELLE_MIN, 1.1);
    return { x: (bornes.x0 + bornes.x1) / 2, y: (bornes.y0 + bornes.y1) / 2, s };
  }, [bornes]);

  const recentrer = useCallback(() => {
    setFocus(null);
    cible.current = vueEnsemble();
  }, [vueEnsemble]);

  const viser = useCallback(
    (i: number) => {
      const { l, h } = taille.current;
      const s = borner(Math.min(l / (ILOT_L + 260), h / (ILOT_H + 220)), 0.5, ECHELLE_MAX);
      // Décale un peu vers la droite pour laisser la place au panneau d'infos à gauche
      cible.current = { x: ilots[i].cx - (l > 768 ? 150 / s : 0), y: ilots[i].cy + (l > 768 ? 0 : 60 / s), s };
      setFocus(i);
    },
    [ilots],
  );

  const zoomer = (facteur: number) => {
    cible.current = { ...cible.current, s: borner(cible.current.s * facteur, ECHELLE_MIN, ECHELLE_MAX) };
  };

  // Boucle d'affichage + interactions (glisser, élan, pincer, Ctrl + molette)
  useEffect(() => {
    const vue = vueRef.current;
    const monde = mondeRef.current;
    if (!vue || !monde) return;
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mesurer = () => {
      const r = vue.getBoundingClientRect();
      taille.current = { l: r.width, h: r.height };
    };
    mesurer();
    const ensemble = vueEnsemble();
    camera.current = { ...ensemble };
    cible.current = { ...ensemble };
    const observateur = new ResizeObserver(() => {
      mesurer();
    });
    observateur.observe(vue);

    let raf = 0;
    let elan = { x: 0, y: 0 };
    let derniereEchelle = 0;
    const boucle = () => {
      const c = camera.current;
      const t = cible.current;
      // Élan après un glisser
      if (Math.abs(elan.x) + Math.abs(elan.y) > 0.05) {
        t.x -= elan.x / t.s;
        t.y -= elan.y / t.s;
        elan = { x: elan.x * 0.92, y: elan.y * 0.92 };
      }
      // La caméra reste au-dessus des projets : impossible de se perdre dans le vide
      t.x = borner(t.x, bornes.x0, bornes.x1);
      t.y = borner(t.y, bornes.y0, bornes.y1);
      const k = reduit ? 1 : 0.12;
      c.x += (t.x - c.x) * k;
      c.y += (t.y - c.y) * k;
      c.s += (t.s - c.s) * k;
      const { l, h } = taille.current;
      monde.style.transform = `translate3d(${l / 2 - c.x * c.s}px, ${h / 2 - c.y * c.s}px, 0) scale(${c.s})`;
      // Cadre de la vue sur la mini-carte
      const mini = miniRef.current;
      const cadre = cadreMiniRef.current;
      if (mini && cadre) {
        const mw = mini.clientWidth;
        const mh = mini.clientHeight;
        const ech = Math.min(mw / (bornes.x1 - bornes.x0 + 400), mh / (bornes.y1 - bornes.y0 + 400));
        const ox = mw / 2 - centre.x * ech;
        const oy = mh / 2 - centre.y * ech;
        cadre.style.left = `${ox + (c.x - l / 2 / c.s) * ech}px`;
        cadre.style.top = `${oy + (c.y - h / 2 / c.s) * ech}px`;
        cadre.style.width = `${(l / c.s) * ech}px`;
        cadre.style.height = `${(h / c.s) * ech}px`;
      }
      if (Math.abs(c.s - derniereEchelle) > 0.01) {
        derniereEchelle = c.s;
        setEchelleAffichee(c.s);
      }
      raf = requestAnimationFrame(boucle);
    };
    raf = requestAnimationFrame(boucle);

    // Glisser (souris, doigt) et pincer à deux doigts
    const pointeurs = new Map<number, { x: number; y: number }>();
    let distanceDepart = 0;
    let echelleDepart = 1;
    let deplacement = 0;
    const debut = (e: PointerEvent) => {
      pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      deplacement = 0;
      elan = { x: 0, y: 0 };
      if (pointeurs.size === 2) {
        const [a, b] = [...pointeurs.values()];
        distanceDepart = Math.hypot(a.x - b.x, a.y - b.y);
        echelleDepart = cible.current.s;
      }
    };
    const bouge = (e: PointerEvent) => {
      const avant = pointeurs.get(e.pointerId);
      if (!avant) return;
      const dx = e.clientX - avant.x;
      const dy = e.clientY - avant.y;
      pointeurs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointeurs.size === 2) {
        const [a, b] = [...pointeurs.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        cible.current.s = borner((echelleDepart * d) / Math.max(1, distanceDepart), ECHELLE_MIN, ECHELLE_MAX);
        return;
      }
      // Sur écran tactile, un geste surtout vertical fait défiler la page, pas la carte
      if (e.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) && deplacement < 6) return;
      deplacement += Math.abs(dx) + Math.abs(dy);
      cible.current.x -= dx / cible.current.s;
      cible.current.y -= dy / cible.current.s;
      camera.current.x -= dx / cible.current.s;
      camera.current.y -= dy / cible.current.s;
      elan = { x: dx, y: dy };
    };
    const fin = (e: PointerEvent) => {
      pointeurs.delete(e.pointerId);
      if (deplacement > 6) vue.dataset.glisse = '1';
      window.setTimeout(() => delete vue.dataset.glisse, 0);
    };
    const molette = (e: WheelEvent) => {
      if (!e.ctrlKey) return; // la molette seule fait défiler la page
      e.preventDefault();
      cible.current.s = borner(cible.current.s * Math.exp(-e.deltaY * 0.0025), ECHELLE_MIN, ECHELLE_MAX);
    };
    const clavier = (e: KeyboardEvent) => {
      if (e.key === 'Escape') recentrer();
    };

    vue.addEventListener('pointerdown', debut);
    window.addEventListener('pointermove', bouge);
    window.addEventListener('pointerup', fin);
    window.addEventListener('pointercancel', fin);
    vue.addEventListener('wheel', molette, { passive: false });
    window.addEventListener('keydown', clavier);
    return () => {
      cancelAnimationFrame(raf);
      observateur.disconnect();
      vue.removeEventListener('pointerdown', debut);
      window.removeEventListener('pointermove', bouge);
      window.removeEventListener('pointerup', fin);
      window.removeEventListener('pointercancel', fin);
      vue.removeEventListener('wheel', molette);
      window.removeEventListener('keydown', clavier);
    };
    // La caméra vit dans des refs : la boucle n'a besoin d'être installée qu'une fois par disposition
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ilots]);

  const correspond = (p: ProjetGalerie) => !filtre || p.tags.includes(filtre);
  const projetFocus = focus !== null ? projets[focus] : null;
  const allume = focus ?? survole;

  // Mini-carte : position de chaque îlot
  const miniPositions = (l: number, h: number) => {
    const ech = Math.min(l / (bornes.x1 - bornes.x0 + 400), h / (bornes.y1 - bornes.y0 + 400));
    return { ech, ox: l / 2 - centre.x * ech, oy: h / 2 - centre.y * ech };
  };
  const mini = miniPositions(176, 110);

  return (
    <div className="relative">
      {/* Filtres par étiquette */}
      <div className="mb-5 flex flex-wrap items-center gap-2" role="toolbar" aria-label="Filtrer les projets">
        {[null, ...tags].map((t) => (
          <button
            key={t ?? 'tous'}
            type="button"
            aria-pressed={filtre === t}
            onClick={() => setFiltre(t)}
            className={`rounded-full border px-3.5 py-1.5 text-xs uppercase tracking-widest transition-colors ${
              filtre === t ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-black/15 text-black/60 hover:border-black/40 dark:border-white/20 dark:text-white/60 dark:hover:border-white/50'
            }`}
          >
            {t ?? 'Tous'}
          </button>
        ))}
        <span className="ml-auto hidden text-[11px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40 md:block">Glisser pour explorer · Ctrl + molette pour zoomer</span>
      </div>

      <div
        ref={vueRef}
        className="relative ml-[calc(50%-50vw)] h-[72vh] w-screen cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing md:h-[80vh] md:min-h-140"
        role="group"
        aria-label="Carte interactive des projets : glisser pour explorer, cliquer sur un projet pour le centrer"
        onClick={(e) => {
          if (e.target === e.currentTarget && !vueRef.current?.dataset.glisse) recentrer();
        }}
      >
        {/* Monde de la carte, déplacé et zoomé par la caméra */}
        <div ref={mondeRef} className="absolute left-0 top-0 origin-top-left will-change-transform">
          {/* Lignes fines de chaque îlot vers le centre, comme sur la galerie ORE */}
          <svg className="pointer-events-none absolute overflow-visible text-black/15 dark:text-white/15" style={{ left: 0, top: 0, width: 1, height: 1 }} aria-hidden="true">
            <line x1={bornes.x0 - 2000} y1={centre.y} x2={bornes.x1 + 2000} y2={centre.y} stroke="currentColor" strokeWidth={1 / echelleAffichee} />
            <line x1={centre.x} y1={bornes.y0 - 2000} x2={centre.x} y2={bornes.y1 + 2000} stroke="currentColor" strokeWidth={1 / echelleAffichee} />
            {ilots.map((ilot, i) => (
              <line
                key={projets[i].nom}
                x1={ilot.cx}
                y1={ilot.cy}
                x2={centre.x}
                y2={centre.y}
                stroke={allume === i ? projets[i].accent : 'currentColor'}
                strokeWidth={(allume === i ? 1.6 : 1) / echelleAffichee}
                opacity={correspond(projets[i]) ? 1 : 0.3}
              />
            ))}
          </svg>
          <span className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 dark:bg-white/40" style={{ left: centre.x, top: centre.y }} aria-hidden="true" />

          {ilots.map((ilot, i) => {
            const p = projets[i];
            const visible = correspond(p);
            const eteint = !visible || (allume !== null && allume !== i);
            return (
              <button
                key={p.nom}
                type="button"
                disabled={!visible}
                onClick={() => {
                  if (vueRef.current?.dataset.glisse) return;
                  if (focus === i) onChoisir(i);
                  else viser(i);
                }}
                onPointerEnter={() => setSurvole(i)}
                onPointerLeave={() => setSurvole(null)}
                // Centrage au focus réservé au clavier (un clic donne aussi le focus)
                onFocus={(e) => {
                  if (e.currentTarget.matches(':focus-visible')) viser(i);
                }}
                aria-label={`${p.nom} — ${focus === i ? 'ouvrir le projet' : 'centrer la carte sur ce projet'}`}
                className="absolute text-left transition-[opacity,filter] duration-500 disabled:cursor-default"
                style={{ left: ilot.cx - ILOT_L / 2, top: ilot.cy - ILOT_H / 2, width: ILOT_L, height: ILOT_H, opacity: eteint ? (visible ? 0.3 : 0.08) : 1, filter: eteint ? 'grayscale(1)' : 'none' }}
              >
                <span className="absolute inset-0 block transition-transform duration-500 ease-out-soft" style={{ transform: allume === i ? 'scale(1.03)' : 'none' }}>
                  {ilot.placements.map((pl) => (
                    <span
                      key={pl.ecran.src}
                      className={`absolute block overflow-hidden shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] ${pl.ecran.tel ? 'rounded-[10%/5%] ring-[3px] ring-neutral-900' : 'rounded-lg ring-1 ring-black/10'}`}
                      style={{ left: pl.x, top: pl.y, width: pl.l, height: pl.h }}
                    >
                      <Image src={pl.ecran.src} alt="" fill sizes="600px" draggable={false} className="pointer-events-none object-cover object-top" />
                    </span>
                  ))}
                </span>
                <span className="absolute left-0 top-full mt-4 flex items-center gap-2 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-black/70 dark:text-white/70" style={allume === i ? { color: p.accent } : undefined}>
                  <span className="h-2 w-2 rounded-full" style={{ background: choisi === i || allume === i ? p.accent : 'currentColor' }} />
                  {String(i + 1).padStart(2, '0')} — {p.nom}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panneau du projet centré */}
        <AnimatePresence>
          {projetFocus && focus !== null && (
            <motion.div
              key={projetFocus.nom}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-black/10 bg-white/90 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0b0b]/90 md:bottom-auto md:left-10 md:right-auto md:top-1/2 md:w-88 md:-translate-y-1/2 md:p-7"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: projetFocus.accent }}>
                {String(focus + 1).padStart(2, '0')} / {String(projets.length).padStart(2, '0')}
              </p>
              <p className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">{projetFocus.nom}</p>
              <p className="mt-2 flex flex-wrap gap-1.5">
                {projetFocus.tags.map((t) => (
                  <span key={t} className="rounded-full border border-black/15 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-black/60 dark:border-white/20 dark:text-white/60">
                    {t}
                  </span>
                ))}
              </p>
              <p className="mt-4 hidden text-sm leading-relaxed text-black/65 dark:text-white/65 sm:block">{projetFocus.legende}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => onChoisir(focus)} className="rounded-full px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]" style={{ background: projetFocus.accent }}>
                  Voir le projet ↓
                </button>
                <button type="button" onClick={() => viser((focus + 1) % projets.length)} className="rounded-full border border-black/15 px-4 py-2.5 text-sm dark:border-white/20" aria-label="Projet suivant">
                  Suivant →
                </button>
                <button type="button" onClick={recentrer} className="rounded-full px-3 py-2.5 text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white">
                  Vue d’ensemble
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom */}
        <div className="absolute right-4 top-4 z-20 flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-[#0b0b0b]/85 md:right-10">
          {[
            { label: 'Zoomer', signe: '+', action: () => zoomer(1.3) },
            { label: 'Dézoomer', signe: '−', action: () => zoomer(1 / 1.3) },
            { label: 'Vue d’ensemble', signe: '⤢', action: recentrer },
          ].map((b) => (
            <button key={b.label} type="button" onClick={b.action} aria-label={b.label} className="flex h-10 w-10 items-center justify-center text-lg text-black/70 transition-colors hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10">
              {b.signe}
            </button>
          ))}
        </div>

        {/* Mini-carte : repère et saut rapide */}
        <div
          ref={miniRef}
          className="absolute bottom-4 right-4 z-20 hidden h-27.5 w-44 cursor-pointer overflow-hidden rounded-xl border border-black/10 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-[#0b0b0b]/85 md:right-10 md:block"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            cible.current = { ...cible.current, x: (e.clientX - r.left - mini.ox) / mini.ech, y: (e.clientY - r.top - mini.oy) / mini.ech };
          }}
          aria-hidden="true"
        >
          {ilots.map((ilot, i) => (
            <span
              key={projets[i].nom}
              className="absolute rounded-xs"
              style={{
                left: mini.ox + (ilot.cx - ILOT_L / 2) * mini.ech,
                top: mini.oy + (ilot.cy - ILOT_H / 2) * mini.ech,
                width: ILOT_L * mini.ech,
                height: ILOT_H * mini.ech,
                background: projets[i].accent,
                opacity: correspond(projets[i]) ? 0.85 : 0.2,
              }}
            />
          ))}
          <div ref={cadreMiniRef} className="pointer-events-none absolute rounded-sm border border-black/60 dark:border-white/70" />
        </div>
      </div>
    </div>
  );
}

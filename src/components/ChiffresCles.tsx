'use client';

import { useEffect, useState } from 'react';

// Points clés de l'accueil : le nombre défile jusqu'à sa valeur, comme les chiffres du CV vidéo
const CHIFFRES = [
  { valeur: 3, suffixe: '+', label: 'années de code' },
  { valeur: 15, suffixe: '+', label: 'projets livrés' },
  { valeur: 20, suffixe: '', label: 'technos maîtrisées' },
  // 240 tests PHPUnit (Penderie) + 81 (E.S.I.C.)
  { valeur: 320, suffixe: '+', label: 'tests automatisés' },
  // 12 modules (Sommeval) + 8 (E.S.I.C.)
  { valeur: 20, suffixe: '', label: 'modules CRUD' },
  // Fichiers des dossiers components : Penderie, E.S.I.C., PS5, ce portfolio, MDLP
  { valeur: 99, suffixe: '+', label: 'composants créés' },
  // Endpoints d'API : 42 (MDLP) + 30+ (E.S.I.C.) + 25 (Sommeval)
  { valeur: 90, suffixe: '+', label: 'endpoints API' },
  // Commits à mon nom dans mes dépôts (Penderie, E.S.I.C., ce portfolio, MDLP…) : 427
  { valeur: 400, suffixe: '+', label: 'commits' },
];

const DUREE = 1400;

function Compteur({ valeur, suffixe, delai }: { valeur: number; suffixe: string; delai: number }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    // Mouvement réduit : la valeur finale s'affiche dès la première image
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let image = 0;
    const depart = performance.now() + delai;
    const pas = (t: number) => {
      const p = reduit ? 1 : Math.min(Math.max((t - depart) / DUREE, 0), 1);
      setN(Math.round(valeur * (1 - Math.pow(1 - p, 3))));
      if (p < 1) image = requestAnimationFrame(pas);
    };
    image = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(image);
  }, [valeur, delai]);

  return (
    <>
      {/* Les lecteurs d'écran lisent directement la valeur finale */}
      <span aria-hidden="true" className="tabular-nums">
        {n}
        {suffixe}
      </span>
      <span className="sr-only">
        {valeur}
        {suffixe}
      </span>
    </>
  );
}

export default function ChiffresCles({ className = '' }: { className?: string }) {
  return (
    <dl className={`flex flex-wrap gap-y-5 border-t border-black/10 pt-5 md:justify-end dark:border-white/15 ${className}`}>
      {CHIFFRES.map((c, i) => (
        <div key={c.label} className="flex basis-1/4 flex-col pr-3 md:items-end md:pl-3 md:pr-0 md:text-right">
          <dt className="order-2 mt-1 font-mono text-[9px] uppercase leading-snug tracking-[0.12em] text-black/55 md:text-[10px] dark:text-white/40">
            {c.label}
          </dt>
          <dd className="order-1 text-2xl font-semibold tracking-tight text-black/90 md:text-3xl dark:text-white/90">
            <Compteur valeur={c.valeur} suffixe={c.suffixe} delai={300 + i * 90} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

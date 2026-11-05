'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { rubriques, CLE_REPRISE_VIDEO } from '@/lib/rubriques';

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];
// Pause après l'arrivée du titre, le temps de le lire, puis durée du défilement qui traverse
// le média jusqu'au contenu de la page
const ATTENTE_DEFILEMENT = 500;
const DUREE_DEFILEMENT = 2.4;
const douceur = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Ouverture des pages, calée sur metalab.com : la page commence sur le média de la carte
 * en plein écran (là où s'arrête la transition de l'accueil), puis un bandeau descend du
 * haut avec le titre et pousse le média vers le bas ; les infos apparaissent en dernier.
 * Enfin la page défile d'elle-même à travers le média jusqu'au contenu, si le visiteur n'a
 * encore touché à rien.
 */
export default function HeroProjet({ id }: { id: string }) {
  const rubrique = rubriques[id];
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const lenis = useLenis();
  const [banniereFinie, setBanniereFinie] = useState(false);
  // Le visiteur a pris la main (molette, toucher, clavier, clic) : on ne défile plus à sa place
  const aPrisLaMain = useRef(false);

  useEffect(() => {
    const prendre = () => {
      aPrisLaMain.current = true;
    };
    const evenements = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    evenements.forEach((e) => window.addEventListener(e, prendre, { passive: true }));
    return () => evenements.forEach((e) => window.removeEventListener(e, prendre));
  }, []);

  // Défilement automatique à travers le média jusqu'au contenu, une fois le bandeau du titre en place
  useEffect(() => {
    if (!banniereFinie) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const minuterie = setTimeout(() => {
      const cible = mediaRef.current;
      // Page déjà défilée (retour arrière) ou visiteur déjà actif : on le laisse faire
      if (!cible || aPrisLaMain.current || window.scrollY > 20) return;
      // Arrivée sous le média : le vrai contenu de la page commence là
      const bas = cible.getBoundingClientRect().bottom + window.scrollY;
      if (lenis) lenis.scrollTo(bas, { duration: DUREE_DEFILEMENT, easing: douceur });
      else window.scrollTo({ top: bas, behavior: 'smooth' });
    }, ATTENTE_DEFILEMENT);
    return () => clearTimeout(minuterie);
  }, [banniereFinie, lenis]);

  // Arrivée depuis l'accueil : l'image capturée au clic recouvre la vidéo pendant qu'on la cale
  // au même moment que la carte ; on ne la retire qu'une fois la bonne image affichée par la
  // vidéo (sinon le navigateur montre une fraction de seconde une image antérieure)
  useLayoutEffect(() => {
    const video = videoRef.current;
    const image = imageRef.current;
    if (!video || !image || !rubrique.video) return;

    let temps: number | null = null;
    try {
      const reprise = JSON.parse(sessionStorage.getItem(CLE_REPRISE_VIDEO) || 'null');
      sessionStorage.removeItem(CLE_REPRISE_VIDEO);
      if (reprise?.src === rubrique.video) {
        if (typeof reprise.temps === 'number') temps = reprise.temps;
        if (reprise.image) image.src = reprise.image;
      }
    } catch {}

    let fini = false;
    const retirerImage = () => {
      if (fini) return;
      fini = true;
      image.style.opacity = '0';
    };
    // Attend qu'une image de la vidéo soit réellement affichée à l'écran
    const apresProchaineImage = () => {
      // requestVideoFrameCallback manque sur les anciens Firefox : repli sur timeupdate
      const v = video as HTMLVideoElement & { requestVideoFrameCallback?: (rappel: () => void) => number };
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(retirerImage);
      else video.addEventListener('timeupdate', retirerImage, { once: true });
    };
    const caler = () => {
      if (temps === null) return apresProchaineImage();
      video.addEventListener('seeked', apresProchaineImage, { once: true });
      video.currentTime = temps % (video.duration || Infinity);
    };
    if (video.readyState >= 1) caler();
    else video.addEventListener('loadedmetadata', caler, { once: true });

    return () => {
      video.removeEventListener('loadedmetadata', caler);
      video.removeEventListener('seeked', apresProchaineImage);
      video.removeEventListener('timeupdate', retirerImage);
    };
  }, [rubrique.video]);

  return (
    <section className="relative">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 'auto' }}
        transition={{ duration: 0.9, ease, delay: 0.2 }}
        // Le bandeau déplié a poussé toute la page : les sections épinglées au scroll
        // (Salamèche…) doivent recalculer leurs positions, sinon elles sautent
        onAnimationComplete={() => {
          ScrollTrigger.refresh();
          // framer-motion (useScroll) ne remesure ses repères qu'au redimensionnement
          window.dispatchEvent(new Event('resize'));
          setBanniereFinie(true);
        }}
        className="overflow-hidden"
      >
        <div className="px-6 md:px-10 pt-28 md:pt-[24vh] pb-8 md:pb-[6vh]">
          <h1 className="text-[2.75rem] sm:text-[4rem] md:text-[8rem] font-semibold tracking-tighter leading-[0.95]">
            {rubrique.titre}
          </h1>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.9 }}
            className="mt-10 md:mt-[9vh] grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-10 text-sm"
          >
            {rubrique.infos.map(({ label, valeur }) => (
              <div key={label}>
                <dt className="font-medium">{label}</dt>
                <dd className="mt-1 text-black/55 dark:text-white/55">{valeur}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      {/* Même cadrage que la carte agrandie de l'accueil : plein cadre sur ordinateur,
          vidéo entière sur fond flou sur téléphone */}
      <div ref={mediaRef} className="relative h-svh w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={rubrique.affiche} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 opacity-70 md:hidden" />
        {rubrique.video ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            className="relative w-full h-full object-contain md:object-cover"
          >
            <source src={rubrique.video} type="video/mp4" />
          </video>
        ) : (
          <Image src={rubrique.affiche} alt="" aria-hidden="true" fill priority sizes="100vw" className="object-contain md:object-cover" />
        )}
        {/* Par-dessus la vidéo : l'image capturée au clic (ou l'affiche, déjà en cache depuis
            l'accueil), retirée dès que la vidéo affiche la bonne image */}
        {rubrique.video && (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={imageRef} src={rubrique.affiche} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-contain md:object-cover" />
        )}
      </div>
    </section>
  );
}

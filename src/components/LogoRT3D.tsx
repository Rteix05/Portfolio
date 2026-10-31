'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Cases du logo <RT> (grille 32 × 10, mêmes rectangles que LogoRT.tsx)
const CHEMIN =
  'M4 0h2v2h-2zM8 0h16v2h-16zM26 0h2v2h-2zM2 2h4v2h-4zM8 2h2v2h-2zM13 2h4v2h-4zM20 2h2v2h-2zM26 2h4v2h-4zM0 4h4v2h-4zM8 4h7v2h-7zM20 4h2v2h-2zM28 4h4v2h-4zM2 6h4v2h-4zM8 6h2v2h-2zM11 6h4v2h-4zM20 6h2v2h-2zM26 6h4v2h-4zM4 8h2v2h-2zM8 8h2v2h-2zM13 8h4v2h-4zM20 8h2v2h-2zM26 8h2v2h-2z';

// Lit les rectangles « Mx yhLvH » du chemin SVG
const rectangles = () => [...CHEMIN.matchAll(/M(\d+) (\d+)h(\d+)v(\d+)/g)].map(([, x, y, l, h]) => ({ x: +x, y: +y, l: +l, h: +h }));

const suivreTheme = (rappel: () => void) => {
  const o = new MutationObserver(rappel);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => o.disconnect();
};
const lireSombre = () => !document.documentElement.classList.contains('light');

// Valeurs du tour au clic : -1 au repos, -2 « à lancer », sinon l'heure de départ
const REPOS = -1;
const A_LANCER = -2;

// Réglages du rebond (unités du logo)
const LIMITE_BAS = -0.3;
const GRAVITE = 18; // assez vive pour des rebonds toniques, le logo reste léger
const REBOND = 0.72; // part de la vitesse gardée à chaque rebond : plusieurs rebonds avant de se poser
const VITESSE_ARRET = 2.2; // en dessous, le logo se pose (pas de micro-rebonds interminables)
const ATTENTE_RETOUR = 3000; // ms sans toucher le logo avant qu'il revienne à sa place
const DELAI_ENTREE = 1000; // ms avant la première apparition, le temps que la page s'installe
// Caméra fixe, droite, face à la scène : elle couvre tout l'écran
const DISTANCE = 32;
const FOV = 32;
const DEMI_LARGEUR_LOGO = 4.4; // marge pour que le logo reste entier dans l'écran
const DEMI_HAUTEUR_LOGO = 1.6;

// Réglages de la matière et des lumières pour chaque thème : on glisse de l'un à l'autre
const MATIERE = {
  sombre: { couleur: new THREE.Color('#f4f4f2'), metal: 0.15, rugosite: 0.22, reflets: 1.1, lumiere: 1.2, contre: new THREE.Color('#9fb4ff') },
  clair: { couleur: new THREE.Color('#141414'), metal: 0.45, rugosite: 0.28, reflets: 1.4, lumiere: 1.8, contre: new THREE.Color('#ffffff') },
};

/** Rectangle (en pixels de l'écran) qui donne la place et la taille du logo au repos. */
type Cadre = { x: number; y: number; l: number; h: number };
const borne = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function Logo({ sombre, souris, cadre, actif, entre }: { sombre: boolean; souris: React.RefObject<{ x: number; y: number }>; cadre: React.RefObject<Cadre>; actif: React.RefObject<boolean>; entre: React.RefObject<boolean> }) {
  const ancre = useRef<THREE.Group>(null);
  const groupe = useRef<THREE.Group>(null);
  const zone = useRef<THREE.Mesh>(null);
  const matiere = useRef<THREE.MeshPhysicalMaterial>(null);
  const lumiere = useRef<THREE.DirectionalLight>(null);
  const contreJour = useRef<THREE.DirectionalLight>(null);
  // Place de repos et échelle du logo à l'écran, plus les bords de l'écran en unités du logo
  const repere = useRef({ x: 0, y: 0, s: 1, minX: -4, maxX: 4, haut: 6 });
  const orientation = useRef({ x: 0, y: 0 });
  const tour = useRef(REPOS);
  // Position et vitesse du logo, saisi ou en chute libre
  const physique = useRef({ x: 0, y: 0, vx: 0, vy: 0, saisi: false, cibleX: 0, cibleY: 0, ecartX: 0, ecartY: 0, flottement: 0, ecrase: 0, vEcrase: 0, calme: 0 });
  const plan = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const point = useMemo(() => new THREE.Vector3(), []);

  // Un seul volume pour tout le logo : les 21 cases extrudées ensemble, arêtes biseautées
  const geometrie = useMemo(() => {
    const formes = rectangles().map(({ x, y, l, h }) => {
      const f = new THREE.Shape();
      f.moveTo(x, -y);
      f.lineTo(x + l, -y);
      f.lineTo(x + l, -y - h);
      f.lineTo(x, -y - h);
      f.closePath();
      return f;
    });
    const g = new THREE.ExtrudeGeometry(formes, { depth: 2.4, bevelEnabled: true, bevelThickness: 0.28, bevelSize: 0.22, bevelSegments: 3, curveSegments: 1 });
    g.center();
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometrie.dispose(), [geometrie]);

  // Le canvas couvre tout l'écran mais laisse passer les clics (menu, liens) : la saisie du logo
  // est détectée sur la fenêtre, par un rayon lancé vers sa zone de saisie
  const { camera, gl, size } = useThree();
  useEffect(() => {
    const rayon = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let curseur = '';
    let bloquerClic = false;
    // Appui en cours sur le logo, pas encore une saisie : tant que la main ne bouge pas de
    // quelques pixels, le logo garde son élan (un simple clic le fait tourner sans l'arrêter)
    let appui: { x: number; y: number } | null = null;
    const SEUIL_SAISIE = 6; // px
    const changerCurseur = (c: string) => {
      if (c === curseur) return;
      curseur = c;
      document.body.style.cursor = c;
    };
    const viser = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      rayon.setFromCamera(ndc, camera);
    };
    // Point visé sur le plan du logo, converti en unités du logo
    const pointLocal = () => {
      if (!rayon.ray.intersectPlane(plan, point)) return null;
      const rp = repere.current;
      return { x: (point.x - rp.x) / rp.s, y: (point.y - rp.y) / rp.s };
    };
    const touche = () => !!zone.current && rayon.intersectObject(zone.current, false).length > 0;

    const presser = (e: PointerEvent) => {
      bloquerClic = false;
      if (!actif.current || e.button > 0) return;
      viser(e);
      if (!touche()) return;
      const p = pointLocal();
      if (!p) return;
      // Le logo passe devant : le clic ne va pas à ce qui se trouve dessous
      e.preventDefault();
      e.stopPropagation();
      bloquerClic = true;
      appui = { x: e.clientX, y: e.clientY };
      physique.current.calme = performance.now();
      changerCurseur('grabbing');
    };
    const bouge = (e: PointerEvent) => {
      const ph = physique.current;
      viser(e);
      const p = pointLocal();
      // La main a bougé : l'appui devient une saisie, le logo est pris là où il se trouve
      if (appui && !ph.saisi && p && Math.hypot(e.clientX - appui.x, e.clientY - appui.y) > SEUIL_SAISIE) {
        appui = null;
        ph.saisi = true;
        ph.ecartX = p.x - ph.x;
        ph.ecartY = p.y - ph.y;
        ph.cibleX = ph.x;
        ph.cibleY = ph.y;
      }
      if (!ph.saisi) {
        if (!appui) changerCurseur(actif.current && e.pointerType === 'mouse' && touche() ? 'grab' : '');
        return;
      }
      if (!p) return;
      const rp = repere.current;
      const nx = borne(p.x - ph.ecartX, rp.minX, rp.maxX);
      const ny = borne(p.y - ph.ecartY, LIMITE_BAS, rp.haut);
      ph.cibleX = nx;
      ph.cibleY = ny;
    };
    const lacher = () => {
      const ph = physique.current;
      if (appui) {
        // Simple clic : un tour complet, en plein vol s'il le faut, sans toucher à son élan
        appui = null;
        changerCurseur('');
        if (tour.current === REPOS) tour.current = A_LANCER;
        return;
      }
      if (!ph.saisi) return;
      ph.saisi = false;
      ph.calme = performance.now();
      changerCurseur('');
    };
    const clic = (e: MouseEvent) => {
      if (!bloquerClic) return;
      bloquerClic = false;
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('pointerdown', presser, true);
    window.addEventListener('click', clic, true);
    window.addEventListener('pointermove', bouge);
    window.addEventListener('pointerup', lacher);
    window.addEventListener('pointercancel', lacher);
    return () => {
      window.removeEventListener('pointerdown', presser, true);
      window.removeEventListener('click', clic, true);
      window.removeEventListener('pointermove', bouge);
      window.removeEventListener('pointerup', lacher);
      window.removeEventListener('pointercancel', lacher);
      document.body.style.cursor = '';
    };
  }, [actif, camera, gl, plan, point]);

  useFrame((state, dt) => {
    const g = groupe.current;
    const an = ancre.current;
    if (!g || !an) return;
    const t = state.clock.elapsedTime;

    // Changement de thème : la matière et les lumières glissent vers leurs nouveaux réglages
    const cibleTheme = MATIERE[sombre ? 'sombre' : 'clair'];
    const kt = 1 - Math.pow(0.0015, Math.min(dt, 1 / 30));
    const m = matiere.current;
    if (m) {
      m.color.lerp(cibleTheme.couleur, kt);
      m.metalness += (cibleTheme.metal - m.metalness) * kt;
      m.roughness += (cibleTheme.rugosite - m.roughness) * kt;
      m.envMapIntensity += (cibleTheme.reflets - m.envMapIntensity) * kt;
    }
    if (lumiere.current) lumiere.current.intensity += (cibleTheme.lumiere - lumiere.current.intensity) * kt;
    if (contreJour.current) contreJour.current.color.lerp(cibleTheme.contre, kt);

    // Place et taille au repos d'après le cadre de l'accueil, recalculées à chaque image
    // (redimensionnement, passage mobile) : même rendu qu'avant, mais l'écran entier est jouable
    const hauteurMonde = 2 * DISTANCE * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const largeurMonde = (hauteurMonde * size.width) / size.height;
    const pxParUnite = size.height / hauteurMonde;
    const c = cadre.current;
    const rp = repere.current;
    if (c.l > 0 && c.h > 0) {
      const largeurPx = Math.min(c.h * 1.1, c.l * 0.63);
      rp.s = largeurPx / pxParUnite / 8.27;
      rp.x = (c.x + c.l * 0.515 - size.width / 2) / pxParUnite;
      rp.y = -(c.y + c.h * 0.06 - size.height / 2) / pxParUnite;
    }
    rp.minX = Math.min(0, (-largeurMonde / 2 - rp.x) / rp.s + DEMI_LARGEUR_LOGO);
    rp.maxX = Math.max(0, (largeurMonde / 2 - rp.x) / rp.s - DEMI_LARGEUR_LOGO);
    rp.haut = Math.max(0, (hauteurMonde / 2 - rp.y) / rp.s - DEMI_HAUTEUR_LOGO);
    an.position.set(rp.x, rp.y, 0);
    an.scale.setScalar(rp.s);
    if (!actif.current && physique.current.saisi) physique.current.saisi = false;
    const d = Math.min(dt, 1 / 30);
    if (tour.current === A_LANCER) tour.current = t;

    const ph = physique.current;
    if (!entre.current) {
      // Avant l'entrée : le logo attend juste au-dessus de l'écran, puis il tombe à sa place
      ph.x = 0;
      ph.y = rp.haut + 5;
      ph.vx = 0;
      ph.vy = 0;
    } else if (ph.saisi) {
      // Le logo colle presque à la main (il paraît léger), sa vitesse sert à l'élan du lâcher
      const k = 1 - Math.pow(0.00002, d);
      const nx = ph.x + (ph.cibleX - ph.x) * k;
      const ny = ph.y + (ph.cibleY - ph.y) * k;
      ph.vx = (nx - ph.x) / d;
      ph.vy = (ny - ph.y) / d;
      ph.x = nx;
      ph.y = ny;
    } else {
      // Chute libre et rebonds sur le « sol » (sa hauteur de repos)
      ph.vy -= GRAVITE * d;
      ph.y += ph.vy * d;
      // Plafond invisible au haut de l'écran : lancé trop fort, le logo y rebondit au lieu de sortir
      // (seulement en montant : à son entrée, le logo tombe de plus haut et le traverse)
      if (ph.y > rp.haut && ph.vy > 0) {
        ph.y = rp.haut;
        ph.vy = -Math.abs(ph.vy) * 0.4;
      }
      if (ph.y < 0) {
        ph.y = 0;
        // Choc au sol : le logo s'écrase un peu puis reprend sa forme, comme une balle
        if (ph.vy < -VITESSE_ARRET) {
          ph.vEcrase += Math.min(-ph.vy, 26) * 0.32;
          ph.vy = -ph.vy * REBOND;
        } else ph.vy = 0;
      }
      // Le logo glisse là où on l'a lancé, freiné surtout quand il touche le sol
      const auSol = ph.y === 0 && ph.vy === 0;
      ph.vx *= Math.exp(-(auSol ? 3.5 : 0.5) * d);
      // Après 3 s sans y toucher, il revient lentement à sa place, sans à-coup
      if (auSol && performance.now() - ph.calme > ATTENTE_RETOUR) ph.vx += (-ph.x * 1.2 - ph.vx * 2.2) * d;
      ph.x += ph.vx * d;
      // Les bords de l'écran le renvoient, comme les murs d'une boîte
      if (ph.x < rp.minX) {
        ph.x = rp.minX;
        ph.vx = Math.abs(ph.vx) * 0.4;
      } else if (ph.x > rp.maxX) {
        ph.x = rp.maxX;
        ph.vx = -Math.abs(ph.vx) * 0.4;
      }
    }
    // Ressort de l'écrasement : il s'aplatit, s'étire un peu au rebond, puis se stabilise
    ph.vEcrase += (-ph.ecrase * 320 - ph.vEcrase * 14) * d;
    ph.ecrase = borne(ph.ecrase + ph.vEcrase * d, -0.18, 0.3);
    // Le flottement ne reprend qu'une fois le logo posé
    const pose = !ph.saisi && ph.y === 0 && ph.vy === 0;
    ph.flottement += ((pose ? 1 : 0) - ph.flottement) * (1 - Math.pow(0.05, d));

    // Lente oscillation sur lui-même + orientation vers le curseur, lissées
    const o = orientation.current;
    const k = 1 - Math.pow(0.003, d);
    o.y += (Math.sin(t * 0.45) * 0.3 + souris.current.x * 0.55 - o.y) * k;
    o.x += (Math.sin(t * 0.6) * 0.05 + souris.current.y * 0.3 - o.x) * k;

    // Tour complet au clic : 1,2 s, accéléré puis freiné
    let tourComplet = 0;
    if (tour.current >= 0) {
      const p = Math.min(1, (t - tour.current) / 1.2);
      tourComplet = (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2) * Math.PI * 2;
      if (p >= 1) tour.current = REPOS;
    }

    // Inclinaison selon la vitesse : le logo « réagit » quand on le lance ou qu'il rebondit
    g.rotation.set(o.x + borne(ph.vy * 0.02, -0.3, 0.3), o.y + tourComplet, borne(-ph.vx * 0.05, -0.35, 0.35));
    g.position.set(ph.x, ph.y - ph.ecrase * 1.2 + Math.sin(t * 1.1) * 0.3 * ph.flottement, 0);
    g.scale.set(1 + ph.ecrase * 0.5, 1 - ph.ecrase, 1 + ph.ecrase * 0.5);
  });

  return (
    <>
    <directionalLight ref={lumiere} position={[4, 6, 8]} args={['#ffffff', MATIERE[sombre ? 'sombre' : 'clair'].lumiere]} />
    <directionalLight ref={contreJour} position={[-6, -2, 4]} args={[MATIERE[sombre ? 'sombre' : 'clair'].contre.clone(), 0.5]} />
    <group ref={ancre}>
      <group ref={groupe}>
        {/* Échelle du logo : un peu plus petit que sa première version */}
        <group scale={0.76}>
          {/* Zone de saisie invisible sur tout le rectangle du logo : on l'attrape même entre deux lettres */}
          <mesh ref={zone}>
            <boxGeometry args={[11.6, 4, 1.2]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <mesh geometry={geometrie} scale={0.34}>
            {/* Réglages de départ seulement : ensuite ils glissent avec le thème (voir useFrame) */}
            <meshPhysicalMaterial
              ref={matiere}
              args={[{ color: MATIERE[sombre ? 'sombre' : 'clair'].couleur.clone(), metalness: MATIERE[sombre ? 'sombre' : 'clair'].metal, roughness: MATIERE[sombre ? 'sombre' : 'clair'].rugosite, envMapIntensity: MATIERE[sombre ? 'sombre' : 'clair'].reflets }]}
              clearcoat={1}
              clearcoatRoughness={0.12}
            />
          </mesh>
        </group>
      </group>
      <ContactShadows position={[0, -2.1, 0]} opacity={sombre ? 0.55 : 0.35} scale={14} blur={2.6} far={4} resolution={256} color={sombre ? '#000000' : '#1b1a17'} />
    </group>
    </>
  );
}

/**
 * Logo <RT> en 3D, objet flottant de l'accueil : il oscille, flotte, suit le curseur, fait
 * un tour complet au clic, et on peut l'attraper et le lancer sur tout l'écran : lâché de haut, il retombe en rebondissant. Clair en thème sombre, foncé en thème clair. Le rendu est en pause
 * dès qu'il est masqué ou hors de l'écran, pour garder la page fluide.
 */
export default function LogoRT3D({ actif, onPret }: { actif: boolean; onPret?: () => void }) {
  const sombre = useSyncExternalStore(suivreTheme, lireSombre, () => true);
  const souris = useRef({ x: 0, y: 0 });
  const conteneur = useRef<HTMLDivElement>(null);
  const cadre = useRef<Cadre>({ x: 0, y: 0, l: 0, h: 0 });
  const actifRef = useRef(actif);
  const entre = useRef(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    actifRef.current = actif;
  }, [actif]);

  // Position du curseur sur toute la page : le logo le suit partout
  useEffect(() => {
    const bouge = (e: PointerEvent) => {
      souris.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener('pointermove', bouge, { passive: true });
    return () => window.removeEventListener('pointermove', bouge);
  }, []);

  // Le cadre de l'accueil donne la place et la taille du logo : on le remesure au redimensionnement
  useEffect(() => {
    const el = conteneur.current;
    if (!el) return;
    const mesurer = () => {
      const r = el.getBoundingClientRect();
      cadre.current = { x: r.left, y: r.top, l: r.width, h: r.height };
    };
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    window.addEventListener('resize', mesurer);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('resize', mesurer);
    };
  }, []);

  return (
    <>
      {/* Repère invisible à la place du logo dans l'accueil */}
      <div ref={conteneur} className="pointer-events-none absolute inset-0" />
      {/* La scène couvre tout l'écran, sous la navigation, sans jamais capter de clic :
          React Three Fiber force pointer-events: auto, on le neutralise donc sur le canvas */}
      {createPortal(
        <div
          className="pointer-events-none fixed inset-0 z-45 transition-opacity duration-500"
          style={{ opacity: actif ? 1 : 0 }}
          aria-hidden="true"
        >
          <Canvas
            style={{ pointerEvents: 'none' }}
            frameloop={actif && visible ? 'always' : 'never'}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
            camera={{ position: [0, 0, DISTANCE], fov: FOV }}
            // Reflets : un studio généré sur place à la création de la scène (aucun fichier HDR à télécharger)
            onCreated={({ gl, scene }) => {
              const pmrem = new THREE.PMREMGenerator(gl);
              scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
              pmrem.dispose();
              onPret?.();
              // Première apparition après un court délai : le logo tombe du haut de l'écran
              window.setTimeout(() => {
                entre.current = true;
              }, DELAI_ENTREE);
            }}
          >
            <ambientLight intensity={0.25} />
            <Logo sombre={sombre} souris={souris} cadre={cadre} actif={actifRef} entre={entre} />
          </Canvas>
        </div>,
        document.body,
      )}
    </>
  );
}

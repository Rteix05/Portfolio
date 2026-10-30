'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
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

// Zone dans laquelle on peut déplacer le logo (unités de la scène), et réglages du rebond
const LIMITE_X = 3.8;
const LIMITE_HAUT = 6.5;
const LIMITE_BAS = -0.3;
const GRAVITE = 13; // faible : le logo retombe en douceur, il paraît léger
const REBOND = 0.56; // part de la vitesse gardée à chaque rebond
const borne = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function Logo({ sombre, souris }: { sombre: boolean; souris: React.RefObject<{ x: number; y: number }> }) {
  const groupe = useRef<THREE.Group>(null);
  const orientation = useRef({ x: 0, y: 0 });
  const tour = useRef(REPOS);
  // Position et vitesse du logo, saisi ou en chute libre
  const physique = useRef({ x: 0, y: 0, vx: 0, vy: 0, saisi: false, cibleX: 0, cibleY: 0, ecartX: 0, ecartY: 0, deplace: 0, flottement: 1 });
  const plan = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const [curseur, setCurseur] = useState<'' | 'grab' | 'grabbing'>('');

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

  useEffect(() => {
    document.body.style.cursor = curseur;
    return () => {
      document.body.style.cursor = '';
    };
  }, [curseur]);

  // Glisser suivi sur toute la fenêtre : le logo ne « décroche » pas si la main va trop vite
  const { camera, gl } = useThree();
  useEffect(() => {
    const rayon = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const bouge = (e: PointerEvent) => {
      const ph = physique.current;
      if (!ph.saisi) return;
      const r = gl.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      rayon.setFromCamera(ndc, camera);
      if (!rayon.ray.intersectPlane(plan, point)) return;
      const nx = borne(point.x - ph.ecartX, -LIMITE_X, LIMITE_X);
      const ny = borne(point.y - ph.ecartY, LIMITE_BAS, LIMITE_HAUT);
      ph.deplace += Math.abs(nx - ph.cibleX) + Math.abs(ny - ph.cibleY);
      ph.cibleX = nx;
      ph.cibleY = ny;
    };
    const lacher = () => {
      const ph = physique.current;
      if (!ph.saisi) return;
      ph.saisi = false;
      setCurseur('');
      // Un clic sans déplacement garde son effet : un tour complet
      if (ph.deplace < 0.08 && tour.current === REPOS) tour.current = A_LANCER;
    };
    window.addEventListener('pointermove', bouge);
    window.addEventListener('pointerup', lacher);
    window.addEventListener('pointercancel', lacher);
    return () => {
      window.removeEventListener('pointermove', bouge);
      window.removeEventListener('pointerup', lacher);
      window.removeEventListener('pointercancel', lacher);
    };
  }, [camera, gl, plan, point]);

  useFrame((state, dt) => {
    const g = groupe.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 1 / 30);
    if (tour.current === A_LANCER) tour.current = t;

    const ph = physique.current;
    if (ph.saisi) {
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
      if (ph.y < 0) {
        ph.y = 0;
        ph.vy = ph.vy < -1.2 ? -ph.vy * REBOND : 0;
      }
      // Retour doux vers sa place à l'horizontale
      ph.vx += -ph.x * 6 * d;
      ph.vx *= Math.exp(-2.5 * d);
      ph.x += ph.vx * d;
    }
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
    g.position.set(ph.x, ph.y + Math.sin(t * 1.1) * 0.3 * ph.flottement, 0);
  });

  return (
    <group ref={groupe}>
      {/* Échelle du logo : un peu plus petit que sa première version */}
      <group scale={0.76}>
      {/* Zone de saisie invisible sur tout le rectangle du logo : on l'attrape même entre deux lettres */}
      <mesh
        onPointerOver={() => setCurseur((c) => (c === 'grabbing' ? c : 'grab'))}
        onPointerOut={() => setCurseur((c) => (c === 'grabbing' ? c : ''))}
        onPointerDown={(e) => {
          e.stopPropagation();
          const ph = physique.current;
          if (!e.ray.intersectPlane(plan, point)) return;
          ph.saisi = true;
          ph.ecartX = point.x - ph.x;
          ph.ecartY = point.y - ph.y;
          ph.cibleX = ph.x;
          ph.cibleY = ph.y;
          ph.deplace = 0;
          setCurseur('grabbing');
        }}
      >
        <boxGeometry args={[11.6, 4, 1.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh geometry={geometrie} scale={0.34}>
        <meshPhysicalMaterial
          color={sombre ? '#f4f4f2' : '#141414'}
          metalness={sombre ? 0.15 : 0.45}
          roughness={sombre ? 0.22 : 0.28}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={sombre ? 1.1 : 1.4}
        />
      </mesh>
      </group>
    </group>
  );
}

/**
 * Logo <RT> en 3D, objet flottant de l'accueil : il oscille, flotte, suit le curseur, fait
 * un tour complet au clic, et on peut l'attraper : lâché de haut, il retombe en rebondissant. Clair en thème sombre, foncé en thème clair. Le rendu est en pause
 * dès qu'il est masqué ou hors de l'écran, pour garder la page fluide.
 */
export default function LogoRT3D({ actif, onPret }: { actif: boolean; onPret?: () => void }) {
  const sombre = useSyncExternalStore(suivreTheme, lireSombre, () => true);
  const souris = useRef({ x: 0, y: 0 });
  const conteneur = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Position du curseur sur toute la page : le logo le suit même hors de son cadre
  useEffect(() => {
    const bouge = (e: PointerEvent) => {
      souris.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    window.addEventListener('pointermove', bouge, { passive: true });
    return () => window.removeEventListener('pointermove', bouge);
  }, []);

  useEffect(() => {
    const el = conteneur.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    o.observe(el);
    return () => o.disconnect();
  }, []);

  return (
    // Le canvas déborde largement de son cadre : vers le haut jusqu'à la navigation, vers la
    // droite jusqu'au texte de présentation, pour attraper et lancer le logo sans qu'il soit
    // coupé. La caméra recule et se décale d'autant pour le garder à sa place
    // Masqué (menu ouvert, projet survolé), le canvas ne doit plus capter aucun clic : sa grande
    // zone recouvre les boutons du menu. React Three Fiber force pointer-events: auto sur son
    // conteneur, on le neutralise donc explicitement ici et sur le canvas
    <div
      ref={conteneur}
      className="absolute -bottom-[17.5%] -left-[11%] -right-[14%] -top-[107%] touch-none"
      style={{ pointerEvents: actif ? 'auto' : 'none' }}
    >
      <Canvas
        style={{ pointerEvents: actif ? 'auto' : 'none' }}
        frameloop={actif && visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        camera={{ position: [0.2, 3.63, 29.2], fov: 32 }}
        // Reflets : un studio généré sur place à la création de la scène (aucun fichier HDR à télécharger)
        onCreated={({ gl, scene }) => {
          const pmrem = new THREE.PMREMGenerator(gl);
          scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
          pmrem.dispose();
          onPret?.();
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 6, 8]} intensity={sombre ? 1.2 : 1.8} />
        <directionalLight position={[-6, -2, 4]} intensity={0.5} color={sombre ? '#9fb4ff' : '#ffffff'} />
        <Logo sombre={sombre} souris={souris} />
        <ContactShadows position={[0, -2.1, 0]} opacity={sombre ? 0.55 : 0.35} scale={14} blur={2.6} far={4} resolution={256} color={sombre ? '#000000' : '#1b1a17'} />
      </Canvas>
    </div>
  );
}

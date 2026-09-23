'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Space_Grotesk } from 'next/font/google';
import Footer from '../../components/Footer';
import Navbar from '@/components/Navbar';

gsap.registerPlugin(ScrollTrigger);

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

type Maillon = {
  num: string;
  title: string;
  accent: string;
  text: string;
  items: string[];
};

// La chaîne complète, dans l'ordre où elle se déroule réellement sur un projet.
const maillons: Maillon[] = [
  {
    num: '01',
    title: 'Recherche de mots-clés et intentions',
    accent: '#10b981',
    text: "Tout part de ce que les gens tapent réellement. J'établis la liste des requêtes qui comptent pour le site, avec leur volume de recherche, le niveau de concurrence et surtout l'intention derrière : chercher une information, comparer, ou acheter. C'est cette intention qui décide du contenu d'une page, pas l'inverse.",
    items: [
      'Étude sémantique et champ lexical du secteur',
      'Volume de recherche, difficulté et potentiel de trafic organique',
      'Intentions informationnelle, navigationnelle et transactionnelle',
      'Requêtes de longue traîne, souvent les plus rentables sur un site jeune',
    ],
  },
  {
    num: '02',
    title: 'Architecture et arborescence',
    accent: '#14b8a6',
    text: "Une requête identifiée doit correspondre à une page, et une seule. Je construis l'arborescence pour éviter que deux pages se disputent le même mot-clé, et pour qu'aucun contenu important ne se retrouve enterré à cinq clics de l'accueil.",
    items: [
      'Une page par intention de recherche, pas de cannibalisation',
      'URLs courtes, lisibles et stables dans le temps',
      'Regroupement thématique et profondeur de clic maîtrisée',
      'Plan de redirections 301 quand la structure évolue',
    ],
  },
  {
    num: '03',
    title: 'SEO technique et indexation',
    accent: '#3b82f6',
    text: "C'est la couche invisible, et celle qui fait le plus de dégâts quand elle est bancale : un site magnifique dont les pages servent toutes le même title n'existe pas aux yeux de Google. Je vérifie ce que les robots voient vraiment, sur le site en production.",
    items: [
      'robots.txt, sitemap.xml et directives noindex',
      'URL canonique par page, gestion des duplications et des domaines',
      'Rendu JavaScript : contenu réellement présent dans le HTML servi',
      'Codes de réponse, redirections, pages orphelines, budget de crawl',
    ],
  },
  {
    num: '04',
    title: 'Optimisation on-page',
    accent: '#6366f1',
    text: "Chaque page doit dire clairement de quoi elle parle, à Google comme à l'humain qui lit le résultat de recherche. La balise title et la méta-description ne changent pas le classement à elles seules, mais elles décident du taux de clic — et donc du trafic réel.",
    items: [
      'Balises title uniques, calibrées pour ne pas être tronquées dans les SERP',
      'Méta-descriptions rédigées pour le clic, pas pour le robot',
      'Structure Hn cohérente, un seul h1 par page',
      'Contenu, attributs alt et accessibilité, qui se renforcent mutuellement',
    ],
  },
  {
    num: '05',
    title: 'Données structurées et résultats enrichis',
    accent: '#a855f7',
    text: "Le balisage Schema.org permet à Google de comprendre la nature du contenu plutôt que de la deviner : une personne, un article, un produit, un avis. C'est ce qui ouvre l'accès aux extraits enrichis, ces résultats qui occupent plus de place et captent davantage de clics.",
    items: [
      'JSON-LD au format Schema.org, injecté côté serveur',
      'Types adaptés : Person, Organization, Article, BreadcrumbList, FAQPage',
      'Fil d’Ariane exploitable dans les résultats de recherche',
      'Validation via le test des résultats enrichis de Google',
    ],
  },
  {
    num: '06',
    title: 'Performance et Core Web Vitals',
    accent: '#ec4899',
    text: "Les Core Web Vitals sont un critère de classement officiel, mais leur vrai enjeu est ailleurs : un visiteur qui attend trois secondes repart avant d'avoir lu la première ligne. Et Google explore en mobile-first, donc c'est la version mobile qui est jugée.",
    items: [
      'LCP, INP et CLS mesurés sur le terrain, pas seulement en laboratoire',
      'Images en formats modernes, dimensionnées et servies à la bonne taille',
      'Chargement différé des médias lourds situés hors écran',
      'TTFB, mise en cache et stabilité visuelle au chargement',
    ],
  },
  {
    num: '07',
    title: 'Maillage interne et popularité',
    accent: '#f59e0b',
    text: "Les liens internes distribuent l'autorité entre les pages et indiquent à Google lesquelles comptent le plus. C'est le levier le plus sous-estimé, et le seul entièrement sous votre contrôle — contrairement aux backlinks, qui se gagnent.",
    items: [
      'Liens internes contextuels et ancres descriptives',
      'Chasse aux pages orphelines, qu’aucun lien ne pointe',
      'Hiérarchisation : les pages stratégiques reçoivent le plus de liens',
      'Suivi du profil de backlinks et des domaines référents',
    ],
  },
  {
    num: '08',
    title: 'Indexation, mesure et itération',
    accent: '#ef4444',
    text: "Une optimisation non mesurée reste une hypothèse. Search Console dit ce que Google a réellement exploré, indexé, et sur quelles requêtes le site apparaît. C'est ce retour qui décide de la suite du travail.",
    items: [
      'Soumission du sitemap et demandes d’indexation ciblées',
      'Suivi des impressions, positions moyennes et taux de clic',
      'Analyse des erreurs d’exploration et des pages exclues',
      'Comparaison avant / après, puis nouvelle itération',
    ],
  },
];

const etapes = [
  {
    num: '01',
    title: 'Audit',
    text: 'Relevé complet sur les huit maillons, vérifié sur le site en production et pas seulement dans le code. Un problème constaté en ligne vaut mieux qu’un problème supposé.',
  },
  {
    num: '02',
    title: 'Priorisation',
    text: 'Les correctifs sont classés par impact réel sur la visibilité. Une balise title dupliquée sur tout un site passe avant un détail d’attribut.',
  },
  {
    num: '03',
    title: 'Implémentation',
    text: 'Corrections appliquées directement dans le code, vérifiées au build et relues dans le HTML généré avant mise en ligne.',
  },
  {
    num: '04',
    title: 'Mesure',
    text: 'Sitemap soumis, suivi dans Search Console, comparaison des indicateurs sur les semaines suivantes, puis nouvelle boucle.',
  },
];

export default function ReferencementPage() {
  const revealRefs = useRef<(HTMLDivElement | HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealRefs.current.forEach((el) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play reverse play reverse',
              },
            },
          );
        }
      });
    });
    return () => ctx.revert();
  }, []);

  const addRef = (el: HTMLDivElement | HTMLLIElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <main
      className={`${spaceGrotesk.className} bg-white text-black dark:bg-[#050505] dark:text-white min-h-screen transition-colors duration-500`}
    >
      <Navbar />

      {/* HERO */}
      <section className="h-screen w-full relative flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-15 pointer-events-none"
        >
          <source src="/figma2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-white/50 via-white/10 to-white dark:from-[#050505]/50 dark:via-[#050505]/10 dark:to-[#050505]" />

        <div className="relative z-10 text-center px-6">
          <p className="text-sm uppercase tracking-[0.4em] mb-8 opacity-50">SEO · Performance · Visibilité</p>
          <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[9rem] font-semibold tracking-tighter leading-none uppercase drop-shadow-2xl">
            Référencement
          </h1>
          <p className="mt-8 text-base md:text-lg opacity-50 max-w-2xl mx-auto leading-relaxed">
            Le référencement naturel de A à Z : des mots-clés au code, du code à l’indexation, de l’indexation
            aux résultats mesurés dans Search Console.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative z-10 bg-white dark:bg-[#050505] pt-10 px-6 md:px-10 pb-24 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-black/10 dark:border-white/20 pt-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-black/90 dark:text-white/90">
                Le SEO n’est pas une option qu’on active à la fin
              </h2>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed">
                Le référencement naturel se joue dans la structure du HTML, dans le temps de chargement et dans
                la clarté du contenu — c’est-à-dire dans des décisions prises bien avant la mise en ligne. Un site
                rapide et bien balisé se positionne mieux qu’un site optimisé après coup, et cette chaîne ne vaut
                que par son maillon le plus faible : un contenu excellent sur une page que Google n’indexe pas ne
                génère aucun trafic organique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LA CHAINE DE A A Z */}
      <section className="relative z-10 bg-white dark:bg-[#050505] px-6 md:px-10 pb-28 transition-colors duration-500">
        <div className="max-w-5xl mx-auto border-t border-black/10 dark:border-white/20 pt-10">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight text-black/90 dark:text-white/90">
            La chaîne du référencement, de A à Z
          </h2>
          <p className="mt-6 text-lg text-black/60 dark:text-white/60 leading-relaxed max-w-3xl">
            Huit maillons, dans l’ordre où ils se déroulent sur un projet. Chacun dépend du précédent : inutile de
            peaufiner ses balises title si les pages ne sont pas explorables, inutile de viser un mot-clé si aucune
            page ne lui correspond.
          </p>

          <ol className="mt-14">
            {maillons.map((maillon) => (
              <li
                key={maillon.num}
                ref={addRef}
                className="grid gap-4 md:grid-cols-[6rem_1fr] md:gap-10 border-t border-black/5 dark:border-white/5 py-9 first:border-t-0 first:pt-0"
              >
                <div className="flex md:flex-col items-baseline md:items-start gap-3">
                  <span className="text-3xl md:text-4xl font-semibold font-mono leading-none" style={{ color: maillon.accent }}>
                    {maillon.num}
                  </span>
                  <span
                    className="hidden md:block w-10 h-px mt-4"
                    style={{ background: `${maillon.accent}60` }}
                  />
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold leading-tight mb-3">{maillon.title}</h3>
                  <p className="text-base opacity-65 leading-relaxed mb-5">{maillon.text}</p>
                  <ul className="flex flex-col gap-2">
                    {maillon.items.map((item) => (
                      <li key={item} className="text-sm opacity-75 flex gap-3 leading-relaxed">
                        <span style={{ color: maillon.accent }}>—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* METHODE */}
      <section className="relative z-10 bg-white dark:bg-[#050505] px-6 md:px-10 pb-32 transition-colors duration-500">
        <div className="max-w-6xl mx-auto border-t border-black/10 dark:border-white/20 pt-10">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight mb-4 text-black/90 dark:text-white/90">
            Comment j’interviens
          </h2>
          <p className="text-lg text-black/60 dark:text-white/60 leading-relaxed max-w-3xl mb-12">
            La chaîne décrit le terrain, cette boucle décrit la façon de le travailler. Elle se rejoue à chaque
            itération : le référencement naturel n’est pas un chantier qu’on livre, c’est un cycle qu’on entretient.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {etapes.map((etape) => (
              <div key={etape.num} ref={addRef} className="flex flex-col gap-3">
                <span className="text-sm font-mono opacity-30">{etape.num}</span>
                <h3 className="text-xl font-semibold">{etape.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{etape.text}</p>
              </div>
            ))}
          </div>

          <div ref={addRef} className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium border border-black/20 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
            >
              Parler de votre référencement <span>&rarr;</span>
            </a>
            <a
              href="/competences"
              className="text-sm opacity-50 hover:opacity-100 transition-opacity underline underline-offset-4"
            >
              Voir la stack technique complète
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER NAV + COPYRIGHT */}
      <footer className={`border-t border-black/8 dark:border-white/8 ${spaceGrotesk.className}`}>
        <div className="flex items-center justify-between px-6 md:px-16 py-16">
          <a
            href="/competences"
            className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
          >
            &larr; Compétences
          </a>
          <a
            href="/a-propos"
            className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
          >
            À Propos &rarr;
          </a>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6 border-t border-black/8 dark:border-white/8 gap-3">
          <p className="text-xs text-black/20 dark:text-white/20 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Rafael Teixeira — Tous droits réservés
          </p>
          <div className="flex items-center gap-4">
            <Footer />
          </div>
        </div>
      </footer>
    </main>
  );
}

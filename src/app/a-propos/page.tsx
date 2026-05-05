'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Space_Grotesk } from 'next/font/google';
import { LuCamera, LuDumbbell, LuPersonStanding, LuSwords } from 'react-icons/lu';
import Navbar from '@/components/Navbar';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    period: 'Avr. 2026 — Juin 2026',
    role: 'Développeur Full Stack — Stage',
    company: 'MDLP',
    description:
      "Conception d'une application SaaS fullstack avec Next.js et Symfony. Architecture, base de données, API REST et interface utilisateur.",
    tag: 'Stage',
  },
  {
    period: '2023 — Présent',
    role: 'Étudiant BUT MMI',
    company: 'IUT de Troyes',
    description:
      "Formation en Métiers du Multimédia et de l'Internet — développement web, design UI/UX, projets en équipe.",
    tag: 'Formation',
  },
  {
    period: '2023',
    role: 'Baccalauréat STI2D',
    company: 'Spécialité SIN',
    description:
      "Bac Sciences & Technologies de l'Industrie et du Développement Durable, spécialité Systèmes d'Information et Numérique.",
    tag: 'Formation',
  },
];

const hobbies = [
  { icon: <LuCamera size={22} strokeWidth={1.5} />, label: 'Photo & Vidéo' },
  { icon: <LuSwords size={22} strokeWidth={1.5} />, label: 'Kick Boxing' },
  { icon: <LuDumbbell size={22} strokeWidth={1.5} />, label: 'Musculation' },
  { icon: <LuPersonStanding size={22} strokeWidth={1.5} />, label: 'Course à pied' },
];

const links = [
  { label: 'GitHub', value: 'Rteix05', href: 'https://github.com/Rteix05', arrow: '→' },
  {
    label: 'LinkedIn',
    value: 'Rafael Teixeira',
    href: 'https://www.linkedin.com/in/rafael-teixeira-57b5b1269/',
    arrow: '→',
  },
  { label: 'Email', value: 'contact@rafaelteixeira.fr', href: 'mailto:contact@rafaelteixeira.fr', arrow: '→' },
  { label: 'CV', value: 'Télécharger', href: '/CV_Rafael_Teixeira (3).pdf', arrow: '↓' },
];

export default function AProposPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('[data-hero]'), {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-white dark:bg-[#0c0c0c] text-black dark:text-white min-h-screen">
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="min-h-screen pt-32 pb-20 px-6 md:px-16 flex flex-col justify-end">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-8 mb-16 items-end">
            <div
              className="w-48 h-60 md:w-64 md:h-80 rounded-2xl overflow-hidden shrink-0 border border-black/10 dark:border-white/10"
              data-hero
            >
              <img src="/Raf.jpg" alt="Rafael Teixeira" className="w-full h-full object-cover object-top" />
            </div>

            <div className="flex-1 flex flex-col gap-4" data-hero>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full border border-black/20 dark:border-white/20 text-black/50 dark:text-white/50 uppercase tracking-widest">
                  Troyes / Paris
                </span>
                <span className="text-xs px-3 py-1 rounded-full border border-black/20 dark:border-white/20 text-black/50 dark:text-white/50 uppercase tracking-widest">
                  Alternance disponible
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-auto pt-8 border-t border-black/10 dark:border-white/10">
                {[
                  ['Rôle', 'Développeur Full Stack'],
                  ['Stack', 'React · Next · Symfony'],
                  ['Formation', 'BUT MMI · IUT Troyes'],
                  ['Stage', 'MDLP · Avr–Juin 2026'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-black/30 dark:text-white/30 uppercase tracking-widest mb-1">{k}</p>
                    <p className="text-sm font-medium text-black/80 dark:text-white/80">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div data-hero className="border-t border-black/10 dark:border-white/10 pt-8 flex items-end justify-between">
            <div>
              <p className="text-black/60 dark:text-white/60 font-serif text-2xl md:text-3xl italic">Rafael Teixeira</p>
            </div>
            <p className="text-xs text-black/20 dark:text-white/20 uppercase tracking-widest text-right max-w-50">
              Développeur<br />Full Stack & UI/UX
            </p>
          </div>
        </div>
      </section>

      {/* BIO */}
      <section className="py-24 px-6 md:px-16 border-t border-black/8 dark:border-white/8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div data-reveal>
            <p className="text-xs text-black/30 dark:text-white/30 uppercase tracking-widest mb-6">À propos</p>
            <p className="text-3xl md:text-4xl font-serif leading-snug text-black/90 dark:text-white/90">
              Développeur web Full Stack passionné par les interfaces modernes, la 3D interactive et le design UI/UX.
            </p>
          </div>
          <div data-reveal className="flex flex-col gap-6 pt-12 md:pt-16">
            <p className="text-black/50 dark:text-white/50 leading-relaxed text-lg">
              À l&apos;aise du front-end au back-end — React, Next.js, Symfony, Docker — je mène des projets de A à Z, seul
              ou en équipe.
            </p>
            <p className="text-black/50 dark:text-white/50 leading-relaxed text-lg">
              Curieux, autonome et organisé, je cherche une alternance pour progresser dans un environnement professionnel
              stimulant.
            </p>
          </div>
        </div>
      </section>

      {/* PARCOURS */}
      <section className="py-24 px-6 md:px-16 border-t border-black/8 dark:border-white/8">
        <div className="max-w-7xl mx-auto">
          <p data-reveal className="text-xs text-black/30 dark:text-white/30 uppercase tracking-widest mb-12">
            Parcours
          </p>
          <div>
            {experiences.map((exp, i) => (
              <div
                key={i}
                data-reveal
                className="group grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-4 md:gap-8 py-8 border-t border-black/8 dark:border-white/8 hover:bg-black/2 dark:hover:bg-white/2 -mx-6 px-6 transition-colors"
              >
                <div>
                  <p className="text-xs text-black/30 dark:text-white/30 uppercase tracking-widest mt-1">{exp.period}</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-black dark:text-white">{exp.role}</h3>
                    <span className="text-sm text-black/30 dark:text-white/30">· {exp.company}</span>
                  </div>
                  <p className="text-black/40 dark:text-white/40 leading-relaxed text-sm">{exp.description}</p>
                </div>
                <div>
                  <span className="text-xs px-2 py-1 rounded-full border border-black/10 dark:border-white/10 text-black/30 dark:text-white/30">{exp.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOBBIES */}
      <section className="py-24 px-6 md:px-16 border-t border-black/8 dark:border-white/8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div data-reveal className="md:w-1/3">
              <p className="text-xs text-black/30 dark:text-white/30 uppercase tracking-widest mb-4">En dehors du code</p>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">Centres d&apos;intérêt</h2>
            </div>
            <div data-reveal className="flex-1 grid grid-cols-2 gap-3">
              {hobbies.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-4 rounded-xl border border-black/8 dark:border-white/8 p-5 hover:border-black/20 dark:hover:border-white/20 transition-colors"
                >
                  <span className="text-black/50 dark:text-white/50">{h.icon}</span>
                  <span className="font-medium text-black/80 dark:text-white/80">{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 px-6 md:px-16 border-t border-black/8 dark:border-white/8">
        <div className="max-w-7xl mx-auto">
          <p data-reveal className="text-xs text-black/30 dark:text-white/30 uppercase tracking-widest mb-12">
            Me contacter
          </p>
          <div data-reveal className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') || l.href.endsWith('.pdf') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-black/10 dark:border-white/10 p-6 hover:border-black/30 dark:hover:border-white/30 hover:bg-black/4 dark:hover:bg-white/4 transition-all min-h-32"
              >
                <p className="text-xs text-black/30 dark:text-white/30 uppercase tracking-widest">{l.label}</p>
                <div className="flex items-end justify-between mt-4">
                  <p className="font-medium text-black/80 dark:text-white/80 group-hover:text-black dark:group-hover:text-white transition-colors">{l.value}</p>
                  <span className="text-xl text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-all">
                    {l.arrow}
                  </span>
                </div>
              </a>
            ))}
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
            href="/3d"
            className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-colors"
          >
            Projets 3D &rarr;
          </a>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-6 border-t border-black/8 dark:border-white/8 gap-3">
          <p className="text-xs text-black/20 dark:text-white/20 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Rafael Teixeira — Tous droits réservés
          </p>
          <p className="text-xs text-black/20 dark:text-white/20 uppercase tracking-widest">Développeur Full Stack &amp; UI/UX</p>
        </div>
      </footer>
    </main>
  );
}
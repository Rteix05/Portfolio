'use client';

import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import Navbar from '@/components/Navbar';
import WaveMesh from '@/components/WaveMesh';
import { Space_Grotesk } from 'next/font/google';
import { LuMail, LuPhone, LuLinkedin } from 'react-icons/lu';
import { SiGithub } from 'react-icons/si';
import { SUJETS_CONTACT } from '@/lib/contact';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const sujets = SUJETS_CONTACT;

const coordonnees = [
  { label: 'Email', valeur: 'contact@rafaelteixeira.fr', href: 'mailto:contact@rafaelteixeira.fr', icone: LuMail },
  { label: 'Téléphone', valeur: '06 64 68 71 21', href: 'tel:+33664687121', icone: LuPhone },
  { label: 'LinkedIn', valeur: '/in/rafael-teixeira', href: 'https://www.linkedin.com/in/rafael-teixeira-57b5b1269/', icone: LuLinkedin, externe: true },
  { label: 'GitHub', valeur: 'github.com/Rteix05', href: 'https://github.com/Rteix05', icone: SiGithub, externe: true },
];

const domaines = ['Développement fullstack', 'DevOps', 'UX/UI design', 'Référencement SEO'];

// Apparition ligne après ligne en sortant du flou, comme le texte des carrousels
const conteneur: Variants = { cache: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
const ligne: Variants = {
  cache: { opacity: 0, y: 18, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } },
};

// Champ de saisie épuré : simple trait dessous, qui prend la couleur du texte au focus
const champ =
  'w-full border-0 border-b border-black/15 bg-transparent px-0 py-3 text-base text-black placeholder:text-black/30 transition-colors focus:border-black focus:outline-none focus:ring-0 dark:border-white/15 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white';
const etiquette = 'block font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 dark:text-white/45';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', company: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec de l'envoi du message.");
      }
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', company: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : "Échec de l'envoi du message.");
    }
  };

  return (
    <main className={`${spaceGrotesk.className} relative min-h-screen overflow-hidden bg-white text-black transition-colors duration-500 dark:bg-[#050505] dark:text-white`}>
      {/* Fond de la home : champ de points animé, aux couleurs du thème */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <WaveMesh className="h-full w-full" />
        {/* Voile pour garder le texte lisible au-dessus des points */}
        <div className="absolute inset-0 bg-linear-to-b from-white/70 via-white/30 to-white/80 dark:from-[#050505]/70 dark:via-[#050505]/20 dark:to-[#050505]/80" />
      </div>

      <Navbar />

      <motion.div
        variants={conteneur}
        initial="cache"
        animate="visible"
        className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-32 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:pt-36"
      >
        {/* COLONNE GAUCHE : accroche et coordonnées */}
        <div>
          <motion.p variants={ligne} className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-black/55 dark:text-white/55">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Disponible en alternance · sept. 2026
          </motion.p>

          <motion.h1 variants={ligne} className="mt-6 text-[3rem] font-semibold leading-[0.95] tracking-tighter sm:text-[4.5rem] md:text-[5.5rem]">
            Parlons de
            <span className="block">votre projet.</span>
          </motion.h1>

          <motion.p variants={ligne} className="mt-6 max-w-md text-base leading-relaxed text-black/60 dark:text-white/60 md:text-lg">
            Je cherche une alternance en développement front-end, back-end ou fullstack, en DevOps ou en UX/UI. Une question, une mission, une idée : écrivez-moi.
          </motion.p>

          {/* Coordonnées en cartel : étiquette à gauche, valeur à droite, flèche qui glisse au survol */}
          <motion.ul variants={ligne} className="mt-12 border-t border-black/10 dark:border-white/10">
            {coordonnees.map(({ label, valeur, href, icone: Icone, externe }) => (
              <li key={label} className="border-b border-black/10 dark:border-white/10">
                <a
                  href={href}
                  {...(externe ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 py-4 md:py-5"
                >
                  <span className="flex w-24 shrink-0 items-center gap-2 font-mono md:w-28 md:gap-2.5 text-[10px] uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
                    <Icone size={14} aria-hidden="true" />
                    {label}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-base font-medium md:text-lg">{valeur}</span>
                  <span
                    aria-hidden="true"
                    className="text-lg text-black/30 transition-[transform,color] duration-500 ease-out-soft group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-black dark:text-white/30 dark:group-hover:text-white"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>

          <motion.p variants={ligne} className="mt-8 flex flex-wrap gap-2">
            {domaines.map((d) => (
              <span key={d} className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60 dark:border-white/15 dark:text-white/60">
                {d}
              </span>
            ))}
          </motion.p>
        </div>

        {/* COLONNE DROITE : formulaire */}
        <motion.div
          variants={ligne}
          className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0b0b]/70 md:p-10"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Envoyer un message</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40">Je réponds rapidement</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-7">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={etiquette}>Nom *</label>
                <input id="name" name="name" type="text" required autoComplete="name" value={formData.name} onChange={handleChange} placeholder="Votre nom" className={champ} />
              </div>
              <div>
                <label htmlFor="email" className={etiquette}>Email *</label>
                <input id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} placeholder="votre@exemple.com" className={champ} />
              </div>
            </div>

            {/* Sujet en pastilles : un clic pour choisir, un second pour retirer */}
            <fieldset>
              <legend className={etiquette}>Sujet</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {sujets.map((s) => {
                  const actif = formData.subject === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => setFormData((prev) => ({ ...prev, subject: actif ? '' : s }))}
                      className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                        actif
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                          : 'border-black/15 text-black/65 hover:border-black/40 dark:border-white/15 dark:text-white/65 dark:hover:border-white/40'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="message" className={etiquette}>Message *</label>
              <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} placeholder="Parlez-moi de votre projet, de la mission ou de votre question…" className={`${champ} resize-none`} />
            </div>

            {/* Honeypot anti-spam, invisible aux humains */}
            <input type="text" name="company" value={formData.company} onChange={handleChange} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex items-center gap-3 rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition-[transform,opacity] duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
                <span aria-hidden="true" className="transition-transform duration-300 ease-out-soft group-hover:translate-x-1">→</span>
              </button>
              <p role="status" aria-live="polite" className="text-xs">
                {status === 'success' && <span className="text-emerald-600 dark:text-emerald-400">Message envoyé, merci ! Je reviens vers vous rapidement.</span>}
                {status === 'error' && <span className="text-red-600 dark:text-red-400">{errorMessage}</span>}
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </main>
  );
}

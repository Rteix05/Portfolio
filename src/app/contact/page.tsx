'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Space_Grotesk } from 'next/font/google';
import { LuMail, LuPhone, LuLinkedin, LuArrowUpRight, LuCode, LuServer, LuPenTool, LuPaperclip, LuSend } from 'react-icons/lu';
import { SiGithub } from 'react-icons/si';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const subjects = [
  "Proposition d'alternance",
  'Proposition de stage',
  'Collaboration freelance',
  'Question technique',
  'Autre',
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars: import('framer-motion').Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] } },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
    const mailto = `mailto:contact@rafaelteixeira.fr?subject=${encodeURIComponent(formData.subject || 'Contact via portfolio')}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <main className={`${spaceGrotesk.className} bg-black text-white min-h-screen overflow-hidden flex flex-col relative`}>

      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video autoPlay muted loop playsInline disablePictureInPicture className="w-full h-full object-cover opacity-40 mix-blend-lighten">
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <Navbar />

      <div className="grow flex flex-col items-center justify-center px-6 md:px-10 pt-32 pb-20 relative z-10">
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="w-full max-w-6xl flex flex-col gap-8"
        >
          {/* HERO */}
          <motion.div variants={itemVars} className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-white/70 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Recherche alternance — Sept. 2026
            </span>
            <h1 className="text-[2.75rem] md:text-[4rem] font-bold leading-[0.95] tracking-tighter mb-6">
              Let&apos;s build<br />something.
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-md leading-relaxed">
              Actuellement à la recherche d&apos;une alternance — Front-End, Back-End, Fullstack, DevOps ou UX/UI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* COLONNE GAUCHE */}
          <motion.div variants={itemVars} className="flex flex-col gap-8">
            {/* CARTE CONTACT */}
            <div className="rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase tracking-[0.2em] text-white/50">Contact</span>
                <span className="text-xs uppercase tracking-[0.2em] text-white/30">Restons en contact</span>
              </div>

              <div className="flex flex-col divide-y divide-white/10">
                <a href="mailto:contact@rafaelteixeira.fr" className="group flex items-center gap-4 py-4 first:pt-0">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    <LuMail size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Email</span>
                    <span className="block text-sm md:text-base font-medium truncate">contact@rafaelteixeira.fr</span>
                  </span>
                  <LuArrowUpRight size={16} className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                </a>

                <a href="tel:+33664687121" className="group flex items-center gap-4 py-4">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    <LuPhone size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Téléphone</span>
                    <span className="block text-sm md:text-base font-medium truncate">06 64 68 71 21</span>
                  </span>
                  <LuArrowUpRight size={16} className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                </a>

                <a href="https://www.linkedin.com/in/rafael-teixeira-57b5b1269/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-4">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    <LuLinkedin size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-0.5">LinkedIn</span>
                    <span className="block text-sm md:text-base font-medium truncate">/in/rafael-teixeira</span>
                  </span>
                  <LuArrowUpRight size={16} className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                </a>

                <a href="https://github.com/Rteix05" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 py-4 last:pb-0">
                  <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                    <SiGithub size={16} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[10px] uppercase tracking-widest text-white/40 mb-0.5">GitHub</span>
                    <span className="block text-sm md:text-base font-medium truncate">github.com/Rteix05</span>
                  </span>
                  <LuArrowUpRight size={16} className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0" />
                </a>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
                <div className="flex flex-col items-center text-center gap-2">
                  <LuCode size={18} className="text-white/60" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40 leading-tight">Développement<br />Front / Back / Fullstack</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <LuServer size={18} className="text-white/60" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40 leading-tight">DevOps<br />Docker / CI-CD</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <LuPenTool size={18} className="text-white/60" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40 leading-tight">UX/UI<br />Design / Prototypage</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* COLONNE DROITE — FORMULAIRE */}
          <motion.div variants={itemVars} className="rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">Envoyer un message</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-400/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Je réponds rapidement
              </span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Nom *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@exemple.com"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Sujet</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white/80 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors appearance-none"
                >
                  <option value="" className="bg-black">Sélectionner un sujet</option>
                  {subjects.map((s) => (
                    <option key={s} value={s} className="bg-black">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Écrivez votre message ici..."
                  className="w-full resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
                />
              </div>

              <span className="inline-flex items-center gap-2 text-xs text-white/40 -mt-1">
                <LuPaperclip size={14} />
                Ajouter une pièce jointe (optionnel)
              </span>

              <button
                type="submit"
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 px-6 py-3.5 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <LuSend size={16} />
                Envoyer le message
              </button>

              {sent && (
                <p className="text-center text-xs text-emerald-400/80 uppercase tracking-widest">Merci pour votre message —</p>
              )}
            </form>
          </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
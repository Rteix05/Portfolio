import React from 'react'
import { SiGithub } from 'react-icons/si'
import { LuLinkedin, LuMail } from 'react-icons/lu'

export default function Footer() {
  return (
    <div className="flex items-center gap-4">
      <a href="https://github.com/Rteix05" target="_blank" rel="noopener noreferrer" className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white active:text-white transition-colors duration-300">
        <SiGithub size={18} />
      </a>
      <a href="https://www.linkedin.com/in/rafael-teixeira-57b5b1269/" target="_blank" rel="noopener noreferrer" className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white active:text-white transition-colors duration-300">
        <LuLinkedin size={18} />
      </a>
      <a href="/contact" className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white active:text-white transition-colors duration-300">
        <LuMail size={18} />
      </a>
    </div>
  )
}

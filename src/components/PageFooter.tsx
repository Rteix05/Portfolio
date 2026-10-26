import Link from 'next/link';
import Footer from './Footer';

type Lien = { href: string; label: string };

/** Pied de page commun : navigation vers la page précédente / suivante, puis mentions. */
export default function PageFooter({ precedent, suivant }: { precedent?: Lien; suivant?: Lien }) {
  return (
    <footer className="border-t border-black/8 dark:border-white/8">
      {(precedent || suivant) && (
        <nav aria-label="Pages voisines" className="container-site grid grid-cols-2 gap-6 py-14 md:py-20">
          {precedent ? (
            <Link href={precedent.href} className="lien-voisin group">
              <span className="lien-voisin-sens">Précédent</span>
              <span className="lien-voisin-titre">
                <span className="lien-voisin-fleche group-hover:-translate-x-1.5">&larr;</span>
                {precedent.label}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {suivant && (
            <Link href={suivant.href} className="lien-voisin group items-end text-right">
              <span className="lien-voisin-sens">Suivant</span>
              <span className="lien-voisin-titre">
                {suivant.label}
                <span className="lien-voisin-fleche group-hover:translate-x-1.5">&rarr;</span>
              </span>
            </Link>
          )}
        </nav>
      )}
      <div className="border-t border-black/8 dark:border-white/8">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-xs uppercase tracking-widest text-black/30 dark:text-white/30">
            &copy; {new Date().getFullYear()} Rafael Teixeira — Tous droits réservés
          </p>
          <Footer />
        </div>
      </div>
    </footer>
  );
}

/**
 * Logo <RT> : une balise ouvrante dessinée sur une grille de 32 × 10 cases
 * (charte graphique, page Figma « Logo final »). Il prend la couleur du texte.
 * Pour un rendu net, choisir une hauteur multiple de 10 px (une case = un nombre entier de pixels).
 */
export default function LogoRT({ className = '', titre }: { className?: string; titre?: string }) {
  return (
    <svg
      viewBox="0 0 32 10"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={className}
      {...(titre ? { role: 'img', 'aria-label': titre } : { 'aria-hidden': true })}
    >
      <path d="M4 0h2v2h-2zM8 0h16v2h-16zM26 0h2v2h-2zM2 2h4v2h-4zM8 2h2v2h-2zM13 2h4v2h-4zM20 2h2v2h-2zM26 2h4v2h-4zM0 4h4v2h-4zM8 4h7v2h-7zM20 4h2v2h-2zM28 4h4v2h-4zM2 6h4v2h-4zM8 6h2v2h-2zM11 6h4v2h-4zM20 6h2v2h-2zM26 6h4v2h-4zM4 8h2v2h-2zM8 8h2v2h-2zM13 8h4v2h-4zM20 8h2v2h-2zM26 8h2v2h-2z" />
    </svg>
  );
}

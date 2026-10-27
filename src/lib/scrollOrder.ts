import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Plusieurs sections épinglées vivent dans des composants séparés : leurs
 * ScrollTrigger ne sont pas forcément créés dans l'ordre de la page (rechargement
 * à chaud, montage différé). Or chaque épinglage décale tout ce qui suit, et
 * ScrollTrigger recalcule les positions dans l'ordre de création. On retrie donc
 * selon l'ordre du DOM avant de recalculer, sinon une section peut s'épingler
 * par-dessus la précédente.
 */
export function rafraichirDansLOrdre() {
  ScrollTrigger.sort((a: ScrollTrigger, b: ScrollTrigger) => {
    const ea = a.trigger;
    const eb = b.trigger;
    if (!ea || !eb || ea === eb) return 0;
    return ea.compareDocumentPosition(eb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
  ScrollTrigger.refresh();
}

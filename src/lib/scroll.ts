import { isReducedMotion } from './motion';

/**
 * Fait défiler la page de chapitre (conteneur `.page`) jusqu'à un élément,
 * sans jamais déplacer les conteneurs parents (contrairement à scrollIntoView).
 */
export function scrollToInPage(el: HTMLElement | null | undefined, offset = 24) {
  const page = el?.closest<HTMLElement>('.page');
  if (!el || !page) return;
  const top = el.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - offset;
  page.scrollTo({ top: Math.max(0, top), behavior: isReducedMotion() ? 'auto' : 'smooth' });
}

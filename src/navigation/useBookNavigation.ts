/**
 * Navigation « livre » : chapitre précédent / suivant, clavier, balayage tactile,
 * titre du document.
 */
import { useEffect, type RefObject } from 'react';
import { chapterIndex, chapters, type ChapterId } from '../content/chapters';
import { fullName } from '../content/profile';
import { projectById } from '../content/projects';
import { hrefFor, navigate, type Route } from './router';

export function neighbours(id: ChapterId) {
  const i = chapterIndex(id);
  return { prev: chapters[i - 1] ?? null, next: chapters[i + 1] ?? null, index: i };
}

export const goToChapter = (id: ChapterId) => navigate(hrefFor(id));

/** Éléments dans lesquels les flèches ne doivent pas changer de chapitre. */
function arrowsBelongToTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target.closest('input, textarea, select, [contenteditable], [data-arrow-keys], [role="slider"], [role="tablist"], [role="listbox"], [role="menu"]')) return true;
  return false;
}

export function useChapterKeyboard(route: Route) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (arrowsBelongToTarget(e.target)) return;
      if (document.querySelector('dialog[open]')) return;
      const { prev, next } = neighbours(route.chapter);
      const dest = e.key === 'ArrowRight' ? next : prev;
      if (!dest) return;
      e.preventDefault();
      goToChapter(dest.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route.chapter]);
}

/**
 * Balayage horizontal sur mobile. Écouteurs passifs : le défilement vertical n'est jamais bloqué.
 * Ignoré si le geste commence dans une zone qui défile horizontalement ou marquée [data-swipe-ignore].
 */
export function useSwipe(ref: RefObject<HTMLElement | null>, route: Route) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start: { x: number; y: number; t: number } | null = null;

    const scrollsHorizontally = (node: EventTarget | null) => {
      let n = node instanceof HTMLElement ? node : null;
      while (n && n !== el) {
        if (n.dataset.swipeIgnore !== undefined) return true;
        const style = getComputedStyle(n);
        if (/(auto|scroll)/.test(style.overflowX) && n.scrollWidth > n.clientWidth + 2) return true;
        n = n.parentElement;
      }
      return false;
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1 || scrollsHorizontally(e.target)) {
        start = null;
        return;
      }
      const t = e.touches[0];
      start = { x: t.clientX, y: t.clientY, t: performance.now() };
    };
    const onEnd = (e: TouchEvent) => {
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const dt = performance.now() - start.t;
      start = null;
      if (dt > 700 || Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 2) return;
      const { prev, next } = neighbours(route.chapter);
      const dest = dx < 0 ? next : prev;
      if (dest) goToChapter(dest.id);
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, [ref, route.chapter]);
}

export function useDocumentTitle(route: Route) {
  useEffect(() => {
    const chapter = chapters[chapterIndex(route.chapter)];
    let title = `${fullName} — Portfolio`;
    if (route.chapter !== 'couverture') title = `${chapter.title} — ${fullName}`;
    if (route.chapter === 'projets' && route.sub) {
      const p = projectById(route.sub);
      if (p) title = `${p.title} — Projets — ${fullName}`;
    }
    document.title = title;
  }, [route]);
}

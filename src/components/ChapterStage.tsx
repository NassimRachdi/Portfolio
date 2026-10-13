/**
 * Scène des chapitres : chaque chapitre est une « page » indépendante, avec son propre défilement.
 * Lors d'un changement, deux pages coexistent le temps de la transition :
 *   - vers l'avant, la nouvelle page glisse par-dessus la précédente ;
 *   - vers l'arrière, la page courante se retire et dévoile la précédente.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { chapterById, chapterIndex, chapters, pad, type ChapterId } from '../content/chapters';
import { isReducedMotion } from '../lib/motion';
import { markVisited } from '../lib/visited';
import type { Route } from '../navigation/router';
import { useSwipe } from '../navigation/useBookNavigation';

export const PAGE_TRANSITION_MS = 760;

interface Layer {
  key: number;
  route: Route;
  state: 'idle' | 'entering' | 'leaving';
}

let layerKey = 0;

export function ChapterStage({ route, render }: { route: Route; render: (route: Route, active: boolean) => ReactNode }) {
  const [layers, setLayers] = useState<Layer[]>(() => [{ key: layerKey++, route, state: 'idle' }]);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [announce, setAnnounce] = useState('');
  const shown = useRef<ChapterId>(route.chapter);
  const stage = useRef<HTMLDivElement>(null);
  const focusedChapter = useRef<ChapterId>(route.chapter);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useSwipe(stage, route);

  useEffect(() => markVisited(route.chapter), [route.chapter]);

  // Changement de chapitre : on prépare la transition.
  useLayoutEffect(() => {
    if (route.chapter === shown.current) {
      // Même chapitre (paramètres, sous-page) : la page courante suit simplement la route.
      setLayers((ls) => ls.map((l) => (l.state === 'leaving' ? l : { ...l, route })));
      return;
    }
    const from = chapterIndex(shown.current);
    const to = chapterIndex(route.chapter);
    shown.current = route.chapter;

    const c = chapterById(route.chapter);
    setAnnounce(`Chapitre ${pad(to + 1)} sur ${pad(chapters.length)} : ${c.title}`);

    if (isReducedMotion()) {
      window.clearTimeout(timer.current);
      setLayers([{ key: layerKey++, route, state: 'idle' }]);
      return;
    }
    setDirection(to > from ? 'forward' : 'backward');
    setLayers((ls) => {
      const current = ls[ls.length - 1];
      return [
        { ...current, state: 'leaving' },
        { key: layerKey++, route, state: 'entering' },
      ];
    });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setLayers((ls) => ls.filter((l) => l.state !== 'leaving').map((l) => ({ ...l, state: 'idle' })));
    }, PAGE_TRANSITION_MS);
  }, [route]);

  // Focus sur le titre du nouveau chapitre (accessibilité clavier et lecteurs d'écran),
  // une fois la nouvelle page réellement présente dans le DOM.
  useEffect(() => {
    // Pas de déplacement du focus au chargement initial.
    if (focusedChapter.current === route.chapter) return;
    const current = stage.current?.querySelector<HTMLElement>(
      `.page[data-chapter="${route.chapter}"]:not([data-state="leaving"]) [data-chapter-heading]`,
    );
    if (!current) return;
    focusedChapter.current = route.chapter;
    current.focus({ preventScroll: true });
  }, [route.chapter, layers]);

  return (
    <div className="stage" ref={stage} data-direction={direction}>
      {layers.map((layer) => {
        const chapter = chapterById(layer.route.chapter);
        const leaving = layer.state === 'leaving';
        return (
          <article
            key={layer.key}
            className="page"
            id={leaving ? undefined : 'contenu'}
            data-chapter={chapter.id}
            data-surface={chapter.surface}
            data-state={layer.state}
            aria-hidden={leaving || undefined}
            inert={leaving || undefined}
            tabIndex={-1}
          >
            {render(layer.route, !leaving)}
          </article>
        );
      })}
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

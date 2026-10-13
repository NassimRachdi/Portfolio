import { useEffect, useRef } from 'react';
import { chapters, chapterIndex, pad } from '../content/chapters';
import { fullName } from '../content/profile';
import { setReducedMotion, useReducedMotion } from '../lib/motion';
import { useVisited } from '../lib/visited';
import { hrefFor, type Route } from '../navigation/router';
import { Monogram } from './Monogram';

const total = pad(chapters.length);

function TocList({ route, onNavigate }: { route: Route; onNavigate?: () => void }) {
  const visited = useVisited();
  return (
    <ol className="toc__list">
      {chapters.map((c, i) => {
        const active = c.id === route.chapter;
        return (
          <li key={c.id}>
            <a
              className="toc__link"
              href={hrefFor(c.id)}
              aria-current={active ? 'page' : undefined}
              data-visited={visited.includes(c.id) && !active ? '' : undefined}
              onClick={onNavigate}
            >
              <span className="toc__num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="toc__text">
                <span className="toc__title">
                  <span className="sr-only">Chapitre {i + 1} : </span>
                  {c.short}
                </span>
                <span className="toc__summary">{c.summary}</span>
              </span>
              {visited.includes(c.id) && !active && <span className="sr-only"> (déjà consulté)</span>}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function MotionSwitch() {
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={reduced}
      className="motion-switch"
      onClick={() => setReducedMotion(!reduced)}
    >
      <span className="motion-switch__track" aria-hidden="true">
        <span className="motion-switch__thumb" />
      </span>
      <span>Réduire les animations</span>
    </button>
  );
}

/** Sommaire latéral (ordinateur). */
export function Sommaire({ route }: { route: Route }) {
  const index = chapterIndex(route.chapter);
  return (
    <aside className="toc" aria-label="Sommaire du portfolio">
      <a className="toc__brand" href={hrefFor('couverture')}>
        <Monogram size={44} />
        <span className="toc__brand-text">
          <span className="toc__name">{fullName}</span>
          <span className="meta">Portfolio · Volume 2026</span>
        </span>
      </a>
      <p className="meta toc__label" aria-hidden="true">
        Sommaire
      </p>
      <nav aria-label="Chapitres">
        <TocList route={route} />
      </nav>
      <div className="toc__foot">
        <p className="meta toc__progress">
          Chapitre <strong>{pad(index + 1)}</strong> / {total}
        </p>
        <div className="toc__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${(index + 1) / chapters.length})` }} />
        </div>
        <MotionSwitch />
      </div>
    </aside>
  );
}

/** En-tête compact + sommaire en panneau (tablette et téléphone). */
export function MobileHeader({ route }: { route: Route }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const index = chapterIndex(route.chapter);
  const chapter = chapters[index];

  // Ferme le panneau si l'URL change (bouton retour du navigateur, par exemple).
  useEffect(() => {
    if (dialog.current?.open) dialog.current.close();
  }, [route.chapter]);

  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  return (
    <>
      <header className="topbar">
        <a className="topbar__brand" href={hrefFor('couverture')} aria-label={`${fullName} — retour à la couverture`}>
          <Monogram size={34} />
        </a>
        <p className="topbar__where" aria-live="off">
          <span className="meta">
            {pad(index + 1)} / {total}
          </span>
          <span className="topbar__chapter">{chapter.short}</span>
        </p>
        <button type="button" className="topbar__menu" aria-haspopup="dialog" onClick={open}>
          <span className="topbar__menu-icon" aria-hidden="true">
            <span />
            <span />
          </span>
          Sommaire
        </button>
      </header>
      <dialog
        ref={dialog}
        className="toc-sheet"
        aria-label="Sommaire"
        onClick={(e) => {
          // Clic sur le fond : fermeture.
          if (e.target === dialog.current) close();
        }}
      >
        <div className="toc-sheet__inner">
          <div className="toc-sheet__head">
            <p className="meta">Sommaire</p>
            <button type="button" className="toc-sheet__close" onClick={close}>
              Fermer
            </button>
          </div>
          <nav aria-label="Chapitres">
            <TocList route={route} onNavigate={close} />
          </nav>
          <div className="toc-sheet__foot">
            <MotionSwitch />
          </div>
        </div>
      </dialog>
    </>
  );
}

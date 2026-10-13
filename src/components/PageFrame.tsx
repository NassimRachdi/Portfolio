import { Fragment, type ReactNode } from 'react';
import { chapterById, chapterIndex, chapters, pad, type ChapterId } from '../content/chapters';
import { setReducedMotion, useReducedMotion } from '../lib/motion';
import { hrefFor } from '../navigation/router';
import { neighbours } from '../navigation/useBookNavigation';

/** Mots du titre enveloppés dans un masque, pour une apparition ligne à ligne. */
export function RevealText({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="rw">
            <span style={{ ['--i' as string]: i + offset }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </>
  );
}

export function MotionSwitch() {
  const reduced = useReducedMotion();
  return (
    <button type="button" role="switch" aria-checked={reduced} className="motion-switch" onClick={() => setReducedMotion(!reduced)}>
      <span className="motion-switch__track" aria-hidden="true">
        <span className="motion-switch__thumb" />
      </span>
      <span>Réduire les animations</span>
    </button>
  );
}

/** Fin de page : section précédente / suivante, clairement nommées. */
function PageEnd({ chapter }: { chapter: ChapterId }) {
  const { prev, next } = neighbours(chapter);
  return (
    <footer className="page-end">
      <nav className="page-end__nav" aria-label="Sections voisines">
        {prev ? (
          <a className="page-end__link page-end__prev" href={hrefFor(prev.id)} rel="prev">
            <span className="meta">← Précédent</span>
            <span className="page-end__title">{prev.title}</span>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a className="page-end__link page-end__next" href={hrefFor(next.id)} rel="next">
            <span className="meta">Suivant →</span>
            <span className="page-end__title">{next.title}</span>
            <span className="page-end__summary">{next.summary}</span>
          </a>
        ) : (
          <a className="page-end__link page-end__next" href={hrefFor(chapters[0].id)}>
            <span className="meta">Retour</span>
            <span className="page-end__title">Revenir à l’accueil</span>
          </a>
        )}
      </nav>
      <div className="page-end__meta">
        <MotionSwitch />
      </div>
    </footer>
  );
}

/** Cadre commun d'une page : contenu, puis navigation vers les sections voisines. */
export function PageFrame({ chapter, children, className = '' }: { chapter: ChapterId; children: ReactNode; className?: string }) {
  return (
    <div className={`frame frame--${chapter} ${className}`}>
      {children}
      <PageEnd chapter={chapter} />
    </div>
  );
}

/** En-tête de page : numéro, titre (h1 focusable), chapeau. */
export function ChapterHeader({
  chapter,
  title,
  lead,
  kicker,
  className = '',
}: {
  chapter: ChapterId;
  title?: string;
  lead?: ReactNode;
  kicker?: string;
  className?: string;
}) {
  const n = chapterIndex(chapter) + 1;
  const c = chapterById(chapter);
  return (
    <header className={`ch-head ${className}`}>
      <p className="ch-head__kicker meta">
        <span>
          {pad(n)} / {pad(chapters.length)}
        </span>
        {kicker && <span className="ch-head__kicker-sep">{kicker}</span>}
      </p>
      <h1 className="ch-head__title" data-chapter-heading tabIndex={-1}>
        <RevealText text={title ?? c.title} />
      </h1>
      {lead && (
        <div className="ch-head__lead reveal" style={{ ['--d' as string]: 3 }}>
          {lead}
        </div>
      )}
      <span className="ch-head__numeral" aria-hidden="true">
        {pad(n)}
      </span>
    </header>
  );
}

/** En-tête d'une partie à l'intérieur d'une page (h2). */
export function SectionHeader({ id, kicker, title, lead }: { id: string; kicker?: string; title: string; lead?: ReactNode }) {
  return (
    <header className="sec-head" id={id}>
      {kicker && <p className="meta sec-head__kicker">{kicker}</p>}
      <h2 className="sec-head__title" id={`${id}-titre`}>
        {title}
      </h2>
      {lead && <div className="sec-head__lead">{lead}</div>}
    </header>
  );
}

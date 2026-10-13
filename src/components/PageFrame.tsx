import { Fragment, type ReactNode } from 'react';
import { chapterById, chapterIndex, pad, type ChapterId } from '../content/chapters';
import { fullName } from '../content/profile';

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

/** Cadre commun d'une page : titre courant, contenu, folio. */
export function PageFrame({ chapter, children, className = '' }: { chapter: ChapterId; children: ReactNode; className?: string }) {
  const n = chapterIndex(chapter) + 1;
  const c = chapterById(chapter);
  return (
    <div className={`frame frame--${chapter} ${className}`}>
      <div className="running-head" aria-hidden="true">
        <span>{fullName}</span>
        <span>
          {pad(n)} — {c.short}
        </span>
      </div>
      {children}
      <p className="folio" aria-hidden="true">
        <span>{pad(n)}</span>
      </p>
    </div>
  );
}

/** En-tête de chapitre : numéro, titre (h1 focusable), chapeau. */
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
        <span>Chapitre {pad(n)}</span>
        {kicker && <span className="ch-head__kicker-sep">{kicker}</span>}
      </p>
      <h1 className="ch-head__title" data-chapter-heading tabIndex={-1}>
        <RevealText text={title ?? c.title} />
      </h1>
      {lead && <div className="ch-head__lead reveal" style={{ ['--d' as string]: 3 }}>{lead}</div>}
      <span className="ch-head__numeral" aria-hidden="true">
        {pad(n)}
      </span>
    </header>
  );
}

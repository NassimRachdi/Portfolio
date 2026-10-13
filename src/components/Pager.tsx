import { chapters, pad } from '../content/chapters';
import { hrefFor, type Route } from '../navigation/router';
import { neighbours } from '../navigation/useBookNavigation';

/** Pied de page du livre : précédent, pagination « Chapitre 03 / 08 », suivant. */
export function Pager({ route }: { route: Route }) {
  const { prev, next, index } = neighbours(route.chapter);
  return (
    <nav className="pager" aria-label="Pagination des chapitres">
      {prev ? (
        <a className="pager__btn pager__btn--prev" href={hrefFor(prev.id)} rel="prev">
          <span className="pager__arrow" aria-hidden="true">
            ←
          </span>
          <span className="pager__label">
            <span className="meta">Précédent</span>
            <span className="pager__title">{prev.short}</span>
          </span>
        </a>
      ) : (
        <span className="pager__btn pager__btn--prev is-disabled" aria-hidden="true" />
      )}

      <div className="pager__center">
        <p className="pager__count">
          <span className="meta">Chapitre</span> <strong>{pad(index + 1)}</strong>
          <span className="pager__sep"> / </span>
          {pad(chapters.length)}
        </p>
        <ol className="pager__ticks" aria-hidden="true">
          {chapters.map((c, i) => (
            <li key={c.id} className={i < index ? 'is-past' : i === index ? 'is-current' : ''} />
          ))}
        </ol>
      </div>

      {next ? (
        <a className="pager__btn pager__btn--next" href={hrefFor(next.id)} rel="next">
          <span className="pager__label">
            <span className="meta">Suivant</span>
            <span className="pager__title">{next.short}</span>
          </span>
          <span className="pager__arrow" aria-hidden="true">
            →
          </span>
        </a>
      ) : (
        <a className="pager__btn pager__btn--next" href={hrefFor('couverture')}>
          <span className="pager__label">
            <span className="meta">Fin du livre</span>
            <span className="pager__title">Revenir au début</span>
          </span>
          <span className="pager__arrow" aria-hidden="true">
            ↺
          </span>
        </a>
      )}
    </nav>
  );
}

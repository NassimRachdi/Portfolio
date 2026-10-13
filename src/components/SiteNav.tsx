import { chapterIndex, chapters } from '../content/chapters';
import { fullName } from '../content/profile';
import { hrefFor, type Route } from '../navigation/router';
import { Monogram } from './Monogram';

/**
 * Navigation principale, toujours visible :
 * barre en haut sur ordinateur, barre d'onglets en bas sur téléphone.
 */
export function SiteNav({ route }: { route: Route }) {
  const index = chapterIndex(route.chapter);
  return (
    <header className="site-header">
      <a className="site-header__brand" href={hrefFor('accueil')} aria-label={`${fullName} — accueil`}>
        <Monogram size={38} />
        <span className="site-header__name">{fullName}</span>
      </a>
      <nav className="site-nav" aria-label="Navigation principale">
        <ol className="site-nav__list">
          {chapters.map((c) => (
            <li key={c.id}>
              <a className="site-nav__link" href={hrefFor(c.id)} aria-current={c.id === route.chapter ? 'page' : undefined}>
                <NavIcon id={c.id} />
                <span>{c.short}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="site-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${(index + 1) / chapters.length})` }} />
      </div>
    </header>
  );
}

/** Petits pictogrammes de la barre mobile (au trait, dans la couleur du texte). */
function NavIcon({ id }: { id: string }) {
  const paths: Record<string, string> = {
    accueil: 'M4 11 12 4l8 7v9h-5v-6H9v6H4z',
    parcours: 'M5 19V5m0 0h0M5 8h9l-2 3 2 3H5',
    projets: 'M3 7h7l2 2h9v10H3z',
    competences: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z',
    contact: 'M3 6h18v12H3zM3 7l9 6 9-6',
  };
  return (
    <svg className="site-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[id]} />
    </svg>
  );
}

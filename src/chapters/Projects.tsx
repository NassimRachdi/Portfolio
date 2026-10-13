import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  kindLabels,
  projectById,
  projects,
  sectionOrder,
  stackNatureLabels,
  themeLabels,
  type Project,
  type ProjectKind,
  type ProjectSection,
  type ProjectTheme,
} from '../content/projects';
import { skillsFor } from '../content/skills';
import { ChapterHeader, PageFrame } from '../components/PageFrame';
import { ProjectVisual } from '../components/ProjectVisual';
import { hasNavigated, hrefFor, navigate, setParam, type Route } from '../navigation/router';
import { isReducedMotion } from '../lib/motion';
import { scrollToInPage } from '../lib/scroll';

/* Contexte de consultation conservé entre la liste et un dossier. */
const listMemory = { scrollTop: 0, lastOpened: null as string | null };

const kinds: ProjectKind[] = ['entreprise', 'personnel'];
const themes = Object.keys(themeLabels) as ProjectTheme[];

function readFilters(route: Route) {
  const t = route.params.get('type');
  const th = route.params.get('theme');
  return {
    type: (kinds as string[]).includes(t ?? '') ? (t as ProjectKind) : null,
    theme: (themes as string[]).includes(th ?? '') ? (th as ProjectTheme) : null,
  };
}

const matches = (p: Project, type: ProjectKind | null, theme: ProjectTheme | null) =>
  (!type || p.kind === type) && (!theme || p.themes.includes(theme));

/* ───────────────────────── Liste des dossiers ───────────────────────── */

function ProjectList({ route }: { route: Route }) {
  const { type, theme } = readFilters(route);
  const visible = useMemo(() => projects.filter((p) => matches(p, type, theme)), [type, theme]);
  const items = useRef(new Map<string, HTMLElement>());
  const before = useRef(new Map<string, DOMRect>());
  const listRef = useRef<HTMLDivElement>(null);

  // Retour depuis un dossier : on restaure le défilement et le focus.
  useLayoutEffect(() => {
    const page = listRef.current?.closest<HTMLElement>('.page');
    if (page && listMemory.lastOpened) {
      page.scrollTop = listMemory.scrollTop;
      const link = listRef.current?.querySelector<HTMLElement>(`[data-project="${listMemory.lastOpened}"] .dossier-row__link`);
      link?.focus({ preventScroll: true });
      listMemory.lastOpened = null;
    }
  }, []);

  // Animation FLIP : les dossiers restants glissent vers leur nouvelle place.
  const snapshot = () => {
    before.current.clear();
    items.current.forEach((el, id) => before.current.set(id, el.getBoundingClientRect()));
  };
  useLayoutEffect(() => {
    if (isReducedMotion() || before.current.size === 0) return;
    items.current.forEach((el, id) => {
      const prev = before.current.get(id);
      const now = el.getBoundingClientRect();
      if (prev) {
        const dy = prev.top - now.top;
        if (Math.abs(dy) > 1) {
          el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], {
            duration: 420,
            easing: 'cubic-bezier(.2,.7,.2,1)',
          });
        }
      } else {
        el.animate(
          [
            { opacity: 0, transform: 'translateY(14px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' },
        );
      }
    });
    before.current.clear();
  }, [type, theme]);

  const setFilter = (key: 'type' | 'theme', value: string | null) => {
    snapshot();
    setParam(key, value);
  };

  const count = (t: ProjectKind | null, th: ProjectTheme | null) => projects.filter((p) => matches(p, t, th)).length;

  const open = (e: React.MouseEvent, p: Project) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // nouvel onglet : comportement natif
    e.preventDefault();
    const page = listRef.current?.closest<HTMLElement>('.page');
    listMemory.scrollTop = page?.scrollTop ?? 0;
    listMemory.lastOpened = p.id;
    navigate(hrefFor('projets', p.id, { type, theme }), { state: { fromList: true } });
  };

  const groups = kinds
    .map((k) => ({ kind: k, items: visible.filter((p) => p.kind === k) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="projects" ref={listRef}>
      <ChapterHeader
        chapter="projets"
        kicker="Cinq dossiers"
        lead={
          <p>
            Le cœur de ce portfolio : quatre projets menés en entreprise et un projet personnel. Chaque dossier s’ouvre
            sur la même structure — du contexte jusqu’aux enseignements.
          </p>
        }
      />

      <div className="filters reveal" style={{ ['--d' as string]: 4 }} role="group" aria-label="Filtrer les projets">
        <div className="filters__group" data-swipe-ignore>
          <p className="meta filters__label" id="filter-type">
            Nature
          </p>
          <div className="filters__options" role="group" aria-labelledby="filter-type">
            <button type="button" className="chip" aria-pressed={!type} onClick={() => setFilter('type', null)}>
              Tous <span className="chip__count">{count(null, theme)}</span>
            </button>
            {kinds.map((k) => (
              <button
                key={k}
                type="button"
                className="chip"
                aria-pressed={type === k}
                onClick={() => setFilter('type', type === k ? null : k)}
                disabled={count(k, theme) === 0 && type !== k}
              >
                {k === 'entreprise' ? 'Entreprise' : 'Personnel'} <span className="chip__count">{count(k, theme)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="filters__group" data-swipe-ignore>
          <p className="meta filters__label" id="filter-theme">
            Thème
          </p>
          <div className="filters__options" role="group" aria-labelledby="filter-theme">
            <button type="button" className="chip" aria-pressed={!theme} onClick={() => setFilter('theme', null)}>
              Tous les thèmes
            </button>
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                className="chip"
                aria-pressed={theme === t}
                onClick={() => setFilter('theme', theme === t ? null : t)}
              >
                {themeLabels[t]} <span className="chip__count">{count(type, t)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="filters__status">
          <p aria-live="polite" className="filters__result">
            <strong>{visible.length}</strong> {visible.length > 1 ? 'dossiers affichés' : visible.length === 1 ? 'dossier affiché' : 'dossier'}
            {(type || theme) && <span className="sr-only"> après filtrage</span>}
          </p>
          {(type || theme) && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                snapshot();
                navigate(hrefFor('projets'), { replace: true });
              }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <p className="empty__title">Aucun dossier ne correspond à cette combinaison.</p>
          <p>Essayez un autre thème, ou réinitialisez les filtres.</p>
          <button type="button" className="btn" onClick={() => navigate(hrefFor('projets'), { replace: true })}>
            Afficher tous les projets
          </button>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.kind} className={`dossier-group dossier-group--${g.kind}`} aria-labelledby={`group-${g.kind}`}>
            <h2 id={`group-${g.kind}`} className="dossier-group__title">
              <span>{g.kind === 'entreprise' ? 'Projets d’entreprise' : 'Projet personnel'}</span>
              <span className="meta">{g.kind === 'entreprise' ? 'Alternance SNCF' : 'Construit sur mon temps personnel'}</span>
            </h2>
            <ul className="dossier-list">
              {g.items.map((p) => (
                <li
                  key={p.id}
                  data-project={p.id}
                  className="dossier-row"
                  ref={(el) => {
                    if (el) items.current.set(p.id, el);
                    else items.current.delete(p.id);
                  }}
                >
                  <a className="dossier-row__link" href={hrefFor('projets', p.id, { type, theme })} onClick={(e) => open(e, p)}>
                    <span className="dossier-row__letter" aria-hidden="true">
                      {p.letter}
                    </span>
                    <span className="dossier-row__body">
                      <span className="dossier-row__meta meta">
                        <span>Dossier {p.letter}</span>
                        <span>{p.category}</span>
                      </span>
                      <span className="dossier-row__title">{p.title}</span>
                      <span className="dossier-row__teaser">{p.teaser}</span>
                      <span className="dossier-row__tags">
                        <span className={`badge badge--${p.kind}`}>{kindLabels[p.kind]}</span>
                        <span className={`badge badge--status badge--${p.status.tone}`}>{p.status.label}</span>
                      </span>
                    </span>
                    <span className="dossier-row__visual" aria-hidden="true">
                      <ProjectVisual kind={p.visual} compact />
                    </span>
                    <span className="dossier-row__open">
                      Ouvrir le dossier <span aria-hidden="true">→</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

/* ───────────────────────── Dossier détaillé ───────────────────────── */

function Section({ section }: { section: ProjectSection }) {
  return (
    <>
      {section.text?.map((t, i) => (
        <p key={i}>{t}</p>
      ))}
      {section.steps && (
        <ol className="dossier__steps">
          {section.steps.map((s, i) => (
            <li key={i}>
              <span className="dossier__step-num meta">{String(i + 1).padStart(2, '0')}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}
      {section.list && (
        <ul className={section.steps ? 'dossier__topics' : 'dossier__list'}>
          {section.list.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </>
  );
}

function ProjectDossier({ project, route }: { project: Project; route: Route }) {
  const { type, theme } = readFilters(route);
  const root = useRef<HTMLDivElement>(null);
  const index = projects.indexOf(project);
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const listHref = hrefFor('projets', null, { type, theme });
  const skills = skillsFor('project', project.id);
  const [activeSection, setActiveSection] = useState<string>(sectionOrder[0].key);

  // Sommaire du dossier : la section en cours de lecture est mise en évidence.
  useEffect(() => {
    const page = root.current?.closest<HTMLElement>('.page');
    const sections = root.current?.querySelectorAll<HTMLElement>('.dossier__section');
    if (!page || !sections?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id.replace('section-', ''));
      },
      { root: page, rootMargin: '-15% 0px -55% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [project.id]);

  const back = () => {
    const state = window.history.state as { fromList?: boolean } | null;
    if (state?.fromList) window.history.back();
    else {
      listMemory.lastOpened = project.id;
      navigate(listHref);
    }
  };

  // Ouverture : haut de page et focus sur le titre du dossier.
  useEffect(() => {
    const page = root.current?.closest<HTMLElement>('.page');
    if (page) page.scrollTop = 0;
    if (hasNavigated()) root.current?.querySelector<HTMLElement>('[data-chapter-heading]')?.focus({ preventScroll: true });
  }, [project.id]);

  // Échap : retour à la liste.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || document.querySelector('dialog[open]')) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, select')) return;
      back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const go = (p: Project) => navigate(hrefFor('projets', p.id, { type, theme }), { replace: true, state: window.history.state });

  return (
    <div className="dossier" ref={root} key={project.id} data-kind={project.kind}>
      <div className="dossier__bar">
        <a
          className="back-btn"
          href={listHref}
          onClick={(e) => {
            e.preventDefault();
            back();
          }}
        >
          <span aria-hidden="true">←</span> Tous les projets
        </a>
        <p className="meta dossier__position">
          Dossier {project.letter} · {index + 1} / {projects.length}
        </p>
      </div>

      <header className="dossier__head">
        <span className="dossier__letter" aria-hidden="true">
          {project.letter}
        </span>
        <div className="dossier__head-text">
          <p className="meta dossier__kicker">
            <span className={`badge badge--${project.kind}`}>{kindLabels[project.kind]}</span>
            <span>{project.category}</span>
          </p>
          <h1 className="dossier__title" data-chapter-heading tabIndex={-1}>
            {project.title}
          </h1>
          <p className="dossier__teaser">{project.teaser}</p>
          <dl className="dossier__facts">
            <div>
              <dt className="meta">État</dt>
              <dd>{project.status.label}</dd>
            </div>
            <div>
              <dt className="meta">Cadre</dt>
              <dd>{project.collective ? 'Travail d’équipe — j’y ai contribué' : project.kind === 'personnel' ? 'Projet personnel' : 'Projet mené en entreprise'}</dd>
            </div>
          </dl>
        </div>
      </header>

      <figure className="dossier__figure">
        <ProjectVisual kind={project.visual} label={project.visualCaption} />
        <figcaption>
          <span className="concept-tag">Illustration conceptuelle</span> {project.visualCaption}
        </figcaption>
      </figure>

      {project.glossary && (
        <aside className="glossary" aria-label="Lexique">
          {project.glossary.map((g) => (
            <p key={g.term}>
              <span className="meta">Pour comprendre</span>
              <strong>{g.term}</strong> — {g.definition}
            </p>
          ))}
        </aside>
      )}

      <div className="dossier__layout">
        <nav className="dossier__toc" aria-label="Sections du dossier">
          <ol>
            {sectionOrder.map((s, i) => (
              <li key={s.key}>
                <a
                  href={`#/projets/${project.id}`}
                  aria-current={activeSection === s.key ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = root.current?.querySelector<HTMLElement>(`#section-${s.key}`);
                    scrollToInPage(target);
                    target?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
                  }}
                >
                  <span className="meta">{String(i + 1).padStart(2, '0')}</span> {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="dossier__content">
          {sectionOrder.map((s, i) => (
            <section key={s.key} id={`section-${s.key}`} className={`dossier__section dossier__section--${s.key}`}>
              <h2 tabIndex={-1}>
                <span className="dossier__section-num meta">{String(i + 1).padStart(2, '0')}</span>
                {s.label}
              </h2>
              <div className="dossier__section-body">
                <Section section={project.sections[s.key]} />
                {s.key === 'objectif' && project.scope && (
                  <div className="dossier__scope">
                    <p className="meta">{project.scope.title} — pas encore entièrement livré</p>
                    <ul>
                      {project.scope.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.key === 'approche' && project.stack && (
                  <div className="dossier__stack">
                    <p className="meta">Briques techniques — ce qui est réalisé, ce qui est envisagé</p>
                    <ul>
                      {project.stack.map((st) => (
                        <li key={st.name} data-nature={st.nature}>
                          <span className="dossier__stack-name">{st.name}</span>
                          <span className={`nature nature--${st.nature}`}>{stackNatureLabels[st.nature]}</span>
                          {st.note && <span className="dossier__stack-note">{st.note}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.key === 'etat' && project.nextSteps && (
                  <div className="dossier__next">
                    <p className="meta">{project.nextSteps.title} — des pistes, pas des fonctionnalités livrées</p>
                    <ul>
                      {project.nextSteps.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          ))}

          {skills.length > 0 && (
            <section className="dossier__skills" aria-labelledby="dossier-skills">
              <h2 id="dossier-skills" className="meta">
                Compétences mobilisées
              </h2>
              <ul>
                {skills.map((s) => (
                  <li key={s.id}>
                    <a className="chip chip--link" href={hrefFor('competences', null, { competence: s.id })}>
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.disclosure && <p className="dossier__disclosure">{project.disclosure}</p>}
        </div>
      </div>

      <nav className="dossier__foot" aria-label="Autres dossiers">
        {prev ? (
          <button type="button" className="dossier__nav" onClick={() => go(prev)}>
            <span className="meta">← Dossier {prev.letter}</span>
            <span>{prev.title}</span>
          </button>
        ) : (
          <span />
        )}
        <a
          className="btn"
          href={listHref}
          onClick={(e) => {
            e.preventDefault();
            back();
          }}
        >
          Retour à la liste
        </a>
        {next ? (
          <button type="button" className="dossier__nav dossier__nav--next" onClick={() => go(next)}>
            <span className="meta">Dossier {next.letter} →</span>
            <span>{next.title}</span>
          </button>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

export function Projects({ route }: { route: Route }) {
  const project = route.sub ? projectById(route.sub) : undefined;
  return (
    <PageFrame chapter="projets" className={project ? 'frame--dossier' : ''}>
      {project ? (
        <ProjectDossier project={project} route={route} key={project.id} />
      ) : route.sub ? (
        <div className="empty">
          <h1 data-chapter-heading tabIndex={-1} className="empty__title">
            Ce dossier n’existe pas.
          </h1>
          <a className="btn" href={hrefFor('projets')}>
            Voir tous les projets
          </a>
        </div>
      ) : (
        <ProjectList route={route} />
      )}
    </PageFrame>
  );
}

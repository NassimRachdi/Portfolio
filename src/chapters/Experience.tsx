import { useEffect, useRef } from 'react';
import { enterpriseProjectsNote, experiences, sideExperience } from '../content/experience';
import { projectById } from '../content/projects';
import { ChapterHeader, PageFrame } from '../components/PageFrame';
import { hrefFor, setParam, type Route } from '../navigation/router';
import { isReducedMotion } from '../lib/motion';
import { scrollToInPage } from '../lib/scroll';

export function Experience({ route, active }: { route: Route; active: boolean }) {
  const focus = route.params.get('focus');
  const refs = useRef<Record<string, HTMLElement | null>>({});

  // Arrivée depuis un lien (timeline, compétences) : on amène l'expérience concernée à l'écran.
  useEffect(() => {
    if (!active || !focus) return;
    const el = refs.current[focus];
    if (!el) return;
    const t = window.setTimeout(() => scrollToInPage(el), isReducedMotion() ? 0 : 380);
    return () => window.clearTimeout(t);
  }, [focus, active]);

  return (
    <PageFrame chapter="experience">
      <ChapterHeader
        chapter="experience"
        kicker="SNCF · depuis 2023"
        lead={
          <p>
            Depuis 2023, mon alternance se déroule à la SNCF. Plutôt qu’une liste d’outils, voici les besoins que j’ai
            rencontrés, ce que j’y ai apporté et ce que j’en retiens.
          </p>
        }
      />

      <nav className="xp-index" aria-label="Périodes d’alternance" data-swipe-ignore>
        {experiences.map((x) => (
          <button
            key={x.id}
            type="button"
            className="xp-index__item"
            aria-pressed={focus === x.id}
            onClick={() => {
              setParam('focus', x.id);
              scrollToInPage(refs.current[x.id]);
            }}
          >
            <span className="meta">{x.period}</span>
            <span>{x.entity.split(' — ')[0]}</span>
          </button>
        ))}
      </nav>

      <div className="xp-list">
        {experiences.map((x, i) => (
          <section
            key={x.id}
            id={`xp-${x.id}`}
            ref={(el) => {
              refs.current[x.id] = el;
            }}
            className="xp reveal"
            style={{ ['--d' as string]: 3 + i }}
            data-focused={focus === x.id || undefined}
            data-status={x.status}
            aria-labelledby={`xp-title-${x.id}`}
          >
            <div className="xp__aside">
              <p className="xp__period">{x.period}</p>
              {x.status === 'en-cours' && <p className="status status--en-cours">En cours</p>}
            </div>
            <div className="xp__main">
              <h2 id={`xp-title-${x.id}`} className="xp__title">
                {x.entity}
              </h2>
              <p className="xp__role meta">{x.role}</p>
              <p className="xp__context">{x.context}</p>

              {(x.needs.length > 0 || x.contributions.length > 0) && (
                <div className="xp__grid">
                  <div>
                    <h3 className="meta xp__col-title">Besoins rencontrés</h3>
                    <ul>
                      {x.needs.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="meta xp__col-title">Mes contributions</h3>
                    <ul>
                      {x.contributions.map((c) => {
                        const p = c.relatedProject ? projectById(c.relatedProject) : null;
                        return (
                          <li key={c.text}>
                            {c.text}
                            {p && (
                              <>
                                {' '}
                                <a className="inline-link" href={hrefFor('projets', p.id)}>
                                  Voir le dossier {p.letter}
                                  <span aria-hidden="true"> →</span>
                                </a>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div>
                    <h3 className="meta xp__col-title">Ce que j’en retiens</h3>
                    <ul>
                      {x.learnings.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="xp-foot">
        <p className="xp-note">
          {enterpriseProjectsNote}{' '}
          <a className="inline-link" href={hrefFor('projets', null, { type: 'entreprise' })}>
            Voir les projets d’entreprise<span aria-hidden="true"> →</span>
          </a>
        </p>
        <aside className="xp-side" aria-labelledby="xp-side-title">
          <h2 id="xp-side-title" className="meta">
            En parallèle — {sideExperience.organisation}
          </h2>
          <p>{sideExperience.text}</p>
        </aside>
      </div>
    </PageFrame>
  );
}

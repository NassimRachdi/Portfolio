import { useRef } from 'react';
import { experiences } from '../content/experience';
import { journey } from '../content/journey';
import { ChapterHeader, PageFrame, SectionHeader } from '../components/PageFrame';
import { Experience } from './Experience';
import { hrefFor, setParam, type Route } from '../navigation/router';

export function Journey({ route, active }: { route: Route; active: boolean }) {
  const requested = route.params.get('etape');
  const selectedIndex = Math.max(
    0,
    journey.findIndex((s) => s.id === requested),
  );
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    const step = journey[(i + journey.length) % journey.length];
    setParam('etape', step.id);
    if (focus) buttons.current[journey.indexOf(step)]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      select(i + 1, true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      select(i - 1, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      select(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      select(journey.length - 1, true);
    }
  };

  return (
    <PageFrame chapter="parcours">
      <ChapterHeader
        chapter="parcours"
        kicker="2022 — 2027"
        lead={
          <p>
            Ma formation, puis mon alternance à la SNCF depuis 2023. Sélectionnez une étape pour en lire le détail.
          </p>
        }
      />

      <SectionHeader id="formation" kicker="Formation" title="De STI2D au Bachelor" />

      <div className="timeline" style={{ ['--rows' as string]: journey.length }}>
        {journey.map((step, i) => {
          const open = i === selectedIndex;
          const relatedExp = experiences.filter((x) => step.relatedExperience?.includes(x.id));
          return (
            <div
              className="timeline__item"
              key={step.id}
              data-open={open || undefined}
              data-past={i < selectedIndex || undefined}
              data-last={i === journey.length - 1 || undefined}
              style={{ ['--row' as string]: i + 1 }}
            >
              <h3 className="timeline__heading">
                <button
                  ref={(el) => {
                    buttons.current[i] = el;
                  }}
                  type="button"
                  className="timeline__step"
                  data-status={step.status}
                  aria-expanded={open}
                  aria-controls={`etape-${step.id}`}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className="timeline__node" aria-hidden="true" />
                  <span className="timeline__period">{step.period}</span>
                  <span className="timeline__title">{step.title}</span>
                  <span className={`status status--${step.status}`}>{step.statusLabel}</span>
                </button>
              </h3>

              <section
                id={`etape-${step.id}`}
                className="timeline__panel"
                hidden={!open}
                aria-label={`${step.period} — ${step.title}`}
              >
                {open && (
                  <div className="timeline__panel-inner" key={step.id}>
                    <p className="timeline__panel-period" aria-hidden="true">
                      {step.period}
                    </p>
                    <p className="timeline__panel-title">{step.title}</p>
                    {step.subtitle && <p className="timeline__panel-sub">{step.subtitle}</p>}
                    <p className={`status status--${step.status}`}>{step.statusLabel}</p>
                    <div className="timeline__panel-body">
                      {step.details.map((d, k) => (
                        <p key={k}>{d}</p>
                      ))}
                    </div>
                    {step.topics && (
                      <div className="timeline__topics">
                        <p className="meta">Thèmes travaillés en formation</p>
                        <ul>
                          {step.topics.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {relatedExp.length > 0 && (
                      <div className="timeline__related">
                        <p className="meta">En parallèle, en entreprise</p>
                        <ul>
                          {relatedExp.map((x) => (
                            <li key={x.id}>
                              <a href={hrefFor('parcours', null, { etape: step.id, focus: x.id })}>
                                <span>{x.entity}</span>
                                <span className="meta">{x.period}</span>
                                <span aria-hidden="true">→</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="timeline__panel-nav">
                      <button type="button" className="link-btn" onClick={() => select(i - 1)} disabled={i === 0}>
                        ← Étape précédente
                      </button>
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => select(i + 1)}
                        disabled={i === journey.length - 1}
                      >
                        Étape suivante →
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          );
        })}
      </div>

      <Experience route={route} active={active} />
    </PageFrame>
  );
}

import { aiStatement, growthAxes, methodSteps } from '../content/method';
import { projectById } from '../content/projects';
import { SectionHeader } from '../components/PageFrame';
import { hrefFor, setParam, type Route } from '../navigation/router';

const R = 118;
const C = 2 * Math.PI * R;

function MethodRing({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const n = methodSteps.length;
  const point = (i: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: 160 + R * Math.cos(a), y: 160 + R * Math.sin(a) };
  };
  return (
    <svg className="ring" viewBox="0 0 320 320" aria-hidden="true">
      <circle cx="160" cy="160" r={R} className="ring__track" />
      <circle
        cx="160"
        cy="160"
        r={R}
        className="ring__progress"
        style={{ strokeDasharray: C, strokeDashoffset: C * (1 - active / n) }}
        transform="rotate(-90 160 160)"
      />
      {methodSteps.map((s, i) => {
        const p = point(i);
        return (
          <g
            key={s.id}
            className={`ring__node ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
            onClick={() => onSelect(i)}
          >
            <circle cx={p.x} cy={p.y} r="17" />
            <text x={p.x} y={p.y + 4} textAnchor="middle">
              {i + 1}
            </text>
          </g>
        );
      })}
      <text x="160" y="150" textAnchor="middle" className="ring__center-num">
        {String(active + 1).padStart(2, '0')}
      </text>
      <text x="160" y="178" textAnchor="middle" className="ring__center-label">
        {methodSteps[active].verb.split(' ')[0]}
      </text>
      <text x="160" y="200" textAnchor="middle" className="ring__center-loop">
        ↻ et on recommence
      </text>
    </svg>
  );
}

export function Method({ route }: { route: Route }) {
  const requested = route.params.get('etape');
  const active = Math.max(0, methodSteps.findIndex((s) => s.id === requested));
  const select = (i: number) => setParam('etape', methodSteps[i].id);

  return (
    <section className="method-section" aria-labelledby="methode-titre">
      <SectionHeader
        id="methode"
        kicker="Ma méthode"
        title="Comment je travaille"
        lead={
          <p>
            Huit temps. Je m’efforce de n’en sauter aucun, surtout ceux qu’on est tenté d’écourter : tester et documenter.
          </p>
        }
      />
      <div className="spread method">
        <div className="spread__left method__left">
          <div className="method__ring">
            <MethodRing active={active} onSelect={select} />
          </div>
        </div>

        <div className="spread__right">
          <ol className="steps">
            {methodSteps.map((s, i) => {
              const open = i === active;
              const p = s.exampleProject ? projectById(s.exampleProject) : null;
              return (
                <li key={s.id} className="step" data-open={open || undefined}>
                  <button type="button" className="step__btn" aria-expanded={open} onClick={() => select(i)}>
                    <span className="step__num meta">{String(i + 1).padStart(2, '0')}</span>
                    <span className="step__verb">{s.verb}</span>
                  </button>
                  <p className="step__text">{s.text}</p>
                  {open && (
                    <p className="step__example">
                      <span className="meta">Exemple</span> {s.example}{' '}
                      {p && (
                        <a className="inline-link" href={hrefFor('projets', p.id)}>
                          Dossier {p.letter}
                          <span aria-hidden="true"> →</span>
                        </a>
                      )}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <section className="growth" aria-labelledby="growth-title">
        <h2 id="growth-title" className="section-title">
          Ce que je construis
        </h2>
        <p className="growth__lead">Mes axes de progression : là où j’en suis, et ce que je travaille ensuite.</p>
        <div className="growth__table" role="table" aria-label="Axes de progression">
          <div className="growth__row growth__row--head" role="row">
            <span role="columnheader" className="meta">
              Axe
            </span>
            <span role="columnheader" className="meta">
              Aujourd’hui
            </span>
            <span role="columnheader" className="meta">
              Ensuite
            </span>
          </div>
          {growthAxes.map((g, i) => (
            <div className="growth__row" role="row" key={g.id}>
              <span role="rowheader" className="growth__axis">
                <span className="growth__num meta" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {g.title}
              </span>
              <span role="cell" data-label="Aujourd’hui">
                {g.now}
              </span>
              <span role="cell" data-label="Ensuite">
                {g.next}
              </span>
            </div>
          ))}
        </div>
      </section>

      <aside className="ai-note" aria-labelledby="ai-title">
        <h2 id="ai-title" className="ai-note__title">
          {aiStatement.title}
        </h2>
        {aiStatement.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </aside>
    </section>
  );
}

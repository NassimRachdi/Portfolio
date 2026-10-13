import { useState } from 'react';
import { about } from '../content/about';
import { profile } from '../content/profile';
import { ChapterHeader, PageFrame } from '../components/PageFrame';
import { hrefFor } from '../navigation/router';

export function About() {
  const [focus, setFocus] = useState<number | null>(null);

  return (
    <PageFrame chapter="a-propos">
      <div className="spread about">
        <div className="spread__left">
          <ChapterHeader chapter="a-propos" kicker="Profil" />
          <p className="about__statement reveal" style={{ ['--d' as string]: 2 }}>
            <span className="about__quote" aria-hidden="true">
              «
            </span>
            {about.statement}
            <span className="about__quote" aria-hidden="true">
              »
            </span>
          </p>

          <section className="about__chain-wrap reveal" style={{ ['--d' as string]: 4 }} aria-labelledby="about-chain-title">
            <h2 id="about-chain-title" className="meta about__chain-title">
              Ce qui relie mon parcours
            </h2>
            <ol className="about__chain" data-focus={focus ?? undefined}>
              {about.links.map((l, i) => (
                <li
                  key={l.id}
                  className={focus !== null && i <= focus ? 'is-lit' : ''}
                  onMouseEnter={() => setFocus(i)}
                  onMouseLeave={() => setFocus(null)}
                >
                  <button
                    type="button"
                    className="about__chain-item"
                    aria-pressed={focus === i}
                    onFocus={() => setFocus(i)}
                    onBlur={() => setFocus(null)}
                    onClick={() => setFocus(focus === i ? null : i)}
                  >
                    <span className="about__chain-num meta">{String(i + 1).padStart(2, '0')}</span>
                    <span className="about__chain-title-item">{l.title}</span>
                  </button>
                  <p className="about__chain-text">{l.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="spread__right about__body">
          <p className="about__opening reveal" style={{ ['--d' as string]: 3 }}>
            Je m’appelle {profile.firstName} {profile.lastName}. Je suis en Bachelor informatique et cybersécurité, en alternance
            à la SNCF depuis 2023, après un BTS SIO option SISR obtenu en 2026.
          </p>
          {about.paragraphs.map((p, i) => (
            <p key={i} className="reveal" style={{ ['--d' as string]: 4 + i }}>
              {p}
            </p>
          ))}

          <aside className="about__honesty reveal" style={{ ['--d' as string]: 7 }}>
            <p className="meta">En toute franchise</p>
            <p>{about.honesty}</p>
          </aside>

          <section className="about__interests reveal" style={{ ['--d' as string]: 8 }} aria-labelledby="about-interests">
            <h2 id="about-interests" className="meta">
              Ce qui m’intéresse
            </h2>
            <ul>
              {about.interests.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>

          <a className="continue reveal" style={{ ['--d' as string]: 9 }} href={hrefFor('parcours')}>
            <span className="meta">Chapitre suivant</span>
            <span className="continue__title">Mon parcours</span>
            <span aria-hidden="true" className="continue__arrow">
              →
            </span>
          </a>
        </div>
      </div>
    </PageFrame>
  );
}

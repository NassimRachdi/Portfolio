import { useEffect, useRef } from 'react';
import { experiences } from '../content/experience';
import { journey } from '../content/journey';
import { projectById } from '../content/projects';
import { allSkills, skillFamilies, usageLabels, type Evidence, type SkillUsage } from '../content/skills';
import { ChapterHeader, PageFrame } from '../components/PageFrame';
import { hrefFor, navigate, setParam, type Route } from '../navigation/router';
import { isReducedMotion } from '../lib/motion';
import { scrollToInPage } from '../lib/scroll';

const usageOrder: SkillUsage[] = ['entreprise', 'formation', 'personnel', 'apprentissage', 'orientation', 'piste'];

function evidenceLink(e: Evidence) {
  if (e.type === 'project') {
    const p = projectById(e.id);
    return p ? { href: hrefFor('projets', p.id), kind: `Dossier ${p.letter}`, label: p.title } : null;
  }
  if (e.type === 'experience') {
    const x = experiences.find((x) => x.id === e.id);
    return x ? { href: hrefFor('experience', null, { focus: x.id }), kind: `Expérience · ${x.period}`, label: x.entity } : null;
  }
  const j = journey.find((j) => j.id === e.id);
  return j ? { href: hrefFor('parcours', null, { etape: j.id }), kind: `Formation · ${j.period}`, label: j.title } : null;
}

export function Skills({ route, active }: { route: Route; active: boolean }) {
  const requestedFamily = route.params.get('famille');
  const requestedSkill = route.params.get('competence');
  const skill = allSkills.find((s) => s.id === requestedSkill) ?? null;
  const family =
    skillFamilies.find((f) => f.id === (skill?.familyId ?? requestedFamily)) ?? skillFamilies[0];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const familyIndex = skillFamilies.indexOf(family);

  const selectFamily = (i: number, focus = false) => {
    const f = skillFamilies[(i + skillFamilies.length) % skillFamilies.length];
    navigate(hrefFor('competences', null, { famille: f.id }), { replace: true });
    if (focus) tabs.current[skillFamilies.indexOf(f)]?.focus();
  };

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const keys: Record<string, number> = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: skillFamilies.length - 1 };
    if (e.key in keys) {
      e.preventDefault();
      selectFamily(keys[e.key], true);
    }
  };

  // Arrivée depuis un dossier projet (#/competences?competence=…) : on montre la compétence.
  useEffect(() => {
    if (!active || !requestedSkill) return;
    const t = window.setTimeout(() => {
      const el = document.getElementById(`skill-${requestedSkill}`);
      if (el && window.matchMedia('(max-width: 1099px)').matches) scrollToInPage(el, 90);
    }, isReducedMotion() ? 0 : 400);
    return () => window.clearTimeout(t);
  }, [active]);

  const usageCounts = usageOrder
    .map((u) => ({ u, n: family.skills.filter((s) => s.usage.includes(u)).length }))
    .filter((x) => x.n > 0);

  return (
    <PageFrame chapter="competences">
      <ChapterHeader
        chapter="competences"
        kicker="Cinq familles"
        lead={
          <p>
            Pas de jauges ni de pourcentages : pour chaque compétence, j’indique comment je l’ai réellement pratiquée, et où
            la retrouver dans ce portfolio. Sélectionnez une compétence pour voir ce qui l’illustre.
          </p>
        }
      />

      <ul className="legend reveal" style={{ ['--d' as string]: 4 }} aria-label="Légende des niveaux d’usage">
        {usageOrder.map((u) => (
          <li key={u}>
            <span className={`usage-dot usage-dot--${u}`} aria-hidden="true" />
            {usageLabels[u]}
          </li>
        ))}
      </ul>

      <div className="skills">
        <div className="skills__tabs" role="tablist" aria-label="Familles de compétences" aria-orientation="vertical" data-swipe-ignore>
          {skillFamilies.map((f, i) => (
            <button
              key={f.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`tab-${f.id}`}
              aria-selected={f.id === family.id}
              aria-controls={`panel-${f.id}`}
              tabIndex={f.id === family.id ? 0 : -1}
              className="skills__tab"
              onClick={() => selectFamily(i)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              <span className="skills__tab-num">{f.number}</span>
              <span className="skills__tab-title">{f.title}</span>
              <span className="skills__tab-count meta">{f.skills.length}</span>
            </button>
          ))}
        </div>

        <div
          className="skills__panel"
          role="tabpanel"
          id={`panel-${family.id}`}
          aria-labelledby={`tab-${family.id}`}
          key={family.id}
        >
          <div className="skills__intro">
            <h2 className="skills__family-title">
              <span className="skills__family-num" aria-hidden="true">
                {family.number}
              </span>
              {family.title}
            </h2>
            <p>{family.intro}</p>
            <p className="skills__summary meta">
              {usageCounts.map(({ u, n }) => (
                <span key={u}>
                  <span className={`usage-dot usage-dot--${u}`} aria-hidden="true" /> {n} · {usageLabels[u].toLowerCase()}
                </span>
              ))}
            </p>
          </div>

          <ul className="skills__list">
            {family.skills.map((s) => {
              const selected = skill?.id === s.id;
              return (
                <li key={s.id} id={`skill-${s.id}`} className="skill" data-selected={selected || undefined}>
                  <button
                    type="button"
                    className="skill__btn"
                    aria-expanded={selected}
                    aria-controls={`skill-detail-${s.id}`}
                    onClick={() => setParam('competence', selected ? null : s.id)}
                  >
                    <span className="skill__name">{s.name}</span>
                    <span className="skill__usages">
                      {s.usage.map((u) => (
                        <span key={u} className={`usage usage--${u}`}>
                          <span className={`usage-dot usage-dot--${u}`} aria-hidden="true" />
                          {usageLabels[u]}
                        </span>
                      ))}
                    </span>
                    <span className="skill__toggle" aria-hidden="true">
                      {selected ? '−' : '+'}
                    </span>
                  </button>
                  <div id={`skill-detail-${s.id}`} className="skill__detail" hidden={!selected}>
                    {selected && (
                      <div className="skill__detail-inner">
                        <p className="skill__practice">{s.practice}</p>
                        <p className="meta">Où le retrouver</p>
                        <ul className="evidence">
                          {s.evidence.map((e, k) => {
                            const l = evidenceLink(e);
                            return (
                              l && (
                                <li key={k}>
                                  <a href={l.href}>
                                    <span className="meta">{l.kind}</span>
                                    <span className="evidence__label">{l.label}</span>
                                    <span aria-hidden="true" className="evidence__arrow">
                                      →
                                    </span>
                                  </a>
                                </li>
                              )
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {family.note && (
            <p className="skills__note">
              <span className="meta">Certifications</span> {family.note}
            </p>
          )}

          <div className="skills__pager">
            <button type="button" className="link-btn" onClick={() => selectFamily(familyIndex - 1)} disabled={familyIndex === 0}>
              ← Famille précédente
            </button>
            <button
              type="button"
              className="link-btn"
              onClick={() => selectFamily(familyIndex + 1)}
              disabled={familyIndex === skillFamilies.length - 1}
            >
              Famille suivante →
            </button>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

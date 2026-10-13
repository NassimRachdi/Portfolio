import { useRef } from 'react';
import { profile } from '../content/profile';
import { hrefFor } from '../navigation/router';
import { isReducedMotion } from '../lib/motion';

/** Composition abstraite de couverture : lignes convergentes (réseaux, voies), nœuds, monogramme. */
function CoverArt() {
  const rails = [
    'M -20 640 C 120 470, 250 330, 430 70',
    'M 40 660 C 170 490, 290 350, 440 80',
    'M 120 680 C 230 520, 330 370, 450 90',
    'M 220 690 C 300 540, 370 390, 460 100',
    'M -40 520 C 120 400, 280 260, 425 62',
  ];
  return (
    <svg className="cover-art" viewBox="0 0 480 600" role="img" aria-label="Composition graphique abstraite : lignes convergentes et monogramme NR">
      <defs>
        <clipPath id="cover-clip">
          <rect x="1" y="1" width="478" height="598" />
        </clipPath>
      </defs>
      <g clipPath="url(#cover-clip)">
        <g className="cover-art__layer" style={{ ['--depth' as string]: 0.4 }}>
          {Array.from({ length: 25 }, (_, i) => (
            <line key={i} x1="0" x2="480" y1={24 * i + 12} y2={24 * i + 12} className="cover-art__rule" />
          ))}
        </g>
        <g className="cover-art__layer" style={{ ['--depth' as string]: 1 }}>
          {rails.map((d, i) => (
            <path key={i} d={d} pathLength={1} className={`cover-art__rail ${i === 2 ? 'is-accent' : ''}`} style={{ ['--i' as string]: i }} />
          ))}
          {[
            [126, 520],
            [230, 368],
            [330, 225],
            [406, 132],
          ].map(([cx, cy], i) => (
            <g key={i} className="cover-art__node" style={{ ['--i' as string]: i }}>
              <circle cx={cx} cy={cy} r="9" className="cover-art__halo" />
              <circle cx={cx} cy={cy} r="3.5" />
            </g>
          ))}
        </g>
        <g className="cover-art__layer" style={{ ['--depth' as string]: 1.8 }}>
          <text x="28" y="560" className="cover-art__mono">
            {profile.monogram}
          </text>
        </g>
      </g>
      <rect x="0.5" y="0.5" width="479" height="599" className="cover-art__frame" />
      <text x="452" y="40" className="cover-art__spine" transform="rotate(90 452 40)">
        Systèmes · Réseaux · Sécurité · Automatisation
      </text>
    </svg>
  );
}

export function Cover() {
  const art = useRef<HTMLDivElement>(null);

  // Profondeur légère : la composition suit discrètement le pointeur (désactivé si animations réduites).
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || isReducedMotion() || !art.current) return;
    const r = art.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    art.current.style.setProperty('--px', x.toFixed(3));
    art.current.style.setProperty('--py', y.toFixed(3));
  };

  return (
    <div className="cover" onPointerMove={onPointerMove}>
      <div className="cover__text">
        <p className="meta cover__eyebrow">
          <span>Portfolio</span>
          <span aria-hidden="true">—</span>
          <span>Volume 2026</span>
        </p>
        <h1 className="cover__name" data-chapter-heading tabIndex={-1}>
          <span className="cover__first">{profile.firstName}</span>{' '}
          <span className="cover__last">{profile.lastName}</span>
        </h1>
        <p className="cover__positioning">{profile.positioning}</p>
        <p className="cover__tagline">{profile.tagline}</p>
        <p className="cover__intro">{profile.intro}</p>

        <div className="cover__actions">
          <a className="btn btn--primary" href={hrefFor('parcours')}>
            Découvrir mon parcours
            <span aria-hidden="true" className="btn__arrow">
              →
            </span>
          </a>
          <a className="btn" href={hrefFor('projets')}>
            Voir mes projets
          </a>
          <a className="btn btn--quiet" href={hrefFor('contact')}>
            Me contacter
          </a>
        </div>

        <dl className="cover__facts">
          {profile.keyFacts.map((f) => (
            <div key={f.label}>
              <dt className="meta">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="cover__art" ref={art}>
        {profile.photo ? (
          <img className="cover__photo" src={profile.photo.src} alt={profile.photo.alt} />
        ) : (
          <CoverArt />
        )}
      </div>
    </div>
  );
}

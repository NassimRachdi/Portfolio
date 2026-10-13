/**
 * Illustrations conceptuelles des projets.
 * Ce sont des schémas abstraits : ils ne reproduisent aucune interface réelle
 * et toute donnée affichée est fictive (signalée par la légende du dossier).
 */
import type { ProjectVisualKind } from '../content/projects';

function Evolution() {
  return (
    <>
      {/* Tableur */}
      <g className="pv-draw">
        <rect x="20" y="40" width="130" height="150" rx="3" />
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <line key={`r${r}`} x1="20" x2="150" y1={62 + r * 21} y2={62 + r * 21} className="pv-thin" />
        ))}
        {[0, 1, 2].map((c) => (
          <line key={`c${c}`} y1="40" y2="190" x1={52 + c * 33} x2={52 + c * 33} className="pv-thin" />
        ))}
        <rect x="53" y="84" width="32" height="20" className="pv-fill-soft" />
        <rect x="86" y="126" width="32" height="20" className="pv-fill-soft" />
      </g>
      <text x="20" y="214" className="pv-label">EXCEL / VBA</text>

      {/* Flèche d'évolution */}
      <g className="pv-draw pv-accent-stroke">
        <path d="M 165 115 C 190 115, 200 115, 228 115" />
        <path d="M 220 108 L 229 115 L 220 122" />
      </g>

      {/* Application */}
      <g className="pv-draw">
        <rect x="245" y="40" width="140" height="110" rx="5" />
        <line x1="245" x2="385" y1="56" y2="56" />
        <circle cx="255" cy="48" r="2.5" className="pv-dot" />
        <circle cx="264" cy="48" r="2.5" className="pv-dot" />
        <rect x="253" y="66" width="34" height="76" rx="2" className="pv-fill-soft" />
        <rect x="296" y="68" width="80" height="9" rx="2" />
        <rect x="296" y="84" width="80" height="9" rx="2" />
        <rect x="296" y="100" width="54" height="9" rx="2" />
        <rect x="338" y="126" width="38" height="14" rx="3" className="pv-accent-fill" />
      </g>
      <text x="245" y="168" className="pv-label">APPLICATION WINDOWS</text>

      {/* Mode opératoire */}
      <g className="pv-draw">
        <path d="M 300 182 h 38 l 10 10 v 46 h -48 z" />
        <line x1="308" x2="338" y1="203" y2="203" className="pv-thin" />
        <line x1="308" x2="338" y1="212" y2="212" className="pv-thin" />
        <line x1="308" x2="328" y1="221" y2="221" className="pv-thin" />
      </g>
      <text x="356" y="214" className="pv-label">DOC.</text>
      <path d="M 315 152 L 315 178" className="pv-draw pv-thin pv-dashed" />
    </>
  );
}

function Diff() {
  const row = (y: number, cells: ('same' | 'add' | 'del' | 'none')[]) =>
    cells.map((c, i) =>
      c === 'none' ? null : (
        <rect
          key={`${y}-${i}`}
          x={70 + i * 44}
          y={y}
          width="38"
          height="26"
          rx="4"
          className={`pv-draw pv-car pv-car--${c}`}
          style={{ ['--i' as string]: i }}
        />
      ),
    );
  return (
    <>
      <text x="20" y="66" className="pv-label">SIT. 1</text>
      <line x1="66" x2="390" y1="86" y2="86" className="pv-thin" />
      {row(50, ['same', 'same', 'del', 'same', 'same', 'none', 'none'])}
      <text x="177" y="68" textAnchor="middle" className="pv-label pv-label--on pv-minus">−</text>

      <text x="20" y="146" className="pv-label">SIT. 2</text>
      <line x1="66" x2="390" y1="166" y2="166" className="pv-thin" />
      {row(130, ['same', 'same', 'none', 'same', 'same', 'add', 'none'])}
      <text x="309" y="148" textAnchor="middle" className="pv-label pv-label--on pv-plus">+</text>

      <g className="pv-draw pv-thin pv-dashed">
        <line x1="177" x2="177" y1="80" y2="128" />
        <line x1="309" x2="309" y1="80" y2="128" />
      </g>

      <g transform="translate(70 206)">
        <rect width="14" height="10" rx="2" className="pv-car pv-car--del" />
        <text x="22" y="9" className="pv-label">RETRAIT</text>
        <rect x="100" width="14" height="10" rx="2" className="pv-car pv-car--add" />
        <text x="122" y="9" className="pv-label">AJOUT</text>
        <rect x="190" width="14" height="10" rx="2" className="pv-car pv-car--same" />
        <text x="212" y="9" className="pv-label">INCHANGÉ</text>
      </g>
    </>
  );
}

function Pipeline() {
  return (
    <>
      {/* Sources hétérogènes */}
      <g className="pv-draw">
        <circle cx="40" cy="50" r="13" />
        <rect x="27" y="92" width="26" height="26" rx="2" />
        <path d="M 40 146 L 54 172 L 26 172 Z" />
        <path d="M 28 196 h 18 l 8 8 v 22 h -26 z" />
      </g>
      <text x="16" y="250" className="pv-label">SOURCES</text>

      <g className="pv-draw pv-thin">
        <path d="M 56 50 C 100 50, 110 128, 150 128" />
        <path d="M 56 105 C 100 105, 110 128, 150 128" />
        <path d="M 58 162 C 100 162, 110 128, 150 128" />
        <path d="M 56 212 C 100 212, 110 128, 150 128" />
      </g>

      {/* Logique commune */}
      <g className="pv-draw pv-accent-stroke">
        <rect x="150" y="104" width="62" height="48" rx="6" />
        <line x1="160" x2="202" y1="120" y2="120" />
        <line x1="160" x2="202" y1="130" y2="130" />
        <line x1="160" x2="190" y1="140" y2="140" />
      </g>
      <text x="146" y="174" className="pv-label">LOGIQUE</text>
      <text x="146" y="186" className="pv-label">COMMUNE</text>

      <g className="pv-draw">
        <line x1="212" x2="244" y1="128" y2="128" className="pv-thin" />
        <circle cx="258" cy="128" r="14" />
        <path d="M 251 128 l 5 5 l 9 -10" />
        <line x1="272" x2="300" y1="128" y2="128" className="pv-thin" />
        <rect x="300" y="108" width="40" height="40" rx="3" />
        <rect x="308" y="130" width="6" height="12" className="pv-fill-soft" />
        <rect x="317" y="122" width="6" height="20" className="pv-fill-soft" />
        <rect x="326" y="116" width="6" height="26" className="pv-accent-fill" />
        <line x1="340" x2="360" y1="128" y2="128" className="pv-thin" />
        <path d="M 362 112 h 22 v 32 h -22 z" />
      </g>
      <text x="236" y="166" className="pv-label">CONTRÔLE</text>
      <text x="300" y="166" className="pv-label">ANALYSE</text>
      <text x="352" y="194" className="pv-label">RESTIT.</text>
    </>
  );
}

function Structure() {
  const folders = [70, 200, 330];
  return (
    <>
      <g className="pv-draw">
        <rect x="160" y="22" width="80" height="34" rx="5" />
        <path d="M 200 56 V 80 M 70 80 H 330 M 70 80 V 96 M 200 80 V 96 M 330 80 V 96" className="pv-thin" />
        {folders.map((x) => (
          <path key={x} d={`M ${x - 32} 98 h 22 l 6 6 h 36 v 34 h -64 z`} />
        ))}
      </g>
      <text x="174" y="44" className="pv-label pv-label--on">ESPACE</text>

      {folders.map((x, i) => (
        <g key={x} className="pv-draw" style={{ ['--i' as string]: i }}>
          <path d={`M ${x} 140 V 162`} className="pv-thin" />
          <rect x={x - 22} y="164" width="44" height="54" rx="2" />
          <line x1={x - 14} x2={x + 14} y1="178" y2="178" className="pv-thin" />
          <line x1={x - 14} x2={x + 8} y1="188" y2="188" className="pv-thin" />
          <rect x={x - 14} y="200" width="24" height="11" rx="5" className={i === 1 ? 'pv-accent-fill' : 'pv-fill-soft'} />
        </g>
      ))}
      {['v1', 'v3', 'v2'].map((v, i) => (
        <text key={v} x={folders[i] - 10} y="209" className="pv-label pv-label--tiny">
          {v}
        </text>
      ))}

      {/* Accès */}
      <g className="pv-draw pv-accent-stroke">
        <rect x="350" y="28" width="22" height="18" rx="3" />
        <path d="M 355 28 v -6 a 6 6 0 0 1 12 0 v 6" />
      </g>
      <text x="340" y="64" className="pv-label">ACCÈS</text>
      <text x="152" y="242" className="pv-label">VERSIONS</text>
    </>
  );
}

function Interface() {
  const nav = ['Clients', 'Devis', 'Factures', 'Paiements', 'Relances'];
  return (
    <>
      <g className="pv-draw">
        <rect x="14" y="14" width="372" height="232" rx="8" />
        <line x1="104" x2="104" y1="14" y2="246" className="pv-thin" />
      </g>
      {nav.map((n, i) => (
        <g key={n}>
          {i === 2 && <rect x="22" y={44 + i * 26} width="74" height="20" rx="4" className="pv-accent-fill pv-accent-fill--soft" />}
          <text x="30" y={58 + i * 26} className={`pv-ui ${i === 2 ? 'pv-ui--active' : ''}`}>
            {n}
          </text>
        </g>
      ))}

      <text x="120" y="44" className="pv-ui pv-ui--title">Facture F-0000</text>
      <text x="120" y="62" className="pv-ui pv-ui--muted">Client exemple · données fictives</text>
      <g className="pv-draw">
        <rect x="290" y="30" width="80" height="22" rx="11" className="pv-accent-stroke" />
      </g>
      <text x="304" y="45" className="pv-ui pv-ui--accent">Brouillon</text>

      <g className="pv-draw pv-thin">
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <line x1="120" x2="370" y1={88 + r * 30} y2={88 + r * 30} />
            <rect x="120" y={96 + r * 30} width={120 - r * 24} height="9" rx="2" className="pv-fill-soft" />
            <rect x="320" y={96 + r * 30} width="50" height="9" rx="2" className="pv-fill-soft" />
          </g>
        ))}
        <line x1="120" x2="370" y1="178" y2="178" />
      </g>
      <text x="120" y="200" className="pv-ui pv-ui--muted">Total</text>
      <rect x="300" y="190" width="70" height="12" rx="2" className="pv-fill-soft" />
      <g className="pv-draw">
        <rect x="120" y="214" width="96" height="22" rx="4" className="pv-accent-fill" />
      </g>
      <text x="132" y="229" className="pv-ui pv-ui--inverse">Envoyer</text>
    </>
  );
}

const visuals: Record<ProjectVisualKind, () => React.JSX.Element> = {
  evolution: Evolution,
  diff: Diff,
  pipeline: Pipeline,
  structure: Structure,
  interface: Interface,
};

export function ProjectVisual({ kind, compact = false, label }: { kind: ProjectVisualKind; compact?: boolean; label?: string }) {
  const Visual = visuals[kind];
  return (
    <svg
      className={`pv ${compact ? 'pv--compact' : ''}`}
      viewBox="0 0 400 260"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <Visual />
    </svg>
  );
}

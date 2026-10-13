import { profile } from '../content/profile';

/** Monogramme « NR » — utilisé dans le sommaire, l'en-tête mobile et le favicon. */
export function Monogram({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`monogram ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <circle cx="20" cy="20" r="19.25" fill="none" stroke="currentColor" strokeOpacity=".35" strokeWidth="1" />
        <text x="20" y="25.5" textAnchor="middle" className="monogram__text">
          {profile.monogram}
        </text>
        <circle cx="33.4" cy="9.6" r="2" className="monogram__dot" />
      </svg>
    </span>
  );
}

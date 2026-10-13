/**
 * IDENTITÉ & COORDONNÉES
 * ----------------------
 * C'est ici que tu renseignes tes informations publiques.
 *
 * Règle d'affichage : un lien laissé à `null` n'est jamais affiché.
 * Aucun bouton vide ou trompeur n'apparaît tant que la valeur n'est pas renseignée.
 *
 * Exemples (à adapter) :
 *   email: 'prenom.nom@exemple.fr',
 *   linkedin: 'https://www.linkedin.com/in/ton-profil/',
 *   github: 'https://github.com/ton-compte',
 *   cv: { href: 'cv/CV-Nassim-Rachdi.pdf', label: 'CV — PDF' }  // fichier placé dans /public/cv/
 *   photo: { src: 'images/portrait.jpg', alt: 'Portrait de Nassim Rachdi' } // fichier placé dans /public/images/
 */

export interface ContactConfig {
  email: string | null;
  linkedin: string | null;
  github: string | null;
  cv: { href: string; label: string } | null;
}

export interface Profile {
  firstName: string;
  lastName: string;
  monogram: string;
  /** Ligne de positionnement sous le nom, sur la couverture. */
  positioning: string;
  /** Phrase d'accroche de la couverture. */
  tagline: string;
  /** Courte présentation visible immédiatement sur la couverture. */
  intro: string;
  /** Repères « en bref » pour une lecture rapide (recruteurs). */
  keyFacts: { label: string; value: string }[];
  /** Photo réelle (facultative). Sans photo, le monogramme est utilisé. */
  photo: { src: string; alt: string } | null;
  contact: ContactConfig;
}

export const profile: Profile = {
  firstName: 'Nassim',
  lastName: 'Rachdi',
  monogram: 'NR',
  positioning: 'Systèmes, réseaux, cybersécurité & automatisation',
  tagline:
    'Je pars de besoins concrets pour construire des outils numériques utiles, compréhensibles et fiables.',
  intro:
    'En alternance à la SNCF depuis 2023, je prépare un Bachelor informatique et cybersécurité après un BTS SIO option SISR obtenu en 2026. J’avance entre infrastructure, sécurité et outils métier — en apprenant sur le terrain et en construisant mes propres projets.',
  keyFacts: [
    { label: 'Formation', value: 'Bachelor informatique & cybersécurité — en cours' },
    { label: 'Alternance', value: 'SNCF, depuis 2023' },
    { label: 'Diplôme', value: 'BTS SIO option SISR — 2026' },
  ],
  photo: null,
  contact: {
    email: null,
    linkedin: null,
    github: null,
    cv: null,
  },
};

export const fullName = `${profile.firstName} ${profile.lastName}`;

export const hasAnyContact = (c: ContactConfig = profile.contact) =>
  Boolean(c.email || c.linkedin || c.github || c.cv);

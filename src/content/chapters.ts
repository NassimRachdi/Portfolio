/**
 * SECTIONS DU PORTFOLIO
 * ---------------------
 * L'ordre de ce tableau définit l'ordre des chapitres, la barre de navigation,
 * les liens Précédent / Suivant et le segment d'URL (#/parcours, #/projets…).
 */

export type ChapterId = 'accueil' | 'parcours' | 'projets' | 'competences' | 'contact';

export interface Chapter {
  id: ChapterId;
  /** Segment d'URL : #/<slug>. L'accueil utilise une chaîne vide. */
  slug: string;
  /** Titre affiché en tête de page. */
  title: string;
  /** Libellé court de la barre de navigation. */
  short: string;
  /** Ce que contient la section (une ligne). */
  summary: string;
}

export const chapters: Chapter[] = [
  { id: 'accueil', slug: '', title: 'Accueil', short: 'Accueil', summary: 'Qui je suis, ma manière de travailler' },
  { id: 'parcours', slug: 'parcours', title: 'Parcours', short: 'Parcours', summary: 'Formation et alternance à la SNCF' },
  { id: 'projets', slug: 'projets', title: 'Projets', short: 'Projets', summary: 'Cinq dossiers à ouvrir' },
  {
    id: 'competences',
    slug: 'competences',
    title: 'Compétences',
    short: 'Compétences',
    summary: 'Ce que je sais faire, et ma méthode',
  },
  { id: 'contact', slug: 'contact', title: 'Contact', short: 'Contact', summary: 'Me joindre' },
];

export const chapterIndex = (id: ChapterId) => chapters.findIndex((c) => c.id === id);
export const chapterById = (id: ChapterId) => chapters[chapterIndex(id)];
export const chapterBySlug = (slug: string) => chapters.find((c) => c.slug === slug);

/** Numéro à deux chiffres : 3 → « 03 ». */
export const pad = (n: number) => String(n).padStart(2, '0');

/**
 * SOMMAIRE DU LIVRE
 * -----------------
 * L'ordre de ce tableau définit l'ordre des chapitres, la pagination « Chapitre 03 / 08 »,
 * les commandes Précédent / Suivant et le segment d'URL (#/parcours, #/projets…).
 *
 * `surface` choisit le fond de la page : 'night' (sombre) ou 'paper' (clair, éditorial).
 */

export type ChapterId =
  | 'couverture'
  | 'a-propos'
  | 'parcours'
  | 'experience'
  | 'projets'
  | 'competences'
  | 'methode'
  | 'contact';

export interface Chapter {
  id: ChapterId;
  /** Segment d'URL : #/<slug>. La couverture utilise une chaîne vide. */
  slug: string;
  title: string;
  /** Titre court pour le sommaire compact. */
  short: string;
  /** Une ligne de description affichée dans le sommaire. */
  summary: string;
  surface: 'night' | 'paper';
}

export const chapters: Chapter[] = [
  {
    id: 'couverture',
    slug: '',
    title: 'Couverture',
    short: 'Couverture',
    summary: 'Qui je suis, en une page',
    surface: 'night',
  },
  {
    id: 'a-propos',
    slug: 'a-propos',
    title: 'À propos',
    short: 'À propos',
    summary: 'Ma manière d’aborder les problèmes',
    surface: 'paper',
  },
  {
    id: 'parcours',
    slug: 'parcours',
    title: 'Parcours',
    short: 'Parcours',
    summary: 'Du bac STI2D au Bachelor',
    surface: 'night',
  },
  {
    id: 'experience',
    slug: 'experience',
    title: 'Expérience professionnelle',
    short: 'Expérience',
    summary: 'L’alternance à la SNCF',
    surface: 'paper',
  },
  {
    id: 'projets',
    slug: 'projets',
    title: 'Projets',
    short: 'Projets',
    summary: 'Cinq dossiers à ouvrir',
    surface: 'night',
  },
  {
    id: 'competences',
    slug: 'competences',
    title: 'Compétences',
    short: 'Compétences',
    summary: 'Ce que je sais faire, et où',
    surface: 'night',
  },
  {
    id: 'methode',
    slug: 'methode',
    title: 'Ma méthode & ce que je construis',
    short: 'Méthode',
    summary: 'Comment je travaille, où je vais',
    surface: 'paper',
  },
  {
    id: 'contact',
    slug: 'contact',
    title: 'Contact',
    short: 'Contact',
    summary: 'La dernière page',
    surface: 'night',
  },
];

export const chapterIndex = (id: ChapterId) => chapters.findIndex((c) => c.id === id);
export const chapterById = (id: ChapterId) => chapters[chapterIndex(id)];
export const chapterBySlug = (slug: string) => chapters.find((c) => c.slug === slug);

/** Numéro à deux chiffres : 3 → « 03 ». */
export const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Routeur minimal basé sur le hash de l'URL.
 *
 *   #/                       → accueil
 *   #/parcours               → chapitre
 *   #/parcours?etape=bts-sio → chapitre + paramètres (état de consultation)
 *   #/projets/easygov        → dossier projet (sous-page du chapitre Projets)
 *
 * Le hash fonctionne sur n'importe quel hébergement statique, sans configuration serveur.
 * Les boutons Précédent / Suivant du navigateur restent cohérents (pushState + popstate).
 */
import { useSyncExternalStore } from 'react';
import { chapterBySlug, chapters, type ChapterId } from '../content/chapters';

export interface Route {
  chapter: ChapterId;
  /** Sous-page éventuelle (ex. identifiant de projet). */
  sub: string | null;
  params: URLSearchParams;
  /** Chaîne normalisée, utile comme clé. */
  path: string;
}

/** Anciennes adresses (version en huit chapitres) redirigées vers la section qui les contient. */
const aliases: Record<string, string> = { 'a-propos': '', experience: 'parcours', methode: 'competences' };

function parse(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '');
  const [pathPart, query = ''] = raw.split('?');
  const [slug = '', sub = null] = pathPart.split('/').filter(Boolean) as [string?, string?];
  const chapter = chapterBySlug(aliases[slug ?? ''] ?? slug ?? '') ?? chapters[0];
  const params = new URLSearchParams(query);
  return {
    chapter: chapter.id,
    sub: chapter.slug === (aliases[slug ?? ''] ?? slug ?? '') ? (sub ?? null) : null,
    params,
    path: '/' + [chapter.slug, chapter.slug === slug ? sub : null].filter(Boolean).join('/'),
  };
}

export function hrefFor(chapter: ChapterId, sub?: string | null, params?: Record<string, string | null | undefined>) {
  const slug = chapters.find((c) => c.id === chapter)?.slug ?? '';
  const path = '/' + [slug, sub].filter(Boolean).join('/');
  const qs = new URLSearchParams();
  if (params) for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
  const q = qs.toString();
  return `#${path}${q ? `?${q}` : ''}`;
}

/*
 * Certains environnements (aperçu intégré, iframe isolée) refusent de modifier l'URL :
 * la route est alors conservée en mémoire, et la navigation fonctionne quand même.
 */
let memoryHash: string | null = null;
const readHash = () => memoryHash ?? window.location.hash;

let current = parse(readHash());
const listeners = new Set<() => void>();
let navigations = 0;

/** Vrai dès que le visiteur a navigué au moins une fois (sert à ne pas voler le focus au chargement). */
export const hasNavigated = () => navigations > 0;

function emit() {
  const next = parse(readHash());
  // On ne recrée la route que si l'URL a réellement changé.
  if (next.path === current.path && next.params.toString() === current.params.toString()) return;
  navigations++;
  current = next;
  listeners.forEach((l) => l());
}

const onHistory = () => {
  memoryHash = null;
  emit();
};
window.addEventListener('popstate', onHistory);
window.addEventListener('hashchange', onHistory);

export function navigate(href: string, opts: { replace?: boolean; state?: Record<string, unknown> } = {}) {
  const url = href.startsWith('#') ? href : `#${href}`;
  if (url === readHash() && !opts.replace) return;
  try {
    if (opts.replace) window.history.replaceState(opts.state ?? null, '', url);
    else window.history.pushState(opts.state ?? null, '', url);
    memoryHash = decodeURI(window.location.hash) === decodeURI(url) ? null : url;
  } catch {
    memoryHash = url;
  }
  emit();
}

/* Les liens internes (#/…) passent par le routeur : clic simple uniquement,
   les ouvertures dans un nouvel onglet gardent le comportement natif. */
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.('a[href^="#/"]');
  if (!a || a.getAttribute('target')) return;
  e.preventDefault();
  navigate(a.getAttribute('href')!);
});

/** Met à jour un paramètre de l'URL sans créer d'entrée d'historique. */
export function setParam(key: string, value: string | null) {
  const r = current;
  const params: Record<string, string> = {};
  r.params.forEach((v, k) => (params[k] = v));
  if (value) params[key] = value;
  else delete params[key];
  navigate(hrefFor(r.chapter, r.sub, params), { replace: true, state: window.history.state });
}

export const getRoute = () => current;

export function useRoute(): Route {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}

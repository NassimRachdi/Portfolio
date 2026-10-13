/**
 * Routeur minimal basé sur le hash de l'URL.
 *
 *   #/                       → couverture
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

function parse(hash: string): Route {
  const raw = hash.replace(/^#\/?/, '');
  const [pathPart, query = ''] = raw.split('?');
  const [slug = '', sub = null] = pathPart.split('/').filter(Boolean) as [string?, string?];
  const chapter = chapterBySlug(slug ?? '') ?? chapters[0];
  const params = new URLSearchParams(query);
  return {
    chapter: chapter.id,
    sub: chapter.slug === (slug ?? '') ? (sub ?? null) : null,
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

let current = parse(window.location.hash);
const listeners = new Set<() => void>();
let navigations = 0;

/** Vrai dès que le visiteur a navigué au moins une fois (sert à ne pas voler le focus au chargement). */
export const hasNavigated = () => navigations > 0;

function emit() {
  const next = parse(window.location.hash);
  // On ne recrée la route que si l'URL a réellement changé.
  if (next.path === current.path && next.params.toString() === current.params.toString()) return;
  navigations++;
  current = next;
  listeners.forEach((l) => l());
}

window.addEventListener('popstate', emit);
window.addEventListener('hashchange', emit);

export function navigate(href: string, opts: { replace?: boolean; state?: Record<string, unknown> } = {}) {
  if (href === window.location.hash && !opts.replace) return;
  const url = href.startsWith('#') ? href : `#${href}`;
  if (opts.replace) window.history.replaceState(opts.state ?? null, '', url);
  else window.history.pushState(opts.state ?? null, '', url);
  emit();
}

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

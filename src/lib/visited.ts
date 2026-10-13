/** Chapitres déjà ouverts pendant la visite (mémorisés pour la session). */
import { useSyncExternalStore } from 'react';
import type { ChapterId } from '../content/chapters';

const KEY = 'nr-portfolio:visited';
const listeners = new Set<() => void>();

function read(): ChapterId[] {
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

let visited: ChapterId[] = read();

export function markVisited(id: ChapterId) {
  if (visited.includes(id)) return;
  visited = [...visited, id];
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(visited));
  } catch {
    /* sans stockage, l'information reste en mémoire */
  }
  listeners.forEach((l) => l());
}

export function useVisited() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => visited,
  );
}

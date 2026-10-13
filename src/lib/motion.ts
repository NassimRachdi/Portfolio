/**
 * Préférence d'animation.
 * Par défaut : la préférence système (prefers-reduced-motion).
 * Le visiteur peut la remplacer depuis le sommaire ; son choix est mémorisé localement.
 * L'état effectif est exposé sur <html data-motion="full|reduced"> pour le CSS.
 */
import { useSyncExternalStore } from 'react';

type Override = 'full' | 'reduced' | null;
const KEY = 'nr-portfolio:motion';
const media = window.matchMedia('(prefers-reduced-motion: reduce)');
const listeners = new Set<() => void>();

function readOverride(): Override {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'full' || v === 'reduced' ? v : null;
  } catch {
    return null;
  }
}

let override: Override = readOverride();

export const isReducedMotion = () => (override ? override === 'reduced' : media.matches);

function apply() {
  document.documentElement.dataset.motion = isReducedMotion() ? 'reduced' : 'full';
  listeners.forEach((l) => l());
}

media.addEventListener('change', apply);
apply();

export function setReducedMotion(reduced: boolean) {
  const systemReduced = media.matches;
  // Si le choix correspond à la préférence système, on retire simplement la surcharge.
  override = reduced === systemReduced ? null : reduced ? 'reduced' : 'full';
  try {
    if (override) window.localStorage.setItem(KEY, override);
    else window.localStorage.removeItem(KEY);
  } catch {
    /* stockage indisponible : le choix vaut pour la session en cours */
  }
  apply();
}

export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    isReducedMotion,
  );
}

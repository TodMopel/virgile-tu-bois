import { useState, useSyncExternalStore } from "react";
import { siteConfigDefaults } from "../data/siteConfig.defaults";
import { DEFAULT_CREDITS_TEXT } from "./credits";
import type { HomeVisualOverride, SiteConfigOverrides, TrackVisualOverride } from "./types";

// Store minimal (pas de contexte React) pour que la boucle rAF de PlaybackContext
// (voir intensité d'animation) puisse lire la config sans re-render, comme le reste de
// l'app évite déjà les re-renders à 60fps (voir CONTEXT.md, correction perf 2026-08-10).
// Persisté en localStorage : c'est un réglage de prévisualisation par appareil, pas une
// base de données — la façon de le rendre permanent pour tout le monde est d'exporter et
// coller dans data/siteConfig.defaults.ts (voir EditPanel.tsx).

const STORAGE_KEY = "vtb-site-config-v1";

function load(): SiteConfigOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tracks: {} };
    const parsed = JSON.parse(raw);
    return { tracks: parsed.tracks ?? {}, home: parsed.home, creditsText: parsed.creditsText };
  } catch {
    return { tracks: {} };
  }
}

let state: SiteConfigOverrides = load();
const listeners = new Set<() => void>();

function emit() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // stockage indisponible (navigation privée, quota) — la session courante continue
    // de fonctionner en mémoire, seule la persistance entre visites est perdue.
  }
  listeners.forEach((l) => l());
}

export function getLocalOverrides(): SiteConfigOverrides {
  return state;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLocalOverrides(): SiteConfigOverrides {
  return useSyncExternalStore(subscribe, getLocalOverrides);
}

export function setTrackOverride(id: string, patch: Partial<TrackVisualOverride>) {
  state = { ...state, tracks: { ...state.tracks, [id]: { ...state.tracks[id], ...patch } } };
  emit();
}

// Fusionne dans `custom` plutôt que le remplacer entièrement — utile si une version
// gagne un jour plus d'un réglage spécifique (voir trackFields.ts).
export function setTrackCustomField(id: string, key: string, value: number) {
  const current = state.tracks[id] ?? {};
  state = { ...state, tracks: { ...state.tracks, [id]: { ...current, custom: { ...current.custom, [key]: value } } } };
  emit();
}

export function resetTrackOverride(id: string) {
  const { [id]: _removed, ...rest } = state.tracks;
  state = { ...state, tracks: rest };
  emit();
}

export function setHomeOverride(patch: Partial<HomeVisualOverride>) {
  state = { ...state, home: { ...state.home, ...patch } };
  emit();
}

export function resetHomeOverride() {
  state = { ...state, home: undefined };
  emit();
}

export function setCreditsTextOverride(text: string) {
  state = { ...state, creditsText: text };
  emit();
}

export function resetAllOverrides() {
  state = { tracks: {} };
  emit();
}

// Fusion : hardcodé dans le composant (fallback ultime) < committé dans
// data/siteConfig.defaults.ts < en cours d'édition dans ce navigateur (localStorage).
export function getEffectiveTrackOverride(id: string): TrackVisualOverride {
  const committed = siteConfigDefaults.tracks[id] ?? {};
  const local = state.tracks[id] ?? {};
  return { ...committed, ...local, custom: { ...committed.custom, ...local.custom } };
}

export function useEffectiveTrackOverride(id: string): TrackVisualOverride {
  const local = useLocalOverrides();
  const committed = siteConfigDefaults.tracks[id] ?? {};
  const localTrack = local.tracks[id];
  return { ...committed, ...localTrack, custom: { ...committed.custom, ...localTrack?.custom } };
}

export function getEffectiveHomeOverride(): HomeVisualOverride {
  return { ...siteConfigDefaults.home, ...state.home };
}

export function useEffectiveHomeOverride(): HomeVisualOverride {
  const local = useLocalOverrides();
  return { ...siteConfigDefaults.home, ...local.home };
}

export function getEffectiveCreditsText(): string {
  return state.creditsText ?? siteConfigDefaults.creditsText ?? DEFAULT_CREDITS_TEXT;
}

export function useEffectiveCreditsText(): string {
  const local = useLocalOverrides();
  return local.creditsText ?? siteConfigDefaults.creditsText ?? DEFAULT_CREDITS_TEXT;
}

// Fusionne le committé et le local édité en cours, puis sérialise tel quel — à coller
// dans data/siteConfig.defaults.ts (remplace le corps de l'objet exporté) pour rendre
// les réglages permanents. Ne garde que les champs réellement définis.
export function exportConfigText(): string {
  const merged: SiteConfigOverrides = { tracks: {} };
  const ids = new Set([...Object.keys(siteConfigDefaults.tracks), ...Object.keys(state.tracks)]);
  for (const id of ids) {
    // `custom` est toujours présent (même vide) sur le retour de getEffectiveTrackOverride
    // — on ne le garde dans l'export que s'il contient vraiment une clé.
    const { custom, ...rest } = getEffectiveTrackOverride(id);
    const cleanCustom = custom && Object.keys(custom).length > 0 ? custom : undefined;
    if (Object.keys(rest).length > 0 || cleanCustom) {
      merged.tracks[id] = cleanCustom ? { ...rest, custom: cleanCustom } : rest;
    }
  }
  const home = getEffectiveHomeOverride();
  if (Object.keys(home).length > 0) merged.home = home;
  const credits = getEffectiveCreditsText();
  if (credits !== DEFAULT_CREDITS_TEXT) merged.creditsText = credits;
  return JSON.stringify(merged, null, 2);
}

export function useEditMode(): boolean {
  const [editMode] = useState(() => new URLSearchParams(window.location.search).has("edit"));
  return editMode;
}

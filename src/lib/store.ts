import { useSyncExternalStore } from "react";
import type { Interest } from "./diagnostic";

type State = { interest: Interest; showPlanned: boolean; isPreview: boolean };
let state: State = { interest: null, showPlanned: false, isPreview: false };
const subs = new Set<() => void>();

export const store = {
  get: () => state,
  set(p: Partial<State>) {
    state = { ...state, ...p };
    subs.forEach((f) => f());
  },
  sub(f: () => void) {
    subs.add(f);
    return () => subs.delete(f);
  },
};

const server: State = { interest: null, showPlanned: false, isPreview: false };
export function useStore() {
  return useSyncExternalStore(store.sub, store.get, () => server);
}

/** Define o interesse e leva ao diagnóstico. */
export function goDiagnostic(interest: Interest = null) {
  if (interest) store.set({ interest });
  document.getElementById("diagnostico")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

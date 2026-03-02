import { createSignal } from "solid-js";

export type LoadingIcon = "hourglass" | "database" | "spinner" | "rocket" | "pencil" | "check" | "trash" | "undo";

export interface LoadingState {
  icon: LoadingIcon;
  message: string;
  source?: string;
}

const [loadingState, setLoadingState] = createSignal<LoadingState | null>(null);

export function showLoading(icon: LoadingIcon = "spinner", message: string = "Processing...", source?: string) {
  setLoadingState({ icon, message, source });
}

export function hideLoading(source?: string) {
  // If a source is given, only hide if the current state matches that source
  // This prevents one caller from clearing another caller's loading state
  if (source) {
    const current = loadingState();
    if (current && current.source !== source) return;
  }
  setLoadingState(null);
}

export { loadingState };

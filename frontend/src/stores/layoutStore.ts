import { createSignal } from "solid-js";
import { getStorageKey } from "../config";

const WIDE_MODE_KEY = getStorageKey("is_wide_mode");

// Retrieve initial state from localStorage safely
const initialValue = typeof window !== 'undefined' ? localStorage.getItem(WIDE_MODE_KEY) === 'true' : false;

export const [isWideMode, setIsWideMode] = createSignal(initialValue);

export const toggleWideMode = () => {
  setIsWideMode(prev => {
    const nextValue = !prev;
    if (typeof window !== 'undefined') {
      localStorage.setItem(WIDE_MODE_KEY, String(nextValue));
    }
    return nextValue;
  });
};


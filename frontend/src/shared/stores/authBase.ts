import { createSignal } from "solid-js";
import { AUTH_KEYS } from "../../config";

export interface User {
  id: number;
  email: string;
  username: string;
  fullname: string;
  roles: string[];
}

export const [user, setUser] = createSignal<User | null>(null);
export const [accessToken, setAccessToken] = createSignal<string | null>(null);
export const [refreshToken, setRefreshToken] = createSignal<string | null>(null);
export const [isLoading, setIsLoading] = createSignal(true);

export function getAuthHeaders(): Record<string, string> {
  const token = accessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEYS.accessToken);
  localStorage.removeItem(AUTH_KEYS.refreshToken);
  localStorage.removeItem(AUTH_KEYS.user);
  setAccessToken(null);
  setRefreshToken(null);
  setUser(null);
}

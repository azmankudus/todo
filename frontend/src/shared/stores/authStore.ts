import { onMount } from "solid-js";
import { AUTH_KEYS } from "../../config";
import { ApiStatus } from "../domain/ApiStatus";
import { apiClient } from "../utils/api";
import {
  user, setUser,
  accessToken, setAccessToken,
  refreshToken, setRefreshToken,
  isLoading, setIsLoading,
  getAuthHeaders, clearAuth,
  User
} from "./authBase";

export { user, accessToken, refreshToken, isLoading, getAuthHeaders, clearAuth };
export type { User };

export const isAuthenticated = () => !!user() && !!accessToken();

export function initializeAuth() {
  onMount(() => {
    const storedToken = localStorage.getItem(AUTH_KEYS.accessToken);
    const storedRefreshToken = localStorage.getItem(AUTH_KEYS.refreshToken);
    const storedUser = localStorage.getItem(AUTH_KEYS.user);

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAccessToken(storedToken);
        setRefreshToken(storedRefreshToken);
        setUser(parsedUser);
      } catch (e) {
        clearAuth();
      }
    }
    setIsLoading(false);
  });
}

export function setAuth(tokens: { accessToken: string; refreshToken: string; user: User }) {
  localStorage.setItem(AUTH_KEYS.accessToken, tokens.accessToken);
  localStorage.setItem(AUTH_KEYS.refreshToken, tokens.refreshToken);
  localStorage.setItem(AUTH_KEYS.user, JSON.stringify(tokens.user));
  setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
  setUser(tokens.user);
}

export async function login(identity: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: identity, password, rememberMe }),
    });

    if (data.status === ApiStatus.SUCCESS && data.details) {
      setAuth(data.details);
      return { success: true };
    }
    return { success: false, error: data.message || "Login failed" };
  } catch (error: any) {
    return { success: false, error: error.message || "Network error. Please try again." };
  }
}

export async function register(email: string, username: string, fullname: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, fullname, password }),
    });

    if (data.status === ApiStatus.SUCCESS && data.details) {
      setAuth(data.details);
      return { success: true };
    }
    return { success: false, error: data.message || "Registration failed" };
  } catch (error: any) {
    return { success: false, error: error.message || "Network error. Please try again." };
  }
}

export async function logout(): Promise<void> {
  const rt = refreshToken();
  if (rt) {
    try {
      await apiClient("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken: rt }),
      });
    } catch (e) {
      // Ignore logout API errors
    }
  }
  clearAuth();
}

export async function refreshAccessToken(): Promise<boolean> {
  const rt = refreshToken();
  if (!rt) {
    clearAuth();
    return false;
  }

  try {
    const data = await apiClient("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: rt }),
    });

    if (data.status === ApiStatus.SUCCESS && data.details) {
      setAuth(data.details);
      return true;
    }
    clearAuth();
    return false;
  } catch (error) {
    clearAuth();
    return false;
  }
}

export function hasRole(role: string): boolean {
  const u = user();
  return u?.roles?.includes(role) || false;
}

export function hasAnyRole(roles: string[]): boolean {
  const u = user();
  return u ? roles.some(r => u.roles?.includes(r)) : false;
}

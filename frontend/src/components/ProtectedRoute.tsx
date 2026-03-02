import { JSX, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { isAuthenticated, isLoading, initializeAuth } from "../stores/authStore";
import { CONFIG } from "../config";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute(props: ProtectedRouteProps) {
  const navigate = useNavigate();

  initializeAuth();

  onMount(() => {
    if (CONFIG.securityEnabled && !isLoading() && !isAuthenticated()) {
      navigate("/login", { replace: true });
    }
  });

  return (
    <Show
      when={!CONFIG.securityEnabled || !isLoading()}
      fallback={
        <div class="flex items-center justify-center min-h-[50vh]">
          <div class="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-primary-600 rounded-full" role="status" aria-label="loading"></div>
        </div>
      }
    >
      <Show when={!CONFIG.securityEnabled || isAuthenticated()} fallback={null}>
        {props.children}
      </Show>
    </Show>
  );
}

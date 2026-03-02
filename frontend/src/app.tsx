import { Router, useIsRouting } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal, createEffect, onCleanup, onMount, Show, For } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";
import { Navigation } from "./components/ui/Navigation";
import { backgrounds } from "./components/ui/Backgrounds";
import { LoadingAnimation } from "./components/ui/LoadingAnimation";
import { loadingState, showLoading, hideLoading } from "./stores/loadingStore";
import { CONFIG, getStorageKey } from "./config";
import { initializeAuth, user, isAuthenticated } from "./stores/authStore";
import "./app.css";

export default function App() {
  const [theme, setTheme] = createSignal("dark");
  const [colorTheme, setColorTheme] = createSignal(CONFIG.theme);
  const [backgroundTheme, setBackgroundTheme] = createSignal(CONFIG.background);
  const [routeKey, setRouteKey] = createSignal(0);
  const refreshRoute = () => setRouteKey(k => k + 1);

  initializeAuth();

  onMount(() => {
    const saved = localStorage.getItem(getStorageKey("theme"));
    const initialTheme = saved || "dark";
    setTheme(initialTheme);

    const savedColor = localStorage.getItem(getStorageKey("colorTheme"));
    const initialColor = savedColor || CONFIG.theme;
    setColorTheme(initialColor);

    const savedBg = localStorage.getItem(getStorageKey("backgroundTheme"));
    const initialBg = savedBg || CONFIG.background;
    setBackgroundTheme(initialBg);

    applyTheme(initialTheme, initialColor);
  });

  const applyTheme = (t: string, color?: string) => {
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.documentElement.setAttribute("data-theme", t);
    if (color) {
      document.documentElement.setAttribute("data-theme-color", color);
    } else {
      document.documentElement.setAttribute("data-theme-color", colorTheme());
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme() === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(getStorageKey("theme"), nextTheme);
    applyTheme(nextTheme, colorTheme());
  };

  const changeColorTheme = (color: string) => {
    setColorTheme(color);
    localStorage.setItem(getStorageKey("colorTheme"), color);
    applyTheme(theme(), color);
  };

  const changeBackgroundTheme = (bg: string) => {
    setBackgroundTheme(bg);
    localStorage.setItem(getStorageKey("backgroundTheme"), bg);
  };

  const navItems = () => [
    { href: "/", label: "Home" },
    ...((!CONFIG.securityEnabled || isAuthenticated()) ? [
      { href: "/todo", label: "Tasks" },
      { href: "/sql", label: "SQL" }
    ] : []),
    { href: "/errors", label: "Errors" }
  ];

  return (
    <Router
      base={import.meta.env.VITE_BASE_URL}
      root={props => {
        const isRouting = useIsRouting();

        // Show hourglass when navigating between routes
        let safetyTimer: ReturnType<typeof setTimeout> | undefined;

        createEffect(() => {
          if (isRouting()) {
            showLoading("hourglass", "Preparing...", "routing");
            safetyTimer = setTimeout(() => hideLoading("routing"), 8000);
          } else {
            clearTimeout(safetyTimer);
            hideLoading("routing");
          }
        });

        onCleanup(() => clearTimeout(safetyTimer));

        return (
          <div class="min-h-screen transition-colors duration-300 relative flex flex-col pt-24">

            <div class="fixed inset-0 -z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
              <Dynamic component={backgrounds[backgroundTheme() as keyof typeof backgrounds] || backgrounds.wavy} />
            </div>

            <Navigation
              items={navItems()}
              theme={theme()}
              onToggleTheme={toggleTheme}
              colorTheme={colorTheme()}
              onChangeColorTheme={changeColorTheme}
              backgroundTheme={backgroundTheme()}
              onChangeBackgroundTheme={changeBackgroundTheme}
              onRefreshRoute={refreshRoute}
              brand="Todo"
              user={user()}
            />
            <Suspense fallback={
              <div class="flex items-center justify-center p-12 grow">
                <div class="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-primary-600 rounded-full" role="status" aria-label="loading"></div>
              </div>
            }>
              <main class="w-full relative grow flex flex-col">
                <For each={[routeKey()]}>
                  {() => props.children}
                </For>
              </main>
            </Suspense>

            {/* Configurable loading modal */}
            <Show when={loadingState()}>
              {(state) => (
                <div class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200">
                  <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl shadow-primary-500/10 flex flex-col items-center gap-4 border border-gray-100 dark:border-slate-700">
                    <LoadingAnimation icon={state().icon} />
                    <div class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
                      {state().message}
                    </div>
                  </div>
                </div>
              )}
            </Show>

            <ScrollToTop />
          </div>
        );
      }}
    >
      <FileRoutes />
    </Router>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = createSignal(false);

  onMount(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  return (
    <Presence>
      <Show when={visible()}>
        <Motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          hover={{ scale: 1.1 }}
          press={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          class="fixed bottom-8 right-8 z-[60] p-4 rounded-2xl bg-primary-600 text-white shadow-2xl shadow-primary-500/40 hover:bg-primary-500 transition-colors flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6" /></svg>
        </Motion.button>
      </Show>
    </Presence>
  );
}

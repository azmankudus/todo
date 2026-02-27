import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, createSignal, onMount } from "solid-js";
import { Navigation } from "./components/ui/Navigation";
import "./app.css";

export default function App() {
  const [theme, setTheme] = createSignal("dark");

  onMount(() => {
    const saved = localStorage.getItem("theme");
    const initialTheme = saved || "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  });

  const applyTheme = (t: string) => {
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.documentElement.setAttribute("data-theme", t);
  };

  const toggleTheme = () => {
    const nextTheme = theme() === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/todo", label: "Todo" },
    { href: "/sql", label: "SQL" }
  ];

  return (
    <Router
      base={import.meta.env.VITE_BASE_URL}
      root={props => (
        <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
          <Navigation
            items={navItems}
            theme={theme()}
            onToggleTheme={toggleTheme}
            brand="Todo"
          />
          <Suspense fallback={
            <div class="flex items-center justify-center p-12">
              <div class="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading"></div>
            </div>
          }>
            <div class="w-full">
              {props.children}
            </div>
          </Suspense>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

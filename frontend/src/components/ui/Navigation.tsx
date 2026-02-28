import { JSX, splitProps, createSignal, onMount, onCleanup, For, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { Menu, X, SquareCheck, Sun, Moon, Palette, Image as ImageIcon, Maximize, Minimize } from "lucide-solid";
import { isWideMode, toggleWideMode } from "../../stores/layoutStore";
import { Motion } from "solid-motionone";

export interface NavItem {
  href: string;
  label: string;
}

export interface NavigationProps extends JSX.HTMLAttributes<HTMLElement> {
  brand?: string;
  items: NavItem[];
  theme: string;
  onToggleTheme: () => void;
  colorTheme: string;
  onChangeColorTheme: (color: string) => void;
  backgroundTheme: string;
  onChangeBackgroundTheme: (bg: string) => void;
  onRefreshRoute?: () => void;
}

const colorThemes = ["ocean", "sunset", "forest", "lavender", "rose", "midnight", "mint", "amber", "crimson", "berry", "emerald", "sapphire", "amethyst", "ruby", "topaz", "jade", "coral", "turquoise", "obsidian", "pearl"];
const backgroundPatterns = ["wavy", "blobs", "mesh", "grid", "dots", "aurora", "topography", "waves", "geometric", "minimal", "circles", "stripes", "zigzag", "honeycomb", "crosshatch", "particles", "squares", "isometric", "kaleidoscope", "nova"];

const ThemeColors: Record<string, string> = {
  ocean: '#0ea5e9', sunset: '#f97316', forest: '#22c55e', lavender: '#a855f7',
  rose: '#f43f5e', midnight: '#312e81', mint: '#14b8a6', amber: '#f59e0b',
  crimson: '#e11d48', berry: '#be185d', emerald: '#10b981', sapphire: '#2563eb',
  amethyst: '#9333ea', ruby: '#be123c', topaz: '#06b6d4', jade: '#059669',
  coral: '#fb7185', turquoise: '#0d9488', obsidian: '#1e293b', pearl: '#f1f5f9'
};

const OptionBadge = (props: { type: "color" | "bg", value: string }) => {
  if (props.type === "color") {
    const color = ThemeColors[props.value] || '#94a3b8';
    return <div class="w-4 h-4 rounded-md shadow-sm shrink-0" style={{ "background-color": color }} />
  }
  return (
    <div class="w-4 h-4 rounded shadow-sm border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shrink-0 overflow-hidden relative">
      <div class="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48L3JlY3Q+PHBhdGggZD0iTTAgMHY4SDRWMHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PC9wYXRoPjwvc3ZnPg==')]" />
    </div>
  );
}

function ThemeDropdown(props: { type: "color" | "bg"; icon: JSX.Element; value: string; options: string[]; onChange: (v: string) => void; title: string }) {
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef!: HTMLDivElement;

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => document.addEventListener("click", handleClickOutside));
  onCleanup(() => document.removeEventListener("click", handleClickOutside));

  return (
    <div class="relative flex items-center group" ref={containerRef}>
      <Motion.button
        type="button"
        onClick={(e: Event) => {
          e.stopPropagation();
          setIsOpen(!isOpen());
        }}
        hover={{ scale: 1.1 }}
        press={{ scale: 0.9 }}
        class="inline-flex items-center justify-center p-2 text-gray-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-gray-400 transition-colors"
        title={props.title}
      >
        {props.icon}
      </Motion.button>

      <Show when={isOpen()}>
        <Motion.div
          initial={{ opacity: 0, y: -5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          class="absolute z-50 top-full right-0 mt-2 w-48 max-h-64 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg custom-scrollbar"
        >
          <ul class="py-1">
            <For each={[props.value, ...props.options.filter(o => o !== props.value)]}>
              {(option) => (
                <li>
                  <button
                    type="button"
                    class={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${props.value === option ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/10' : 'text-slate-700 dark:text-slate-300'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onChange(option);
                      setIsOpen(false);
                    }}
                  >
                    <OptionBadge type={props.type} value={option} />
                    <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                  </button>
                </li>
              )}
            </For>
          </ul>
        </Motion.div>
      </Show>
    </div>
  );
}

export function Navigation(props: NavigationProps) {
  const [local, others] = splitProps(props, ["brand", "items", "theme", "onToggleTheme", "colorTheme", "onChangeColorTheme", "backgroundTheme", "onChangeBackgroundTheme", "onRefreshRoute", "class"]);
  const [isOpen, setIsOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);
  const location = useLocation();

  onMount(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  return (
    <header
      class={`fixed top-0 w-full z-[100] text-sm py-5 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-transparent data-[scrolled=true]:border-slate-200 dark:data-[scrolled=true]:border-slate-800 data-[scrolled=true]:py-3 ${local.class || ""}`}
      data-scrolled={scrolled() || isOpen()}
      {...others}
    >
      <nav class="relative max-w-7xl w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <A class="flex items-center gap-x-3 text-3xl font-black text-slate-900 dark:text-white" href="/" aria-label="Brand">
            <Motion.div
              hover={{ scale: 1.1, rotate: 5 }}
              press={{ scale: 0.95 }}
              class="flex items-center justify-center text-primary-600 dark:text-primary-500"
            >
              <SquareCheck size={38} strokeWidth={2.5} />
            </Motion.div>
            <span class="tracking-tight">{local.brand || "Todo"}</span>
          </A>
          <div class="sm:hidden flex items-center gap-x-1">
            <ThemeDropdown
              type="bg"
              title="Background Pattern"
              icon={<ImageIcon size={20} />}
              value={local.backgroundTheme}
              options={backgroundPatterns}
              onChange={local.onChangeBackgroundTheme}
            />
            <ThemeDropdown
              type="color"
              title="Color Theme"
              icon={<Palette size={20} />}
              value={local.colorTheme}
              options={colorThemes}
              onChange={local.onChangeColorTheme}
            />
            <Motion.button
              onClick={toggleWideMode}
              hover={{ scale: 1.1 }}
              press={{ scale: 0.9 }}
              class="hidden sm:inline-flex items-center justify-center p-2 text-gray-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-gray-400 transition-colors"
              title={isWideMode() ? "Centered View" : "Wide View"}
            >
              {isWideMode() ? <Minimize size={20} /> : <Maximize size={20} />}
            </Motion.button>
            <Motion.button
              onClick={local.onToggleTheme}
              hover={{ scale: 1.1, rotate: 10 }}
              press={{ scale: 0.9 }}
              class="p-2 text-gray-500 rounded-lg dark:text-gray-400 transition-colors"
            >
              {local.theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Motion.button>
            <Motion.button
              onClick={() => setIsOpen(!isOpen())}
              hover={{ scale: 1.1 }}
              press={{ scale: 0.9 }}
              type="button"
              class="flex justify-center items-center gap-x-2 w-10 h-10 text-sm font-semibold rounded-xl border border-gray-200 text-gray-800 dark:text-white dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen() ? <X size={22} /> : <Menu size={22} />}
            </Motion.button>
          </div>
        </div>

        <div
          class={`${isOpen() ? "block" : "hidden"} overflow-hidden sm:overflow-visible transition-all duration-300 basis-full grow sm:block`}
        >
          <div class="flex flex-col gap-y-2 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-4 sm:mt-0 sm:pl-7">
            {local.items.map(item => (
              <A
                class="relative text-lg font-semibold text-slate-600 dark:text-slate-400 transition-all duration-300 px-5 py-2.5 rounded-2xl border border-transparent hover:text-slate-900 dark:hover:text-white group"
                href={item.href}
                activeClass="!text-white bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-600/80 dark:to-secondary-500/80 shadow-md shadow-primary-500/20"
                end={item.href === "/"}
                onMouseDown={(e) => {
                  const anchor = e.currentTarget as HTMLAnchorElement;
                  const targetPath = new URL(anchor.href).pathname.replace(/\/$/, '') || '/';
                  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
                  if (currentPath === targetPath) {
                    e.preventDefault();
                    e.stopPropagation();
                    local.onRefreshRoute?.();
                  }
                }}
              >
                <div class="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 opacity-0 transition-opacity duration-300 -z-10 group-hover:opacity-100 group-hover:shadow-md border border-gray-100 dark:border-slate-700/50" />
                <Motion.span
                  hover={{ scale: 1.05 }}
                  press={{ scale: 0.95 }}
                  class="inline-block relative z-10"
                >
                  {item.label}
                </Motion.span>
              </A>
            ))}

            <div class="hidden sm:flex items-center ml-2 border-l border-gray-200 dark:border-slate-800 pl-4 gap-1">
              <ThemeDropdown
                type="bg"
                title="Background Pattern"
                icon={<ImageIcon size={20} />}
                value={local.backgroundTheme}
                options={backgroundPatterns}
                onChange={local.onChangeBackgroundTheme}
              />

              <ThemeDropdown
                type="color"
                title="Color Theme"
                icon={<Palette size={20} />}
                value={local.colorTheme}
                options={colorThemes}
                onChange={local.onChangeColorTheme}
              />

              <Motion.button
                onClick={toggleWideMode}
                hover={{ scale: 1.1 }}
                press={{ scale: 0.9 }}
                class="inline-flex items-center justify-center p-2 text-gray-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-gray-400 transition-colors"
                title={isWideMode() ? "Centered View" : "Wide View"}
              >
                {isWideMode() ? <Minimize size={20} /> : <Maximize size={20} />}
              </Motion.button>

              <Motion.button
                onClick={local.onToggleTheme}
                hover={{ scale: 1.1, rotate: 15 }}
                press={{ scale: 0.9 }}
                class="inline-flex items-center justify-center p-2 text-gray-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-gray-400 transition-colors"
                title={`Switch to ${local.theme === "dark" ? "light" : "dark"} mode`}
              >
                {local.theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Motion.button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}


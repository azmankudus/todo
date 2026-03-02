import { JSX, splitProps, createSignal, createEffect, onMount, onCleanup, For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { A, useLocation } from "@solidjs/router";
import { TbOutlineMenu2, TbOutlineX, TbOutlineSquareCheck, TbOutlineSun, TbOutlineMoon, TbOutlinePalette, TbOutlinePhoto as ImageIcon, TbOutlineMaximize, TbOutlineMinimize, TbOutlineArrowRight, TbOutlineLogout } from "solid-icons/tb";
import { isWideMode, toggleWideMode } from "../../stores/layoutStore";
import { user, logout, User } from "../../stores/authStore";
import { TextButton } from "./TextButton";
import { IconButton } from "./IconButton";
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
  user?: User | null;
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
  const [pos, setPos] = createSignal({ top: 0, right: 0 });
  let btnRef!: HTMLButtonElement;
  let listRef!: HTMLDivElement;

  const handleClickOutside = (e: MouseEvent) => {
    if (btnRef && !btnRef.contains(e.target as Node) && listRef && !listRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => document.addEventListener("click", handleClickOutside));
  onCleanup(() => document.removeEventListener("click", handleClickOutside));

  // Auto-scroll to selected item when dropdown opens
  createEffect(() => {
    if (isOpen() && listRef) {
      requestAnimationFrame(() => {
        const selected = listRef.querySelector('[data-selected="true"]') as HTMLElement;
        if (selected) {
          selected.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      });
    }
  });

  const openDropdown = (e: Event) => {
    e.stopPropagation();
    if (!isOpen()) {
      const rect = btnRef.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
    setIsOpen(!isOpen());
  };

  return (
    <>
      <IconButton
        ref={btnRef!}
        icon={props.icon}
        onClick={openDropdown}
        variant="primary"
        glow
        title={props.title}
      />

      <Show when={isOpen()}>
        <Portal>
          <div
            ref={listRef!}
            class="fixed z-[9999] w-48 max-h-64 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl custom-scrollbar animate-[fadeIn_0.15s_ease-out]"
            style={{ top: `${pos().top}px`, right: `${pos().right}px` }}
          >
            <ul class="py-1">
              <For each={props.options}>
                {(option) => (
                  <li>
                    <button
                      type="button"
                      data-selected={props.value === option}
                      class={`w-full flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${props.value === option ? 'text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20' : 'text-slate-700 dark:text-slate-300'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onChange(option);
                        setIsOpen(false);
                      }}
                    >
                      <OptionBadge type={props.type} value={option} />
                      <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                      {props.value === option && <span class="ml-auto text-primary-500">✓</span>}
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Portal>
      </Show>
    </>
  );
}

export function Navigation(props: NavigationProps) {
  const [local, others] = splitProps(props, ["brand", "items", "theme", "onToggleTheme", "colorTheme", "onChangeColorTheme", "backgroundTheme", "onChangeBackgroundTheme", "onRefreshRoute", "class", "user"]);
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
      class={`fixed top-0 w-full z-[100] text-sm py-5 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-transparent data-[scrolled=true]:border-slate-200 dark:data-[scrolled=true]:border-slate-800 data-[scrolled=true]:py-3 overflow-visible ${local.class || ""}`}
      data-scrolled={scrolled() || isOpen()}
      {...others}
    >
      <nav class="relative max-w-7xl w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <A class="flex items-center gap-x-2.5 font-black text-slate-900 dark:text-white group/brand transition-all duration-300" href="/" aria-label="Brand">
            <div class="flex items-center justify-center text-primary-600 dark:text-primary-500 transition-all duration-300 group-hover/brand:scale-110 group-hover/brand:[filter:drop-shadow(0_0_10px_currentColor)]">
              <TbOutlineSquareCheck size={40} stroke-width={2.5} />
            </div>
            <span class="text-2xl tracking-tight transition-all duration-300 group-hover/brand:[text-shadow:0_0_12px_rgba(99,102,241,0.7)]">{local.brand || "Todo"}</span>
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
              icon={<TbOutlinePalette size={20} />}
              value={local.colorTheme}
              options={colorThemes}
              onChange={local.onChangeColorTheme}
            />
            <IconButton
              onClick={toggleWideMode}
              icon={isWideMode() ? <TbOutlineMinimize size={20} /> : <TbOutlineMaximize size={20} />}
              variant="primary"
              glow
              title={isWideMode() ? "Centered View" : "Wide View"}
              class="hidden sm:inline-flex"
            />
            <IconButton
              onClick={local.onToggleTheme}
              icon={local.theme === "dark" ? <TbOutlineSun size={20} /> : <TbOutlineMoon size={20} />}
              variant="primary"
              glow
              title={`Switch to ${local.theme === "dark" ? "light" : "dark"} mode`}
            />
            <IconButton
              onClick={() => setIsOpen(!isOpen())}
              icon={isOpen() ? <TbOutlineX size={22} /> : <TbOutlineMenu2 size={22} />}
              variant="outline"
              glow={false}
              class="w-10 h-10"
            />
          </div>
        </div>

        <div
          class={`${isOpen() ? "block" : "hidden"} overflow-hidden sm:!overflow-visible transition-all duration-300 basis-full grow sm:block`}
        >
          <div class="flex flex-col gap-y-2 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-1 sm:mt-0 sm:pl-7">
            {(() => {
              const base = (import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "");
              const currentPath = () => {
                const p = location.pathname.replace(/\/$/, "") || "/";
                return base ? (p.startsWith(base) ? p.slice(base.length) || "/" : p) : p;
              };
              const normHref = (href: string) => href.replace(/\/$/, "") || "/";

              return local.items.map(item => (
                <A
                  class="relative text-sm font-bold text-slate-500 dark:text-slate-400 transition-all duration-300 px-2.5 py-1.5 hover:text-slate-900 dark:hover:text-white group/nav overflow-hidden"
                  href={item.href}
                  activeClass="!text-slate-900 dark:!text-white"
                  end={item.href === "/"}
                  onClick={() => {
                    if (normHref(currentPath()) === normHref(item.href)) {
                      local.onRefreshRoute?.();
                    }
                    if (isOpen()) setIsOpen(false);
                  }}
                >
                  <span class="relative z-10">{item.label}</span>
                  {/* Active glow line */}
                  <Show when={currentPath() === normHref(item.href)}>
                    <Motion.div
                      class="absolute bottom-0 left-1 right-1 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      style={{ "box-shadow": "0 0 8px rgba(99,102,241,0.9), 0 0 16px rgba(99,102,241,0.4)" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Show>
                  {/* Hover glow line (only when not active) */}
                  <Show when={currentPath() !== normHref(item.href)}>
                    <div
                      class="absolute bottom-0 left-1 right-1 h-0.5 bg-gradient-to-r from-primary-500/0 to-secondary-500/0 group-hover/nav:from-primary-500/60 group-hover/nav:to-secondary-500/60 rounded-full transition-all duration-300"
                    />
                  </Show>
                </A>
              ));
            })()}

            {/* Separator before sign in */}
            <div class="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2" />

            <div class="flex items-center gap-2">
              <Show when={local.user} fallback={
                <A href="/login">
                  <TextButton
                    variant="solid"
                    size="sm"
                    class="rounded-xl px-4"
                    icon={<TbOutlineArrowRight size={16} />}
                  >
                    Sign In
                  </TextButton>
                </A>
              }>
                <div class="flex items-center gap-3">
                  <div class="hidden lg:flex flex-col items-end">
                    <span class="text-xs font-black text-slate-900 dark:text-gray-100 leading-none mb-0.5">{local.user?.fullname}</span>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{local.user?.roles?.[0] || 'USER'}</span>
                  </div>
                  <TextButton
                    variant="outline"
                    size="sm"
                    class="!rounded-xl !p-2 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:border-red-500/30 transition-all"
                    onClick={() => logout()}
                    title="Sign Out"
                    icon={<TbOutlineLogout size={18} />}
                    iconOnly
                  />
                </div>
              </Show>
            </div>

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
                icon={<TbOutlinePalette size={20} />}
                value={local.colorTheme}
                options={colorThemes}
                onChange={local.onChangeColorTheme}
              />

              <IconButton
                onClick={toggleWideMode}
                icon={isWideMode() ? <TbOutlineMinimize size={18} /> : <TbOutlineMaximize size={18} />}
                variant="primary"
                glow
                title={isWideMode() ? "Centered View" : "Wide View"}
              />

              <IconButton
                onClick={local.onToggleTheme}
                icon={local.theme === "dark" ? <TbOutlineSun size={18} /> : <TbOutlineMoon size={18} />}
                variant="primary"
                glow
                title={`Switch to ${local.theme === "dark" ? "light" : "dark"} mode`}
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}


import { JSX, splitProps, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { Menu, X, SquareCheck, Sun, Moon } from "lucide-solid";

export interface NavItem {
  href: string;
  label: string;
}

export interface NavigationProps extends JSX.HTMLAttributes<HTMLElement> {
  brand?: string;
  items: NavItem[];
  theme: string;
  onToggleTheme: () => void;
}

export function Navigation(props: NavigationProps) {
  const [local, others] = splitProps(props, ["brand", "items", "theme", "onToggleTheme", "class"]);
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <header
      class={`flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white border-b border-gray-200 text-sm py-3 sm:py-0 dark:bg-slate-900 dark:border-slate-800 transition-colors ${local.class || ""}`}
      {...others}
    >
      <nav class="relative max-w-7xl w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <A class="flex items-center gap-x-3 text-2xl font-bold text-slate-900 dark:text-white group" href="/" aria-label="Brand">
            <div class="bg-white p-1.5 rounded-lg flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-800 transition-transform group-hover:scale-110">
              <SquareCheck class="text-blue-600" size={22} />
            </div>
            <span>{local.brand || "Todo"}</span>
          </A>
          <div class="sm:hidden flex items-center gap-x-2">
            <button
              onClick={local.onToggleTheme}
              class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-slate-800 transition-all"
            >
              {local.theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen())}
              type="button"
              class="hs-collapse-toggle flex justify-center items-center gap-x-2 w-9 h-9 text-sm font-semibold rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-slate-700 dark:hover:bg-slate-800"
            >
              {isOpen() ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div
          class={`${isOpen() ? "block" : "hidden"} overflow-hidden transition-all duration-300 basis-full grow sm:block`}
        >
          <div class="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7">
            {local.items.map(item => (
              <A
                class="font-medium text-gray-600 hover:text-blue-600 sm:py-6 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
                href={item.href}
                activeClass="!text-blue-600 dark:!text-blue-500"
                end={item.href === "/"}
              >
                {item.label}
              </A>
            ))}

            <button
              onClick={local.onToggleTheme}
              class="hidden sm:inline-flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-slate-800 transition-all"
              title={`Switch to ${local.theme === "dark" ? "light" : "dark"} mode`}
            >
              {local.theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

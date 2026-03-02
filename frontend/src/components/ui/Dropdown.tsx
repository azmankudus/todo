import { createSignal, onMount, onCleanup, Show, JSX, createMemo, For, createEffect } from "solid-js";
import { Motion, Presence } from "solid-motionone";

export interface DropdownProps<T = any> {
  // Logic Props
  value?: T;
  options?: T[];
  onSelect?: (option: T) => void;
  renderOption?: (option: T, isSelected: boolean) => JSX.Element;

  // Customization Props
  trigger: JSX.Element | ((isOpen: boolean, selected?: T, placeholder?: string) => JSX.Element);
  children?: JSX.Element;

  // UI Props
  class?: string;
  menuClass?: string;
  maxHeight?: string;
  align?: "left" | "right" | "center";

  // New Features
  optional?: boolean; // Default true
  placeholder?: string;
}

export function Dropdown<T = any>(props: DropdownProps<T>) {
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef!: HTMLDivElement;
  let scrollContainerRef: HTMLDivElement | undefined;

  onMount(() => {
    // Logic for optional=false: default to first option if nothing selected
    if (props.optional === false && (props.value === undefined || props.value === null) && props.options && props.options.length > 0) {
      props.onSelect?.(props.options[0]);
    }
  });

  createEffect(() => {
    if (isOpen()) {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef && !containerRef.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);

      // Auto-scroll to selected option
      requestAnimationFrame(() => {
        if (scrollContainerRef) {
          const selectedEl = scrollContainerRef.querySelector('[data-selected="true"]');
          if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'nearest', behavior: 'auto' });
          }
        }
      });

      onCleanup(() => document.removeEventListener("mousedown", handleClickOutside));
    }
  });

  const alignClasses = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2"
  };

  const currentPlaceholder = () => props.placeholder || "Please select";

  return (
    <div class={`relative ${props.class || ""}`} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen())}
        class="cursor-pointer select-none"
      >
        {typeof props.trigger === "function"
          ? props.trigger(isOpen(), props.value, currentPlaceholder())
          : props.trigger}
      </div>

      <Presence>
        <Show when={isOpen()}>
          <Motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.15, easing: [0.23, 1, 0.32, 1] }}
            class={`
              absolute z-[200] top-full mt-2
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-800
              rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40
              overflow-hidden
              ${alignClasses[props.align || "right"]}
              ${props.menuClass || "w-full min-w-[200px]"}
            `}
          >
            <div
              ref={scrollContainerRef}
              class="overflow-y-auto custom-scrollbar p-2"
              style={{ "max-height": props.maxHeight || "480px" }}
              onClick={(e) => {
                // Close on click unless it's a specific interaction
                if (!(e.target as HTMLElement).closest('[data-dropdown-keep-open]')) {
                  setIsOpen(false);
                }
              }}
            >
              <Show when={props.options} fallback={props.children}>
                <div class="grid grid-cols-1 gap-1">
                  <For each={props.options}>
                    {(option) => {
                      const isSelected = option === props.value;
                      return (
                        <div
                          class="cursor-pointer"
                          data-selected={isSelected}
                          onClick={() => props.onSelect?.(option)}
                        >
                          {props.renderOption ? props.renderOption(option, isSelected) : String(option)}
                        </div>
                      );
                    }}
                  </For>
                </div>
              </Show>
            </div>
          </Motion.div>
        </Show>
      </Presence>
    </div>
  );
}

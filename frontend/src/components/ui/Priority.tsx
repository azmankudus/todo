import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import { TbOutlineChevronDown } from "solid-icons/tb";
import { Motion } from "solid-motionone";

export const PRIORITIES = [
  { value: 1, label: "Priority 1", short: "P1", colorClass: "bg-red-500" },
  { value: 2, label: "Priority 2", short: "P2", colorClass: "bg-amber-500" },
  { value: 3, label: "Priority 3", short: "P3", colorClass: "bg-yellow-400" },
  { value: 4, label: "Priority 4", short: "P4", colorClass: "bg-green-500" },
  { value: 5, label: "Priority 5", short: "P5", colorClass: "bg-blue-500" },
];

export function PriorityIconLabel(props: { priority: number; format?: "short" | "full" | "iconOnly"; class?: string; textClass?: string; iconClass?: string }) {
  const p = () => PRIORITIES.find(x => x.value === props.priority) || PRIORITIES[4];

  return (
    <div class={`flex items-center gap-2 ${props.class || ""}`}>
      <div class={`rounded shadow-sm shrink-0 ${props.iconClass || "w-4 h-4"} ${p().colorClass}`} />
      <Show when={props.format !== "iconOnly"}>
        <span class={props.textClass || "text-sm font-medium text-slate-700 dark:text-slate-200"}>
          {props.format === "full" ? p().label : p().short}
        </span>
      </Show>
    </div>
  );
}

export function PriorityBadge(props: { priority: number; showLabel?: boolean; labelFormat?: "short" | "full" }) {
  return (
    <PriorityIconLabel
      priority={props.priority}
      format={props.showLabel ? (props.labelFormat || "short") : "iconOnly"}
      class="px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 inline-flex"
      iconClass="w-3 h-3"
      textClass="text-xs font-semibold text-slate-600 dark:text-slate-300"
    />
  );
}

export function PrioritySelect(props: { value: number; onChange: (v: number) => void; class?: string }) {
  const [isOpen, setIsOpen] = createSignal(false);
  let containerRef!: HTMLDivElement;

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  const selected = () => PRIORITIES.find((p) => p.value === props.value) || PRIORITIES[4];

  return (
    <div class={`relative ${props.class || ""}`} ref={containerRef}>
      <button
        type="button"
        class="flex items-center gap-2 h-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm hover:border-primary-400 dark:hover:border-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 shrink-0"
        onClick={() => setIsOpen(!isOpen())}
      >
        <PriorityIconLabel
          priority={selected().value}
          format="short"
        />
        <TbOutlineChevronDown size={16} class="text-slate-400" />
      </button>

      <Show when={isOpen()}>
        <Motion.div
          initial={{ opacity: 0, y: -5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          class="absolute z-50 top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden"
        >
          <ul class="py-1">
            <For each={PRIORITIES}>
              {(p) => (
                <li>
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                    onClick={() => {
                      props.onChange(p.value);
                      setIsOpen(false);
                    }}
                  >
                    <PriorityIconLabel
                      priority={p.value}
                      format="full"
                      textClass={`text-sm font-medium ${p.value === props.value ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}
                    />
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

import { createSignal, For } from "solid-js";
import { TbOutlineChevronDown, TbOutlineAlertCircle } from "solid-icons/tb";
import { Motion } from "solid-motionone";
import { ErrorLayout } from "../components/ui/ErrorLayout";
import { Dropdown } from "../components/ui/Dropdown";
import { ERROR_CONFIGS } from "../config/errors";
import { isWideMode } from "../stores/layoutStore";

export default function ErrorShowcase() {
  const [selectedCode, setSelectedCode] = createSignal("");
  const [isOpen, setIsOpen] = createSignal(false);

  const options = Object.keys(ERROR_CONFIGS).filter(key => key !== "default");

  return (
    <div class={`w-full mx-auto px-4 py-8 transition-all duration-300 ${isWideMode() ? 'max-w-[98%]' : 'max-w-5xl'}`}>
      {/* Selector Section */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, easing: [0.22, 1, 0.36, 1] }}
        class="flex flex-col items-center mb-12 relative z-[110]"
      >
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Error Preview System</h2>

        <Dropdown
          class="w-full max-w-xs"
          menuClass="w-full"
          options={options}
          value={selectedCode()}
          onSelect={(code) => setSelectedCode(code)}
          optional={true}
          placeholder="Please select"
          trigger={(open, value) => (
            <button
              class="w-full flex items-center justify-between px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-black/[0.03] dark:shadow-black/20 text-slate-900 dark:text-white transition-all hover:border-primary-500/50 group"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                  <TbOutlineAlertCircle size={18} />
                </div>
                <span class="font-bold font-mono">CODE : {value || "Please select"}</span>
              </div>
              <TbOutlineChevronDown
                size={20}
                class={`text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              />
            </button>
          )}
          renderOption={(code, isSelected) => (
            <div
              class={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isSelected
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
            >
              <span class="font-mono">{code}</span>
              <span class="text-xs opacity-60">{ERROR_CONFIGS[code as string].name}</span>
            </div>
          )}
        />
      </Motion.div>

      {/* Display Section */}
      <Motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, easing: [0.22, 1, 0.36, 1] }}
        class="relative min-h-[400px] rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/20 shadow-inner p-4"
      >
        <For each={[selectedCode()]}>
          {(code) => <ErrorLayout code={code} />}
        </For>
      </Motion.div>
    </div>
  );
}

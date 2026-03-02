import { JSX, splitProps } from "solid-js";
import { TbOutlineCheck } from "solid-icons/tb";

export function Checkbox(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  const [local, others] = splitProps(props, ["class", "checked"]);

  return (
    <label class={`relative inline-block cursor-pointer group select-none ${local.class || ""}`}>
      <input
        type="checkbox"
        class="sr-only"
        checked={local.checked}
        {...others}
      />
      <div
        class={`
          w-full h-full border-2 rounded-[inherit] flex items-center justify-center transition-all duration-200
          ${local.checked
            ? 'bg-primary-500 border-primary-500 text-white group-hover:bg-transparent group-hover:border-primary-400/50'
            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 group-hover:border-primary-400'}
        `}
      >
        <div class="relative w-full h-full flex items-center justify-center pointer-events-none">
          <div class={`
            absolute inset-0 flex items-center justify-center transition-all duration-200
            ${local.checked
              ? 'opacity-100 group-hover:opacity-0 scale-105 group-hover:scale-75'
              : 'opacity-0 group-hover:opacity-50 text-primary-500 dark:text-primary-400 scale-75 group-hover:scale-100'}
          `}>
            <TbOutlineCheck size="85%" stroke-width={4} />
          </div>
        </div>
      </div>
    </label>
  );
}

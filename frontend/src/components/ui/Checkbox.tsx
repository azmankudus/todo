import { JSX, splitProps } from "solid-js";

export function Checkbox(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <input
      type="checkbox"
      class={`
        shrink-0 mt-0.5 border-gray-200 rounded text-primary-600 accent-primary-600 dark:accent-primary-500
        checked:bg-primary-600 checked:border-primary-600
        focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none 
        dark:bg-slate-900 dark:border-slate-700 dark:checked:bg-primary-500 
        dark:checked:border-primary-500 dark:focus:ring-offset-gray-800 transition-all cursor-pointer
        ${local.class || ""}
      `}
      {...others}
    />
  );
}

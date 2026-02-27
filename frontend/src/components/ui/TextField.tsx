import { JSX, splitProps } from "solid-js";

export function TextField(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  const [local, others] = splitProps(props, ["class"]);

  return (
    <input
      class={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm transition-all focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white dark:bg-slate-900 border dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:ring-slate-600 ${local.class || ""}`}
      {...others}
    />
  );
}

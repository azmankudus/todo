import { JSX, splitProps } from "solid-js";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost" | "danger" | "soft" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["class", "variant", "size", "children"]);

  const baseStyles = "inline-flex justify-center items-center gap-x-2 font-medium rounded-lg disabled:opacity-50 disabled:pointer-events-none transition-all";

  const variants = {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    soft: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/30 dark:text-blue-500 dark:hover:bg-blue-800/40",
    ghost: "text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-blue-800/30",
    outline: "border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-600"
  };

  const sizes = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-4 text-sm",
    lg: "p-4 sm:p-5 text-base"
  };

  return (
    <button
      class={`${baseStyles} ${variants[local.variant || "solid"]} ${sizes[local.size || "md"]} ${local.class || ""}`}
      {...others}
    >
      {local.children}
    </button>
  );
}

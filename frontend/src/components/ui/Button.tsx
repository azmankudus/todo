import { JSX, splitProps } from "solid-js";
import { Motion } from "solid-motionone";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost" | "danger" | "soft" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["class", "variant", "size", "children"]);

  const baseStyles = "inline-flex justify-center items-center gap-x-2 font-medium rounded-lg disabled:opacity-50 disabled:pointer-events-none transition-shadow";

  const variants = {
    solid: "bg-primary-600 text-white shadow-sm shadow-primary-500/20",
    soft: "bg-primary-100 text-primary-800 dark:bg-primary-800/30 dark:text-primary-500",
    ghost: "text-primary-600 dark:text-primary-500",
    outline: "border border-gray-200 bg-white text-gray-800 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-white",
    danger: "bg-red-500/10 text-red-500"
  };

  const sizes = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-4 text-sm",
    lg: "p-4 sm:p-5 text-base"
  };

  return (
    <Motion.button
      hover={{ scale: 1.05 }}
      press={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      class={`${baseStyles} ${variants[local.variant || "solid"]} ${sizes[local.size || "md"]} ${local.class || ""}`}
      {...others}
    >
      {local.children}
    </Motion.button>
  );
}


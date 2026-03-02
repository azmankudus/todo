import { JSX, splitProps } from "solid-js";
import { Motion } from "solid-motionone";

export interface TextButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost" | "danger" | "soft" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: JSX.Element;
  iconOnly?: boolean;
}

export function TextButton(props: TextButtonProps) {
  const [local, others] = splitProps(props, ["class", "variant", "size", "children", "icon", "iconOnly"]);

  const baseStyles = "inline-flex justify-center items-center font-medium rounded-lg disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 group cursor-pointer relative overflow-hidden";

  const variants: Record<string, string> = {
    solid: "bg-primary-600 text-white shadow-sm shadow-primary-500/20 hover:shadow-primary-500/40",
    soft: "bg-primary-100 text-primary-800 dark:bg-primary-800/30 dark:text-primary-500 hover:bg-primary-200 dark:hover:bg-primary-800/50",
    ghost: "text-primary-600 dark:text-primary-500 hover:bg-slate-100 dark:hover:bg-slate-800",
    outline: "border border-gray-200 bg-white text-gray-800 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20"
  };

  const sizes: Record<string, string> = {
    sm: "py-1.5 px-4 text-sm",
    md: "py-2 px-6 text-sm",
    lg: "py-3 px-8 text-base"
  };

  // Minimum width for hover-reveal buttons so there's room for text + icon
  const hoverRevealMin: Record<string, string> = {
    sm: "min-w-28",
    md: "min-w-32",
    lg: "min-w-40"
  };

  // Inverted colors for the icon box
  const iconBg: Record<string, string> = {
    solid: "bg-white text-primary-600",
    soft: "bg-primary-600 text-white dark:bg-primary-400 dark:text-slate-900",
    ghost: "bg-primary-600 text-white dark:bg-primary-400 dark:text-slate-900",
    outline: "bg-slate-800 text-white dark:bg-white dark:text-slate-900",
    danger: "bg-red-500 text-white"
  };

  // Text shift to maintain centering in the remaining space
  // This is roughly half of the button's height (which is what the icon width will be)
  const textShift: Record<string, string> = {
    sm: "group-hover:-translate-x-4", // 16px shift for ~32px icon
    md: "group-hover:-translate-x-5", // 20px shift for ~40px icon
    lg: "group-hover:-translate-x-6"  // 24px shift for ~48px icon
  };

  const v = () => local.variant || "solid";
  const s = () => local.size || "md";
  const isIconOnly = () => local.iconOnly === true;
  const hasHoverReveal = () => !isIconOnly() && !!local.icon;

  return (
    <Motion.button
      hover={{ scale: 1.02 }}
      press={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      class={`${baseStyles} ${variants[v()]} ${sizes[s()]} ${hasHoverReveal() ? hoverRevealMin[s()] : ""} ${local.class || ""}`}
      {...others}
    >
      {isIconOnly() ? (
        <span class="inline-flex items-center justify-center">
          {local.icon}
        </span>
      ) : hasHoverReveal() ? (
        <>
          {/* Text — shifts left to stay centered in the space not occupied by the icon */}
          <span class={`inline-flex items-center justify-center gap-x-2 relative z-10 transition-transform duration-300 ease-out ${textShift[s()]}`}>
            {local.children}
          </span>
          {/* Icon box — full height, square proportion, flush against right edge */}
          <span
            class={`absolute right-0 inset-y-0 aspect-square flex items-center justify-center translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100 ${iconBg[v()]} transition-all duration-300 ease-out overflow-hidden rounded-l-lg`}
          >
            {local.icon}
          </span>
        </>
      ) : (
        <span class="inline-flex items-center justify-center gap-x-2">
          {local.children}
        </span>
      )}
    </Motion.button>
  );
}

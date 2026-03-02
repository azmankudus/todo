import { JSX, splitProps } from "solid-js";
import { Motion } from "solid-motionone";

export interface IconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: JSX.Element;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export function IconButton(props: IconButtonProps) {
  const [local, others] = splitProps(props, ["icon", "class", "variant", "size", "glow"]);

  const baseStyles = "inline-flex items-center justify-center rounded-xl transition-all duration-300 transform-gpu cursor-pointer group relative";

  const variants: Record<string, string> = {
    primary: "text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/40",
    ghost: "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white",
    outline: "border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary-500/30 hover:bg-primary-50/50 dark:hover:bg-primary-900/20"
  };

  const sizes: Record<string, string> = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  };

  const v = () => local.variant || "ghost";
  const s = () => local.size || "md";

  return (
    <Motion.button
      hover={{ scale: 1.15 }}
      press={{ scale: 0.9 }}
      class={`${baseStyles} ${variants[v()]} ${sizes[s()]} ${local.class || ""}`}
      {...others}
    >
      <div class={`relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_currentColor] ${local.glow !== false ? 'group-hover:text-primary-500' : ''}`}>
        {local.icon}
      </div>

      {/* Dynamic Glow Background */}
      <div class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-primary-500/5 blur-xl transition-opacity duration-300 pointer-events-none" />
    </Motion.button>
  );
}

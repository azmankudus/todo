import { JSX, Show } from "solid-js";
import { Presence, Motion } from "solid-motionone";

interface TooltipProps {
  content: string | JSX.Element;
  children: JSX.Element;
  active?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  variant?: "error" | "default";
}

export function Tooltip(props: TooltipProps) {
  const variants = {
    error: "bg-red-600 text-white shadow-red-500/40",
    default: "bg-slate-800 text-white"
  };

  const arrowVariants = {
    error: "bg-red-600",
    default: "bg-slate-800"
  };

  return (
    <div class="relative inline-block">
      {props.children}

      <Presence>
        <Show when={props.active && props.content}>
          <Motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, easing: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: '100%',
              right: '0',
              "margin-bottom": '10px',
              "z-index": 200,
              "pointer-events": "none",
              "transform-origin": "bottom right",
              visibility: 'visible',
            }}
            class="flex items-center"
          >
            <div
              class={`px-3 py-2 rounded-xl shadow-2xl text-[11px] font-black uppercase tracking-wider flex items-center gap-2 relative leading-tight whitespace-nowrap ${variants[props.variant || "default"]
                }`}
            >
              {props.content}

              {/* Arrow — Aligned exactly to the right edge of the textfield */}
              <div
                class={`absolute -bottom-1 right-2 w-2.5 h-2.5 rotate-45 ${arrowVariants[props.variant || "default"]
                  }`}
              />
            </div>
          </Motion.div>
        </Show>
      </Presence>
    </div >
  );
}

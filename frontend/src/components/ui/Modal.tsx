import { JSX, Show, onMount, onCleanup, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";
import { TbOutlineX } from "solid-icons/tb";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: JSX.Element;
  maxWidth?: string;
  icon?: JSX.Element;
  class?: string;
}

export function Modal(props: ModalProps) {
  createEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") props.onClose();
      };
      window.addEventListener("keydown", handleEscape);
      onCleanup(() => {
        window.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      });
    } else {
      document.body.style.overflow = "";
    }
  });

  return (
    <Portal>
      <Presence>
        <Show when={props.isOpen}>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) props.onClose();
            }}
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.3, easing: [0.22, 1, 0.36, 1] }}
              class={`bg-white dark:bg-slate-900 w-full ${props.maxWidth || "max-w-lg"} ${props.class || ""} rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col`}
            >
              <div class="bg-gradient-to-r from-primary-600 to-secondary-500 p-8 text-center relative">
                <div class="flex items-center justify-center gap-3 mb-2">
                  {props.icon}
                  <h2 class="text-2xl font-black text-white">{props.title}</h2>
                </div>
                <button
                  onClick={() => props.onClose()}
                  class="absolute top-6 right-6 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <TbOutlineX size={20} />
                </button>
              </div>

              <div class="p-8">
                {props.children}
              </div>
            </Motion.div>
          </Motion.div>
        </Show>
      </Presence>
    </Portal>
  );
}

import { Show, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";
import { errorStore } from "../../stores/errorStore";
import { ErrorLayout } from "./ErrorLayout";
import { TbOutlineX } from "solid-icons/tb";

export function GlobalErrorModal() {
  const error = () => errorStore.error();

  // Handle Escape key globally when error is active
  createEffect(() => {
    if (error()) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") errorStore.clearError();
      };
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      onCleanup(() => {
        window.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      });
    }
  });

  return (
    <Portal>
      <Presence>
        <Show when={error()}>
          {(err) => {
            const code = err().code;
            return (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ "z-index": 2000 }}
                class="fixed inset-0 bg-white dark:bg-slate-950 overflow-y-auto"
              >
                {/* Close Button - Top Right */}
                <div class="fixed top-8 right-8 z-[2100]">
                  <button
                    onClick={() => errorStore.clearError()}
                    class="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all hover:scale-110 active:scale-95 shadow-xl border border-slate-200 dark:border-slate-800"
                  >
                    <TbOutlineX size={24} stroke-width={2.5} />
                  </button>
                </div>

                {/* The Animated Error Layout */}
                <div class="h-full w-full flex items-center justify-center overflow-y-auto">
                  <ErrorLayout code={code} isGlobalModal={true} />
                </div>
              </Motion.div>
            );
          }}
        </Show>
      </Presence>
    </Portal>
  );
}

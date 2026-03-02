import { For } from "solid-js";
import { TbOutlineTerminal, TbOutlineAlertCircle } from "solid-icons/tb";
import { Motion } from "solid-motionone";
import { ERROR_CONFIGS } from "../../config/errors";
import { isWideMode } from "../../shared/stores/layoutStore";
import { errorStore } from "../../shared/stores/errorStore";
import { showLoading, hideLoading } from "../../shared/stores/loadingStore";

import { fetchErrorInfo } from "../../shared/services/errorService";
import { RESOURCES } from "../../config/resources";

export default function ErrorShowcase() {
  const options = Object.keys(ERROR_CONFIGS).filter(key => key !== "default");

  return (
    <div class={`w-full mx-auto px-6 py-12 transition-all duration-300 ${isWideMode() ? 'max-w-[98%]' : 'max-w-6xl'}`}>
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        class="flex flex-col items-center text-center mb-16"
      >
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {RESOURCES.ERROR_PAGE.TITLE} <span class="text-transparent bg-clip-text bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">{RESOURCES.ERROR_PAGE.SUBTITLE}</span>
        </h1>

        <div class="mt-6 flex flex-col items-center gap-4">
          <p class="text-slate-500 dark:text-slate-400 font-medium">
            {RESOURCES.ERROR_PAGE.DESCRIPTION}
          </p>

          <button
            onClick={() => errorStore.setBackend(!errorStore.useBackend())}
            class={`flex items-center gap-3 px-6 py-2.5 rounded-2xl border-2 transition-all duration-300 font-bold text-xs uppercase tracking-widest ${errorStore.useBackend()
              ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300'
              }`}
          >
            <div class={`w-2 h-2 rounded-full ${errorStore.useBackend() ? 'bg-white animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
            {RESOURCES.ERROR_PAGE.BACKEND_API} {errorStore.useBackend() ? RESOURCES.ERROR_PAGE.ONLINE : RESOURCES.ERROR_PAGE.OFFLINE}
          </button>
        </div>
      </Motion.div>

      <div class={`grid gap-4 transition-all duration-500 ${isWideMode()
        ? 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10'
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
        }`}>
        <For each={options}>
          {(code, i) => (
            <Motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i() * 0.02 }}
              hover={{ y: -4, scale: 1.01 }}
              press={{ scale: 0.98 }}
              onClick={async () => {
                showLoading("hourglass", RESOURCES.ERROR_PAGE.SYNCING);

                const data = await fetchErrorInfo(code);

                hideLoading();
                errorStore.setError({
                  code: code,
                  message: ERROR_CONFIGS[code].description,
                  data: data || undefined
                });
              }}
              class="group relative flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-black/[0.02] dark:shadow-black/20 text-left transition-all hover:border-primary-500/50 hover:shadow-primary-500/10"
            >
              <div class="flex items-center justify-between w-full">
                <span class="text-2xl font-black font-mono text-slate-900 dark:text-white leading-none">
                  {code}
                </span>
                <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  {ERROR_CONFIGS[code].icon(20)}
                </div>
              </div>

              <div class="space-y-1">
                <h3 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {ERROR_CONFIGS[code].name}
                </h3>
              </div>
            </Motion.button>
          )}
        </For>
      </div>
    </div>
  );
}

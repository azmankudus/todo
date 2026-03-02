import { For, Show, createSignal, createResource, onCleanup, createEffect } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { TbOutlineArrowLeft, TbOutlineTerminal, TbOutlineAlertCircle } from "solid-icons/tb";
import { Motion } from "solid-motionone";
import { TextButton } from "./TextButton";
import { LoadingAnimation } from "./LoadingAnimation";
import { getErrorConfig } from "../../../config/errors";
import { isWideMode } from "../../stores/layoutStore";
import { DataModal } from "./DataModal";
import { ApiStatus } from "../../domain/ApiStatus";

import { ApiResponse } from "../../domain/ApiResponse";
import { fetchErrorInfo } from "../../services/errorService";
import { errorStore } from "../../stores/errorStore";
import { calculateClientDuration } from "../../utils/timeUtils";
import { RESOURCES } from "../../../config/resources";

interface ErrorLayoutProps {
  code: string | number;
  isGlobalModal?: boolean;
}

export function ErrorLayout(props: ErrorLayoutProps) {
  const config = () => getErrorConfig(props.code);

  // Reuse existing error data from store if it matches the current code to avoid double-fetching
  const preFetched = () => {
    const e = errorStore.error();
    if (e && e.data && String(e.code) === String(props.code)) return e.data;
    return null;
  };

  const [errorInfo] = createResource(() => props.code, async (code) => {
    const p = preFetched();
    if (p) return p;
    return fetchErrorInfo(code);
  }, {
    initialValue: preFetched() || undefined
  });

  const [showModal, setShowModal] = createSignal(false);
  const [clientDuration, setClientDuration] = createSignal<string | null>(null);
  const navigate = useNavigate();

  createEffect(() => {
    if (showModal() && errorInfo()?.start) {
      const update = () => {
        const s = errorInfo()?.start;
        if (s) setClientDuration(calculateClientDuration(s));
      };
      update();
      const interval = setInterval(update, 100);
      onCleanup(() => clearInterval(interval));
    } else {
      setClientDuration(null);
    }
  });

  const extendedErrorInfo = () => {
    const raw = errorInfo();
    if (!raw) return null;
    const data: any = { ...raw };
    if (clientDuration()) data["duration (client)"] = clientDuration();
    return data;
  };

  const columns = () => extendedErrorInfo() ? Object.keys(extendedErrorInfo()!) : [];

  const columnTypes = {
    timestamp: "TIMESTAMP",
    start: "TIMESTAMP"
  };

  const bgIcons = [
    { s: 2, x: '10%', y: '15%', r: 25 },
    { s: 1, x: '80%', y: '5%', r: -35 },
    { s: 3, x: '20%', y: '80%', r: 60 },
    { s: 1, x: '5%', y: '50%', r: -15 },
    { s: 2, x: '85%', y: '75%', r: 40 },
    { s: 1, x: '45%', y: '5%', r: -20 },
    { s: 3, x: '95%', y: '45%', r: 125 },
    { s: 1, x: '40%', y: '30%', r: 85 },
    { s: 2, x: '60%', y: '20%', r: -50 },
    { s: 1, x: '15%', y: '95%', r: 175 },
    { s: 2, x: '35%', y: '5%', r: 10 },
    { s: 1.5, x: '55%', y: '85%', r: -45 },
    { s: 2.5, x: '5%', y: '25%', r: 70 },
    { s: 1.2, x: '90%', y: '20%', r: -15 },
    { s: 2.2, x: '30%', y: '40%', r: 110 },
    { s: 1.8, x: '70%', y: '55%', r: -30 },
    { s: 2.8, x: '50%', y: '70%', r: 45 },
    { s: 1.1, x: '25%', y: '90%', r: 15 },
    { s: 2.4, x: '75%', y: '35%', r: -60 },
    { s: 1.6, x: '12%', y: '65%', r: 95 },
  ];

  return (
    <main
      class={`relative flex flex-col items-center justify-center min-h-[60vh] w-full px-6 sm:px-10 text-center py-4 overflow-hidden mx-auto transition-all duration-300 ${isWideMode() ? 'max-w-[98%]' : 'max-w-7xl'}`}
    >
      <Show when={props.code} fallback={
        <div class="flex flex-col items-center gap-4 opacity-50 grayscale transition-all duration-500">
          <div class="p-8 rounded-[2rem] bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700">
            <Motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <TbOutlineAlertCircle size={64} class="text-slate-400 dark:text-slate-600" />
            </Motion.div>
          </div>
          <div class="text-lg font-medium text-slate-500">{RESOURCES.ERROR_PAGE.SELECT_PREVIEW}</div>
        </div>
      }>
        <Show when={!errorInfo.loading}>
          {/* Scattered Background Icon Watermarks */}
          <div class="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
            <For each={bgIcons}>
              {(item) => (
                <div
                  class="absolute text-primary-500/30 dark:text-primary-400/20 transition-colors duration-700"
                  style={{
                    left: item.x,
                    top: item.y,
                    transform: `scale(${item.s}) rotate(${item.r}deg)`,
                    opacity: 0.3
                  }}
                >
                  {config().icon(48)}
                </div>
              )}
            </For>
          </div>

          <Motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1,
              easing: [0.34, 1.56, 0.64, 1]
            }}
            class="relative mb-0 flex flex-col items-center justify-center z-10"
          >
            {/* Flickering Bulb HTTP Code (Per Digit) */}
            <div
              class="flex items-center justify-center font-black text-primary-600 dark:text-primary-500 font-mono tracking-tighter leading-[0.75] relative z-10 select-none"
              style={{ "font-size": "min(20rem, 40vw)" }}
            >
              <For each={String(config().code).split('')}>
                {(digit, i) => (
                  <Motion.span
                    animate={{
                      opacity: [1, 0.8, 1, 0.4, 0.9, 0.2, 1],
                      filter: [
                        "brightness(1) drop-shadow(0 0 10px rgba(var(--color-primary-500), 0.4))",
                        "brightness(1.2) drop-shadow(0 0 20px rgba(var(--color-primary-500), 0.6))",
                        "brightness(0.8) drop-shadow(0 0 5px rgba(var(--color-primary-500), 0.2))",
                        "brightness(1.1) drop-shadow(0 0 15px rgba(var(--color-primary-500), 0.5))"
                      ]
                    }}
                    transition={{
                      duration: 5.0 + (Math.random() * 1.0),
                      repeat: Infinity,
                      easing: "linear"
                    }}
                  >
                    {digit}
                  </Motion.span>
                )}
              </For>
            </div>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            class="flex flex-col items-center z-20 w-full"
          >
            {/* Funny Repeating Animation moved here */}
            <Motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, -2, 2, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                easing: "ease-in-out"
              }}
              class="w-full flex justify-center"
            >
              <h1
                class="text-4xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight text-center leading-[1.1] transition-all duration-300 w-full"
              >
                {config().name}
              </h1>
            </Motion.div>

            <p
              class="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-4 text-center transition-all duration-300 mt-6 w-full max-w-5xl mb-10"
            >
              {config().description}
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            class="flex flex-col sm:flex-row gap-4 items-center z-20"
          >
            <TextButton
              size="lg"
              class={`px-8 min-w-[180px] rounded-2xl border-0 shadow-lg bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-primary-500/30`}
              onClick={() => {
                if (props.isGlobalModal) {
                  import("../../stores/errorStore").then(m => m.errorStore.clearError());
                } else {
                  navigate(-1);
                }
              }}
              icon={<TbOutlineArrowLeft size={20} />}
            >
              {RESOURCES.COMMON.BACK}
            </TextButton>

            <Show when={String(props.code) !== "404"}>
              <TextButton
                variant="outline"
                size="lg"
                class="px-8 min-w-[180px] rounded-2xl border-2 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                onClick={() => setShowModal(true)}
                icon={<TbOutlineTerminal size={20} />}
              >
                {RESOURCES.SQL.MORE_INFO}
              </TextButton>
            </Show>
          </Motion.div>

          <DataModal
            data={showModal() ? (extendedErrorInfo() || {
              status: ApiStatus.ERROR,
              message: RESOURCES.ERROR_PAGE.METADATA_UNAVAILABLE,
              code: String(props.code),
              trace_id: 'N/A',
              timestamp: new Date().toISOString()
            }) : null}
            columns={columns()}
            columnTypes={columnTypes}
            title={RESOURCES.ERROR_PAGE.APP_ERROR_DETAILS}
            icon={<TbOutlineTerminal size={20} class="text-red-600 dark:text-red-400" />}
            onClose={() => setShowModal(false)}
          />
        </Show>
      </Show>
    </main>
  );
}

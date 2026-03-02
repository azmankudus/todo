import { createEffect, onCleanup, For, Show, JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";
import { RESOURCES } from "../../../config/resources";
import { TextButton } from "./TextButton";
import { IconButton } from "./IconButton";
import { TbOutlineX, TbOutlineTableOptions } from "solid-icons/tb";

const isTimestamp = (type: string) => type && type.toUpperCase().includes("TIMESTAMP");

function TimestampDetail(props: { dateString: string }) {
  try {
    const d = new Date(props.dateString);
    if (isNaN(d.getTime())) return <span class="text-gray-500">{props.dateString}</span>;

    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'long' })} ${d.getFullYear()}`;
    const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

    const offsetMin = -d.getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const hrs = String(Math.floor(Math.abs(offsetMin) / 60)).padStart(2, '0');
    const mins = String(Math.abs(offsetMin) % 60).padStart(2, '0');
    const offset = `GMT${sign}${hrs}:${mins}`;

    return (
      <div class="flex flex-col gap-1 font-mono text-xs">
        <div><span class="text-gray-500 dark:text-slate-400">{RESOURCES.COMPONENTS.DATA_MODAL.DAY} :</span> <span class="text-gray-900 dark:text-white">{dayOfWeek}</span></div>
        <div><span class="text-gray-500 dark:text-slate-400">{RESOURCES.COMPONENTS.DATA_MODAL.DATE} :</span> <span class="text-gray-900 dark:text-white">{dateStr}</span></div>
        <div><span class="text-gray-500 dark:text-slate-400">{RESOURCES.COMPONENTS.DATA_MODAL.TIME} :</span> <span class="text-gray-900 dark:text-white">{timeStr}</span></div>
        <div><span class="text-gray-500 dark:text-slate-400">{RESOURCES.COMPONENTS.DATA_MODAL.TIMEZONE} :</span> <span class="text-gray-900 dark:text-white">{offset}</span></div>
      </div>
    );
  } catch (e) {
    return <span class="text-gray-500">{props.dateString}</span>;
  }
}

export interface DataModalProps {
  data: Record<string, any> | null;
  num?: number;
  columns: string[];
  columnTypes?: Record<string, string>;
  title?: string;
  icon?: any;
  footer?: JSX.Element;
  onClose: () => void;
}

export function DataModal(props: DataModalProps) {
  // Lock body scroll when modal is open
  createEffect(() => {
    if (props.data) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") props.onClose();
      };
      window.addEventListener("keydown", handleEscape);
      onCleanup(() => {
        window.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = '';
      });
    } else {
      document.body.style.overflow = '';
    }
  });

  return (
    <Portal>
      <Presence>
        <Show when={props.data}>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            class="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) props.onClose();
            }}
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, easing: [0.22, 1, 0.36, 1] }}
              class="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-w-2xl w-full flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div class="bg-gradient-to-r from-primary-600 to-secondary-500 py-5 px-6 shrink-0 relative">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-white/20 rounded-xl text-white">
                    {props.icon || <TbOutlineTableOptions size={20} />}
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-white uppercase tracking-tight leading-none mb-1">
                      {props.title || RESOURCES.COMPONENTS.DATA_MODAL.ENTRY_DETAILS}
                    </h3>
                    <Show when={props.num}>
                      <p class="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">{RESOURCES.COMPONENTS.DATA_MODAL.RECORD_IDENTIFIER} • #{props.num}</p>
                    </Show>
                  </div>
                </div>
                <button
                  onClick={() => props.onClose()}
                  class="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <TbOutlineX size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div class="overflow-y-auto custom-scrollbar p-8 grow space-y-6">
                <For each={props.columns}>
                  {(col: string) => {
                    const val = props.data![col];
                    const colType = props.columnTypes?.[col] || '';
                    return (
                      <div class="flex flex-col gap-2 group">
                        <div class="flex items-center justify-between">
                          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary-500 transition-colors">{col}</span>
                          <Show when={colType}>
                            <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wider">{colType}</span>
                          </Show>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 transition-all group-hover:border-primary-500/20 group-hover:bg-white dark:group-hover:bg-slate-800">
                          <Show when={val !== null} fallback={<span class="text-sm font-medium italic text-slate-400">{RESOURCES.COMPONENTS.DATA_MODAL.NOT_SPECIFIED}</span>}>
                            <Show when={isTimestamp(colType)} fallback={
                              <span class="text-sm font-semibold text-slate-700 dark:text-slate-200 break-words">{String(val)}</span>
                            }>
                              <div class="text-xs text-primary-600 dark:text-primary-400 font-mono mb-3 p-2 bg-primary-100/50 dark:bg-primary-900/20 rounded-lg border border-primary-200/50 dark:border-primary-800/50">{String(val)}</div>
                              <TimestampDetail dateString={String(val)} />
                            </Show>
                          </Show>
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>

              {/* Modal Footer */}
              <Show when={props.footer} fallback={
                <div class="p-6 shrink-0 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <TextButton variant="outline" size="sm" class="rounded-xl px-6" onClick={() => props.onClose()}>
                    {RESOURCES.COMPONENTS.DATA_MODAL.CLOSE_VIEW}
                  </TextButton>
                </div>
              }>
                <div class="p-6 shrink-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  {props.footer}
                </div>
              </Show>
            </Motion.div>
          </Motion.div>
        </Show>
      </Presence>
    </Portal>
  );
}

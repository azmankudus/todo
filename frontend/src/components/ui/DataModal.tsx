import { createEffect, onCleanup, For, Show, JSX } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion } from "solid-motionone";
import { TbOutlineTableOptions } from "solid-icons/tb";

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
        <div><span class="text-gray-500 dark:text-slate-400">Day :</span> <span class="text-gray-900 dark:text-white">{dayOfWeek}</span></div>
        <div><span class="text-gray-500 dark:text-slate-400">Date :</span> <span class="text-gray-900 dark:text-white">{dateStr}</span></div>
        <div><span class="text-gray-500 dark:text-slate-400">Time :</span> <span class="text-gray-900 dark:text-white">{timeStr}</span></div>
        <div><span class="text-gray-500 dark:text-slate-400">Timezone :</span> <span class="text-gray-900 dark:text-white">{offset}</span></div>
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
    } else {
      document.body.style.overflow = '';
    }
  });

  onCleanup(() => {
    document.body.style.overflow = '';
  });

  return (
    <Show when={props.data}>
      <Portal>
        <div
          class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) props.onClose(); }}
        >
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, easing: 'ease-out' }}
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
          >
            {/* Modal Header */}
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {props.icon || <TbOutlineTableOptions size={20} class="text-primary-600 dark:text-primary-400" />}
                {props.title || 'Details'}
                <Show when={props.num}>
                  <span class="text-sm font-mono px-2.5 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">#{props.num}</span>
                </Show>
              </h3>
              <button
                onClick={() => props.onClose()}
                class="p-2 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div class="overflow-y-auto custom-scrollbar px-6 py-4 divide-y divide-gray-100 dark:divide-slate-700/50">
              <For each={props.columns}>
                {(col: string) => {
                  const val = props.data![col];
                  const colType = props.columnTypes?.[col] || '';
                  return (
                    <div class="py-3 flex flex-col gap-1">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">{col}</span>
                        <Show when={colType}>
                          <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">{colType}</span>
                        </Show>
                      </div>
                      <Show when={val !== null} fallback={<span class="text-sm italic text-gray-400 dark:text-slate-500">null</span>}>
                        <Show when={isTimestamp(colType)} fallback={
                          <span class="text-sm text-gray-900 dark:text-white break-all whitespace-pre-wrap">{String(val)}</span>
                        }>
                          <div class="text-sm text-gray-900 dark:text-white font-mono mb-1 break-all">{String(val)}</div>
                          <div class="ml-2 pl-3 border-l-2 border-primary-300 dark:border-primary-700">
                            <TimestampDetail dateString={String(val)} />
                          </div>
                        </Show>
                      </Show>
                    </div>
                  );
                }}
              </For>
            </div>
            <Show when={props.footer}>
              <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 rounded-b-2xl">
                {props.footer}
              </div>
            </Show>
          </Motion.div>
        </div>
      </Portal>
    </Show>
  );
}

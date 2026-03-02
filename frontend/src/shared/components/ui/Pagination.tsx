import { For } from "solid-js";
import { RESOURCES } from "../../../config/resources";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDownload?: () => void;
  class?: string;
}

export function Pagination(props: PaginationProps) {
  const pageSizes = () => props.pageSizeOptions || [10, 25, 50, 100, 200];

  const handlePageInput = (value: string, fallback: HTMLInputElement) => {
    const val = parseInt(value);
    if (!isNaN(val) && val >= 1 && val <= props.totalPages) {
      props.onPageChange(val);
    } else {
      fallback.value = String(props.currentPage);
    }
  };

  return (
    <div class={`flex items-center justify-between px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 text-xs ${props.class || ''}`}>
      {/* Left: Total records */}
      <div class="text-gray-600 dark:text-slate-400 whitespace-nowrap">
        {RESOURCES.COMPONENTS.PAGINATION.TOTAL_RECORDS}: <span class="font-semibold text-gray-900 dark:text-white">{props.totalRows.toLocaleString()}</span>
      </div>

      {/* Center: Page navigation */}
      <div class="flex items-center gap-1">
        <button
          onClick={() => props.onPageChange(1)}
          disabled={props.currentPage <= 1}
          class="px-1.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-slate-300 transition-colors"
          title={RESOURCES.COMPONENTS.PAGINATION.FIRST_PAGE}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17-5-5 5-5" /><path d="m18 17-5-5 5-5" /></svg>
        </button>
        <button
          onClick={() => props.onPageChange(Math.max(1, props.currentPage - 1))}
          disabled={props.currentPage <= 1}
          class="px-1.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-slate-300 transition-colors"
          title={RESOURCES.COMPONENTS.PAGINATION.PREVIOUS_PAGE}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <div class="flex items-center gap-1 px-2">
          <input
            type="text"
            value={props.currentPage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handlePageInput((e.currentTarget as HTMLInputElement).value, e.currentTarget as HTMLInputElement);
            }}
            onBlur={(e) => handlePageInput((e.currentTarget as HTMLInputElement).value, e.currentTarget as HTMLInputElement)}
            class="w-10 text-center bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md px-1 py-0.5 text-xs text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
          />
          <span class="text-gray-400 dark:text-slate-500 font-medium">/ {props.totalPages}</span>
        </div>
        <button
          onClick={() => props.onPageChange(Math.min(props.totalPages, props.currentPage + 1))}
          disabled={props.currentPage >= props.totalPages}
          class="px-1.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-slate-300 transition-colors"
          title={RESOURCES.COMPONENTS.PAGINATION.NEXT_PAGE}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
        <button
          onClick={() => props.onPageChange(props.totalPages)}
          disabled={props.currentPage >= props.totalPages}
          class="px-1.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-slate-300 transition-colors"
          title={RESOURCES.COMPONENTS.PAGINATION.LAST_PAGE}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m13 17 5-5-5-5" /><path d="m6 17 5-5-5-5" /></svg>
        </button>
      </div>

      {/* Right: Row per page + download */}
      <div class="flex items-center gap-2 whitespace-nowrap">
        <span class="text-gray-500 dark:text-slate-400">{RESOURCES.COMPONENTS.PAGINATION.ROW_PER_PAGE}</span>
        <select
          value={props.pageSize}
          onChange={(e) => props.onPageSizeChange(parseInt(e.currentTarget.value))}
          class="bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-2 py-1 text-xs text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
        >
          <For each={pageSizes()}>
            {(size) => <option value={size}>{size}</option>}
          </For>
        </select>
        {props.onDownload && (
          <button
            onClick={() => props.onDownload?.()}
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title={RESOURCES.COMPONENTS.PAGINATION.DOWNLOAD_RESULTS}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

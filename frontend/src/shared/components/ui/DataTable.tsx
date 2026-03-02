import { For, Show } from "solid-js";
import { Motion } from "solid-motionone";
import { RESOURCES } from "../../../config/resources";
import { Pagination } from "./Pagination";

export interface DataTableColumn {
  name: string;
  type?: string;
}

export interface DataTableProps {
  columns: string[];
  columnTypes?: Record<string, string>;
  rows: any[];
  currentPage: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  pageSizeOptions?: number[];
  stickyTop?: string;
  columnWidth?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRowClick?: (row: any, rowNum: number) => void;
  onDownload?: () => void;
  renderCell?: (value: any, type: string, col: string) => any;
}

const defaultRenderCell = (val: any, _type: string) => {
  if (val === null) return <span class="text-gray-400 dark:text-slate-500 italic block truncate">{RESOURCES.COMPONENTS.DATA_TABLE.NULL_VALUE}</span>;
  return <span class="block truncate max-w-full">{String(val)}</span>;
};

export function DataTable(props: DataTableProps) {
  const colWidth = () => props.columnWidth || 250;
  const stickyTop = () => props.stickyTop || '75px';
  const cellRenderer = () => props.renderCell || defaultRenderCell;

  const syncScroll = (scrollLeft: number, excludeId?: string) => {
    const ids = ['data-table-header-inner', 'data-table-top-scrollbar', 'data-table-data-section'];
    for (const id of ids) {
      if (id === excludeId) continue;
      const el = document.getElementById(id);
      if (!el) continue;
      if (id === 'data-table-header-inner') {
        el.style.transform = `translateX(-${scrollLeft}px)`;
      } else {
        el.scrollLeft = scrollLeft;
      }
    }
  };

  return (
    <div>
      {/* Sticky block: pagination + scrollbar + header */}
      <div class="sticky z-30 rounded-t-xl" style={{ top: stickyTop() }}>
        {/* Pagination Bar */}
        <Pagination
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          totalRows={props.totalRows}
          pageSize={props.pageSize}
          pageSizeOptions={props.pageSizeOptions}
          onPageChange={props.onPageChange}
          onPageSizeChange={props.onPageSizeChange}
          onDownload={props.onDownload}
          class="rounded-t-xl"
        />

        {/* Horizontal Scrollbar */}
        <div
          id="data-table-top-scrollbar"
          class="overflow-x-auto custom-scrollbar bg-transparent"
          style={{ height: '8px' }}
          onScroll={(e) => syncScroll((e.currentTarget as HTMLElement).scrollLeft, 'data-table-top-scrollbar')}
        >
          <div style={{ width: `max(${props.columns.length * colWidth()}px, 100%)`, height: '1px' }}></div>
        </div>

        {/* Header Row */}
        <div class="overflow-hidden bg-primary-500/5 dark:bg-primary-500/10 border-b border-primary-500/20 backdrop-blur-sm shadow-sm ring-1 ring-black/5">
          <div
            id="data-table-header-inner"
            class="flex"
            style={{ "min-width": `${props.columns.length * colWidth()}px`, width: '100%' }}
          >
            {/* Row number header */}
            <div
              style={{ width: '60px', "min-width": '60px', "max-width": '60px' }}
              class="px-3 py-4 text-center border-r border-primary-500/10"
            >
              <div class="text-[10px] font-black text-primary-600/50 uppercase tracking-widest dark:text-primary-400/50">#</div>
            </div>
            <For each={props.columns}>
              {(col: string) => (
                <div
                  style={{ width: `${colWidth()}px`, "min-width": `${colWidth()}px`, flex: `1 1 ${colWidth()}px` }}
                  class="px-6 py-4 text-left border-r border-primary-500/10 last:border-r-0"
                >
                  <div class="text-[10px] font-black text-primary-600 uppercase tracking-[0.15em] dark:text-primary-400 truncate">{col}</div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div
        id="data-table-data-section"
        class="overflow-x-auto scrollbar-hide bg-white/50 dark:bg-slate-900/40"
        onScroll={(e) => syncScroll((e.currentTarget as HTMLElement).scrollLeft, 'data-table-data-section')}
      >
        <table
          class="table-fixed border-collapse"
          style={{ "min-width": `${props.columns.length * colWidth()}px`, width: '100%' }}
        >
          <tbody class="divide-y divide-gray-200 dark:divide-slate-800">
            <For each={props.rows}>
              {(row: any, i) => {
                const rowNum = () => (props.currentPage - 1) * props.pageSize + i() + 1;
                return (
                  <Motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i() * 0.03 }}
                    class="hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors cursor-pointer"
                    onClick={() => props.onRowClick?.(row, rowNum())}
                  >
                    <td
                      style={{ width: '60px', "min-width": '60px', "max-width": '60px' }}
                      class="px-3 py-4 text-center text-xs font-mono text-gray-400 dark:text-slate-500 border-r border-gray-100 dark:border-slate-800/50 select-none"
                    >
                      {rowNum()}
                    </td>
                    <For each={props.columns}>
                      {(col: string) => (
                        <td
                          style={{ width: `${colWidth()}px`, "min-width": `${colWidth()}px` }}
                          class="px-6 py-4 text-sm text-gray-800 dark:text-slate-200 border-r border-gray-100 dark:border-slate-800/50 last:border-r-0 overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                          {cellRenderer()(row[col], props.columnTypes?.[col] || '', col)}
                        </td>
                      )}
                    </For>
                  </Motion.tr>
                );
              }}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
}

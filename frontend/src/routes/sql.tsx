import { createSignal, createEffect, on, Show } from "solid-js";
import { ApiStatus } from "../domain/shared/ApiStatus";
import { Presence, Motion } from "solid-motionone";
import { TextButton } from "../components/ui/TextButton";
import { DataTable } from "../components/ui/DataTable";
import { DataModal } from "../components/ui/DataModal";
import { showLoading, hideLoading } from "../stores/loadingStore";
import { isWideMode } from "../stores/layoutStore";
import { apiClient, ApiResponse } from "../utils/api";
import { TbOutlinePlayerPlay, TbOutlineAlertCircle, TbOutlineEraser, TbOutlineTerminal } from "solid-icons/tb";
import { RESOURCES } from "../config/resources";

const API_URL = import.meta.env.VITE_API_URL + "/sql";

const renderCell = (val: any, _type: string) => {
  if (val === null) return <span class="text-gray-400 dark:text-slate-500 italic block truncate">null</span>;
  return <span class="block truncate max-w-full">{String(val)}</span>;
};

export default function SqlPage() {
  const [runCount, setRunCount] = createSignal(0);
  const [query, setQuery] = createSignal("select * from tb_todo;");
  const [result, setResult] = createSignal<any>(null);
  const [isLoading, setIsLoading] = createSignal(false);
  const [errorResponse, setErrorResponse] = createSignal<ApiResponse | null>(null);
  const [showErrorModal, setShowErrorModal] = createSignal(false);
  const error = () => errorResponse()?.message || null;
  const flattenedErrorResponse = () => {
    const res = errorResponse();
    if (!res) return null;
    const { details, ...rest } = res;
    return {
      ...rest,
      ...(details && typeof details === 'object' ? details : { details })
    };
  };
  const [selectedRow, setSelectedRow] = createSignal<any>(null);
  const [selectedRowNum, setSelectedRowNum] = createSignal(0);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(10);

  const totalRows = () => result()?.totalRows || 0;
  const totalPages = () => Math.max(1, Math.ceil(totalRows() / pageSize()));

  const fetchPage = async (page: number, size: number) => {
    if (!query().trim()) return;

    setIsLoading(true);
    setErrorResponse(null);
    showLoading("database", "Executing Query...");
    try {
      const data = await apiClient("/sql", {
        method: "POST",
        body: JSON.stringify({ query: query(), page, size }),
      });

      console.log("SQL Response data:", data);
      if (data.status === ApiStatus.SUCCESS && data.details?.result) {
        setResult(data.details.result);
      } else {
        setErrorResponse(data);
      }
    } catch (err: any) {
      setErrorResponse({
        status: "ERROR",
        message: err.message || "Failed to execute query",
        details: err
      } as any);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const executeQuery = async (e: Event) => {
    e.preventDefault();
    if (!query().trim()) return;
    setCurrentPage(1);
    setRunCount(c => c + 1);
    await fetchPage(1, pageSize());
  };

  // Re-fetch when page or pageSize changes (skip initial run — executeQuery handles first load)
  createEffect(on(
    () => [currentPage(), pageSize()],
    ([page, size]) => {
      if (result()) {
        fetchPage(page as number, size as number);
      }
    },
    { defer: true }
  ));

  return (
    <main class={`mx-auto px-4 py-12 transition-all duration-300 w-full ${isWideMode() ? 'max-w-[95%]' : 'max-w-5xl'}`}>
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        class="text-center mb-10"
      >
        <h1 class="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500 mb-2">SQL Explorer</h1>
        <p class="text-gray-500 dark:text-slate-400 text-lg">Query your data directly.</p>
      </Motion.div>

      <div class="w-full">
        <Motion.form
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={executeQuery}
          class="flex flex-col gap-4"
        >
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between px-1">
              <label class="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">SQL Query</label>
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700/50">Ctrl + Enter to execute</span>
            </div>
            <textarea
              class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm font-mono min-h-[160px] resize-y focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:ring-slate-600 transition-colors shadow-sm"
              placeholder={RESOURCES.PLACEHOLDERS.SQL_QUERY}
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                  e.preventDefault();
                  executeQuery(e);
                }
              }}
            />
          </div>
          <div class="flex gap-3 justify-center">
            <TextButton type="submit" variant="solid" size="sm" class="shadow-md" disabled={isLoading()} icon={<TbOutlinePlayerPlay size={16} />}>
              {isLoading() ? "Executing..." : "Execute"}
            </TextButton>
            <TextButton type="button" variant="outline" size="sm" onClick={() => { setQuery(''); setResult(null); setErrorResponse(null); }} icon={<TbOutlineEraser size={16} />}>
              Clear
            </TextButton>
          </div>
        </Motion.form>

        <Presence>
          <Show when={error()}>
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              class="mt-4 flex items-center justify-between p-4 bg-red-100 border border-red-200 text-red-800 rounded-2xl dark:bg-red-800/20 dark:border-red-900 dark:text-red-500 shadow-sm"
            >
              <div class="flex items-center">
                <TbOutlineAlertCircle size={20} class="mr-2 shrink-0" />
                <p class="text-sm font-medium">{error()}</p>
              </div>
              <TextButton
                variant="outline"
                size="sm"
                class="ml-4 h-8 px-4 text-xs font-bold border-red-200 dark:border-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 rounded-xl"
                onClick={() => setShowErrorModal(true)}
                icon={<TbOutlineTerminal size={14} />}
              >
                More Info
              </TextButton>
            </Motion.div>
          </Show>
        </Presence>

        <Show when={result()}>
          <Presence exitBeforeEnter>
            <Show when={runCount()}>
              {(_) => (
                <Motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, easing: "ease-out" }}
                  class="mt-8 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-slate-950/50 bg-gray-50 dark:bg-slate-900 transition-colors"
                >
                  <Show when={result()?.columns?.length > 0} fallback={<div class="p-6 text-center text-gray-500 dark:text-slate-400">Query executed successfully with no results.</div>}>
                    <DataTable
                      columns={result().columns}
                      columnTypes={result().columnTypes}
                      rows={result().rows}
                      currentPage={currentPage()}
                      totalPages={totalPages()}
                      totalRows={totalRows()}
                      pageSize={pageSize()}
                      pageSizeOptions={[10, 25, 50, 100, 200]}
                      stickyTop="75px"
                      onPageChange={(page) => setCurrentPage(page)}
                      onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                      onRowClick={(row, rowNum) => { setSelectedRow(row); setSelectedRowNum(rowNum); }}
                      onDownload={() => { /* TODO: implement download */ }}
                      renderCell={renderCell}
                    />
                  </Show>
                </Motion.div>
              )}
            </Show>
          </Presence>
        </Show>

        {/* Row Detail Modal */}
        <DataModal
          data={selectedRow()}
          num={selectedRowNum()}
          columns={result()?.columns || []}
          columnTypes={result()?.columnTypes}
          onClose={() => setSelectedRow(null)}
        />

        {/* Error Detail Modal */}
        <DataModal
          data={showErrorModal() ? flattenedErrorResponse() : null}
          columns={flattenedErrorResponse() ? Object.keys(flattenedErrorResponse()!) : []}
          title="SQL Execution Error Details"
          icon={<TbOutlineTerminal size={20} class="text-red-600 dark:text-red-400" />}
          onClose={() => setShowErrorModal(false)}
        />
      </div>
    </main >
  );
}

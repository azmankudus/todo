import { createSignal, For, Show } from "solid-js";
import { Play, CircleAlert } from "lucide-solid";
import { Button } from "../components/ui/Button";

const API_URL = import.meta.env.VITE_API_URL + "/sql";

export default function SqlPage() {
  const [query, setQuery] = createSignal("select * from todo;");
  const [result, setResult] = createSignal<any>(null);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const executeQuery = async (e: Event) => {
    e.preventDefault();
    if (!query().trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResult(data);
        } else {
          setError(data.errorMessage || "An error occurred");
        }
      } else {
        setError(`HTTP Error: ${response.status}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to execute query");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main class="w-full max-w-5xl mx-auto px-4 py-12">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 mb-2">SQL Explorer</h1>
        <p class="text-gray-500 dark:text-slate-400 text-lg">Query your data directly.</p>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-slate-950/50 transition-colors">
        <form onSubmit={executeQuery} class="flex flex-col gap-4">
          <textarea
            class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm font-mono min-h-[160px] resize-y focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:focus:ring-slate-600 transition-colors"
            placeholder="SELECT * FROM todo"
            value={query()}
            onInput={(e) => setQuery(e.currentTarget.value)}
          />
          <Button type="submit" variant="solid" size="md" class="w-full shadow-md" disabled={isLoading()}>
            <Play size={20} class="mr-2" />
            {isLoading() ? "Executing..." : "Execute Query"}
          </Button>
        </form>

        <Show when={error()}>
          <div class="mt-4 flex items-center p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg dark:bg-red-800/20 dark:border-red-900 dark:text-red-500">
            <CircleAlert size={20} class="mr-2 shrink-0" />
            <p class="text-sm font-medium">{error()}</p>
          </div>
        </Show>

        <Show when={result()}>
          <div class="mt-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm bg-gray-50 dark:bg-slate-900 transition-colors">
            <Show when={result().columns && result().columns.length > 0} fallback={<div class="p-6 text-center text-gray-500 dark:text-slate-400">Query executed successfully with no results.</div>}>
              <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                <thead class="bg-gray-100 dark:bg-slate-800">
                  <tr>
                    <For each={result().columns}>
                      {(col: string) => <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-slate-400">{col}</th>}
                    </For>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-slate-800">
                  <For each={result().rows}>
                    {(row: any) => (
                      <tr class="hover:bg-white dark:hover:bg-slate-800 transition-colors bg-white dark:bg-transparent">
                        <For each={result().columns}>
                          {(col: string) => (
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-slate-200">
                              {row[col] !== null ? String(row[col]) : <span class="text-gray-400 dark:text-slate-500 italic">null</span>}
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </Show>
          </div>
        </Show>
      </div>
    </main>
  );
}

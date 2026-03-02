import { createSignal, onMount, For, Show, createEffect } from "solid-js";
import { ApiStatus } from "../../shared/domain/ApiStatus";
import { createStore, reconcile } from "solid-js/store";
import { TbOutlineTrash, TbOutlinePlus } from "solid-icons/tb";
import { Motion } from "solid-motionone";
import { TransitionGroup } from "solid-transition-group";
import { TextButton } from "../../shared/components/ui/TextButton";
import { TextField } from "../../shared/components/ui/TextField";
import { Checkbox } from "../../shared/components/ui/Checkbox";
import { PrioritySelect, PriorityBadge } from "../../shared/components/ui/Priority";
import { showLoading, hideLoading } from "../../shared/stores/loadingStore";
import { isWideMode } from "../../shared/stores/layoutStore";
import { apiClient } from "../../shared/utils/api";
import { DataModal } from "../../shared/components/ui/DataModal";
import { Pagination } from "../../shared/components/ui/Pagination";
import { RESOURCES } from "../../config/resources";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: number;
  createdAt: string;
  completedAt?: string;
}

export default function TodoPage() {
  const [todos, setTodos] = createStore<Todo[]>([]);
  const [inputValue, setInputValue] = createSignal("");
  const [priorityValue, setPriorityValue] = createSignal(5); // Default to Priority 5
  const [isLoading, setIsLoading] = createSignal(true);
  const [selectedTodo, setSelectedTodo] = createSignal<Todo | null>(null);
  const [selectedTodoIdx, setSelectedTodoIdx] = createSignal<number>(0);

  // Pagination states
  const [currentPage, setCurrentPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(10);
  const [totalRows, setTotalRows] = createSignal(0);
  const [totalPages, setTotalPages] = createSignal(0);

  const fetchTodos = async (page: number, size: number) => {
    showLoading("spinner", RESOURCES.TODO.LOADING_TASKS);
    try {
      const data = await apiClient(`/todo?page=${page - 1}&size=${size}`);
      if (data.status === ApiStatus.SUCCESS) {
        setTodos(reconcile(data.details.todos));
        setTotalRows(data.details.totalRows || 0);
        setTotalPages(data.details.totalPages || 0);
        setCurrentPage(data.details.currentPage || 1);
        setPageSize(data.details.pageSize || 10);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  onMount(() => {
    fetchTodos(currentPage(), pageSize());
  });

  createEffect(() => {
    // Re-fetch when page or size changes
    fetchTodos(currentPage(), pageSize());
  });

  const addTodo = async (e: Event) => {
    e.preventDefault();
    if (!inputValue().trim()) return;
    showLoading("pencil", RESOURCES.TODO.ADDING);

    try {
      const data = await apiClient("/todo", {
        method: "POST",
        body: JSON.stringify({ title: inputValue(), completed: false, priority: priorityValue() }),
      });

      if (data.status === ApiStatus.SUCCESS) {
        // After adding, we want the user to see the new task (sorted by newest)
        setCurrentPage(1);
        fetchTodos(1, pageSize());
        setInputValue("");
        setPriorityValue(5); // Reset to default Priority 5
      }
    } catch (error) {
      console.error("Add error:", error);
    } finally {
      hideLoading();
    }
  };

  const toggleTodo = async (id: number, currentStatus: boolean, title: string, priority: number) => {
    setTodos(todo => todo.id === id, "completed", !currentStatus);
    if (currentStatus) {
      showLoading("undo", RESOURCES.TODO.REOPENING);
    } else {
      showLoading("check", RESOURCES.TODO.COMPLETING);
    }
    try {
      const data = await apiClient(`/todo/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, completed: !currentStatus, priority }),
      });
      if (data.status !== ApiStatus.SUCCESS) throw new Error(data.message || "Update failed");
    } catch (error) {
      setTodos(todo => todo.id === id, "completed", currentStatus);
    } finally {
      hideLoading();
    }
  };

  const deleteTodo = async (id: number) => {
    showLoading("trash", RESOURCES.TODO.DELETING);
    try {
      const data = await apiClient(`/todo/${id}`, { method: "DELETE" });
      if (data.status === ApiStatus.SUCCESS) {
        setTodos(t => t.filter(todo => todo.id !== id));
      } else {
        throw new Error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      hideLoading();
    }
  };


  return (
    <main class={`mx-auto px-4 py-6 transition-all duration-300 w-full ${isWideMode() ? 'max-w-[95%]' : 'max-w-3xl'}`}>
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        class="text-center mb-10"
      >
        <h1 class="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500 mb-2">{RESOURCES.TODO.TITLE}</h1>
        <p class="text-gray-500 dark:text-slate-400 text-lg">{RESOURCES.TODO.SUBTITLE}</p>
      </Motion.div>

      <div class="w-full">
        <Motion.form
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={addTodo}
          class="flex gap-x-3 mb-8 relative z-50"
        >
          <TextField
            placeholder={RESOURCES.PLACEHOLDERS.TODO_TASK}
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            class="focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:text-white"
          />
          <PrioritySelect value={priorityValue()} onChange={setPriorityValue} />
          <TextButton type="submit" variant="solid" class="px-6 shrink-0 shadow-md" icon={<TbOutlinePlus size={20} />}>
            {RESOURCES.TODO.ADD_TASK}
          </TextButton>
        </Motion.form>

        <div class="sticky top-[65px] z-30 mb-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-300">
          <Pagination
            currentPage={currentPage()}
            totalPages={totalPages()}
            totalRows={totalRows()}
            pageSize={pageSize()}
            pageSizeOptions={[10, 25, 50, 100]}
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
          />
        </div>

        <Show when={isLoading()}>
          <div class="flex justify-center items-center py-12 text-primary-600 animate-pulse font-medium">{RESOURCES.TODO.LOADING_TASK_MESSAGE}</div>
        </Show>

        <Show when={!isLoading() && todos.length === 0}>
          <div class="text-center text-slate-500 dark:text-slate-400 py-12 italic border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">{RESOURCES.TODO.NO_TASKS}</div>
        </Show>

        <ul class="flex flex-col gap-y-3">
          <TransitionGroup
            onEnter={(el, done) => {
              const idx = parseInt(el.getAttribute('data-index') || "0", 10);
              const a = el.animate(
                [
                  { opacity: 0, transform: "translate(-30px, -30px)" },
                  { opacity: 1, transform: "translate(0, 0)" }
                ],
                {
                  duration: 450,
                  delay: idx * 50,
                  easing: "ease-out",
                  fill: "both"
                }
              );
              a.onfinish = done;
            }}
            onExit={(el, done) => {
              const a = el.animate(
                [
                  { opacity: 1, transform: "scale(1)" },
                  { opacity: 0, transform: "scale(0.95)" }
                ],
                { duration: 250, easing: "ease-in" }
              );
              a.onfinish = done;
            }}
          >
            <For each={todos}>
              {(todo, i) => (
                <li
                  data-index={i()}
                  class={`group flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-all duration-300 cursor-pointer hover:border-primary-500/50 hover:shadow-md ${todo.completed ? 'opacity-50' : ''}`}
                  onClick={() => {
                    setSelectedTodo(todo);
                    setSelectedTodoIdx(i() + 1);
                  }}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed, todo.title, todo.priority)}
                      class="w-7 h-7 rounded-md mr-5 shrink-0 transition-transform hover:scale-110"
                    />
                  </div>
                  <span class={`flex-1 text-lg font-medium transition-colors ${todo.completed ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-800 dark:text-slate-100'}`}>
                    {todo.title}
                  </span>
                  <div class="mr-4">
                    <PriorityBadge priority={todo.priority} showLabel={true} />
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Motion.button
                      hover={{ scale: 1.15, rotate: 5 }}
                      press={{ scale: 0.9 }}
                      transition={{ duration: 0.1 }}
                      class="p-2 inline-flex items-center justify-center rounded-xl text-red-500 bg-red-50 dark:bg-red-500/10 dark:hover:bg-red-600 transition-colors opacity-100 hover:text-white"
                      onClick={() => deleteTodo(todo.id)}
                      aria-label={RESOURCES.TODO.DELETE_ARIA}
                    >
                      <TbOutlineTrash size={18} />
                    </Motion.button>
                  </div>
                </li>
              )}
            </For>
          </TransitionGroup>
        </ul>

        <DataModal
          data={selectedTodo()}
          num={selectedTodoIdx()}
          columns={["id", "title", "completed", "priority", "createdAt", "completedAt"]}
          title={RESOURCES.TODO.TASK_DETAILS}
          onClose={() => setSelectedTodo(null)}
          footer={
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <Checkbox
                  checked={selectedTodo()?.completed || false}
                  onChange={() => {
                    const todo = selectedTodo()!;
                    toggleTodo(todo.id, todo.completed, todo.title, todo.priority);
                  }}
                  class="w-8 h-8 rounded-lg transition-transform hover:scale-110"
                />
              </div>
              <Motion.button
                hover={{ scale: 1.15, rotate: 5 }}
                press={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                class="p-2.5 inline-flex items-center justify-center rounded-xl text-red-500 bg-red-50 dark:bg-red-500/10 dark:hover:bg-red-600 transition-colors hover:text-white"
                onClick={async () => {
                  const todo = selectedTodo()!;
                  await deleteTodo(todo.id);
                  setSelectedTodo(null);
                }}
                aria-label={RESOURCES.TODO.DELETE_ARIA}
              >
                <TbOutlineTrash size={22} />
              </Motion.button>
            </div>
          }
        />
      </div>
    </main>
  );
}


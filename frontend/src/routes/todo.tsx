import { createSignal, onMount, For, Show } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { Trash2, Plus } from "lucide-solid";
import { Motion } from "solid-motionone";
import { TransitionGroup } from "solid-transition-group";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { Checkbox } from "../components/ui/Checkbox";
import { PrioritySelect, PriorityBadge } from "../components/ui/Priority";
import { showLoading, hideLoading } from "../stores/loadingStore";
import { isWideMode } from "../stores/layoutStore";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  createdAt: string;
  completedAt?: string;
}

const API_URL = import.meta.env.VITE_API_URL + "/todo";

export default function TodoPage() {
  const [todos, setTodos] = createStore<Todo[]>([]);
  const [inputValue, setInputValue] = createSignal("");
  const [priorityValue, setPriorityValue] = createSignal(5); // Default to Priority 5
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    showLoading("spinner", "Loading tasks...");
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        setTodos(reconcile(await response.json()));
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  });

  const addTodo = async (e: Event) => {
    e.preventDefault();
    if (!inputValue().trim()) return;
    showLoading("pencil", "Adding...");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: inputValue(), completed: false, priority: priorityValue() }),
      });

      if (response.ok) {
        setTodos(todos.length, await response.json());
        setInputValue("");
        setPriorityValue(5); // Reset to default Priority 5
      }
    } catch (error) {
      console.error("Add error:", error);
    } finally {
      hideLoading();
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean, title: string, priority: number) => {
    setTodos(todo => todo.id === id, "completed", !currentStatus);
    if (currentStatus) {
      showLoading("undo", "Reopening...");
    } else {
      showLoading("check", "Completing...");
    }
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: !currentStatus, priority }),
      });
    } catch (error) {
      setTodos(todo => todo.id === id, "completed", currentStatus);
    } finally {
      hideLoading();
    }
  };

  const deleteTodo = async (id: string) => {
    const previousTodos = [...todos];
    setTodos(t => t.filter(todo => todo.id !== id));
    showLoading("trash", "Deleting...");
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } catch (error) {
      setTodos(reconcile(previousTodos));
    } finally {
      hideLoading();
    }
  };


  return (
    <main class={`mx-auto px-4 py-12 transition-all duration-300 w-full ${isWideMode() ? 'max-w-[95%]' : 'max-w-3xl'}`}>
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        class="text-center mb-10"
      >
        <h1 class="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500 mb-2">My Tasks</h1>
        <p class="text-gray-500 dark:text-slate-400 text-lg">Stay organized and productive.</p>
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
            placeholder="What needs to be done?"
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            class="focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:text-white"
          />
          <PrioritySelect value={priorityValue()} onChange={setPriorityValue} />
          <Button type="submit" variant="solid" class="px-6 shrink-0 shadow-md">
            <Plus size={20} /> Add
          </Button>
        </Motion.form>

        <Show when={isLoading()}>
          <div class="flex justify-center items-center py-12 text-primary-600 animate-pulse font-medium">Loading your tasks...</div>
        </Show>

        <Show when={!isLoading() && todos.length === 0}>
          <div class="text-center text-slate-500 dark:text-slate-400 py-12 italic border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">No tasks yet. Enjoy your day!</div>
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
                  class={`group flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm transition-colors duration-300 ${todo.completed ? 'opacity-50' : ''}`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed, todo.title, todo.priority)}
                    class="w-7 h-7 rounded-md mr-5 shrink-0 transition-transform hover:scale-110"
                  />
                  <span class={`flex-1 text-lg font-medium transition-colors ${todo.completed ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-800 dark:text-slate-100'}`}>
                    {todo.title}
                  </span>
                  <div class="mr-4">
                    <PriorityBadge priority={todo.priority} showLabel={true} />
                  </div>
                  <Motion.button
                    hover={{ scale: 1.15, rotate: 5 }}
                    press={{ scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                    class="p-2 inline-flex items-center justify-center rounded-xl text-red-500 bg-red-50 dark:bg-red-500/10 dark:hover:bg-red-600 transition-colors opacity-100 hover:text-white"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Delete todo"
                  >
                    <Trash2 size={18} />
                  </Motion.button>
                </li>
              )}
            </For>
          </TransitionGroup>
        </ul>
      </div>
    </main>
  );
}


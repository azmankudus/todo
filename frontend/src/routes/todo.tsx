import { createSignal, onMount, For, Show } from "solid-js";
import { Trash2, Plus, Database } from "lucide-solid";
import { A } from "@solidjs/router";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { Checkbox } from "../components/ui/Checkbox";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL + "/todo";

export default function TodoPage() {
  const [todos, setTodos] = createSignal<Todo[]>([]);
  const [inputValue, setInputValue] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        setTodos(await response.json());
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  });

  const addTodo = async (e: Event) => {
    e.preventDefault();
    if (!inputValue().trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: inputValue(), completed: false }),
      });

      if (response.ok) {
        setTodos([...todos(), await response.json()]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean, title: string) => {
    setTodos(todos().map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: !currentStatus }),
      });
    } catch (error) {
      setTodos(todos().map(t => t.id === id ? { ...t, completed: currentStatus } : t));
    }
  };

  const deleteTodo = async (id: string) => {
    const previousTodos = [...todos()];
    setTodos(todos().filter(t => t.id !== id));
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } catch (error) {
      setTodos(previousTodos);
    }
  };

  return (
    <main class="w-full max-w-3xl mx-auto px-4 py-12">
      <div class="text-center mb-10">
        <h1 class="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 mb-2">My Tasks</h1>
        <p class="text-gray-500 dark:text-slate-400 text-lg">Stay organized and productive.</p>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 transition-colors">
        <form onSubmit={addTodo} class="flex gap-x-3 mb-8">
          <TextField
            placeholder="What needs to be done?"
            value={inputValue()}
            onInput={(e) => setInputValue(e.currentTarget.value)}
            class="focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          />
          <Button type="submit" variant="solid" class="px-6 shrink-0 shadow-md transform hover:scale-105 transition-transform">
            <Plus size={20} /> Add
          </Button>
        </form>

        <Show when={!isLoading()} fallback={<div class="flex justify-center items-center py-12 text-blue-600 animate-pulse font-medium">Loading your tasks...</div>}>
          <ul class="flex flex-col gap-y-3">
            <For each={todos()} fallback={<div class="text-center text-slate-500 dark:text-slate-400 py-12 italic border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">No tasks yet. Enjoy your day!</div>}>
              {(todo) => (
                <li class={`group flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md ${todo.completed ? 'opacity-60' : ''}`}>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed, todo.title)}
                    class="w-7 h-7 rounded-md mr-5 shrink-0 transition-transform hover:scale-110"
                  />
                  <span class={`flex-1 text-xl font-medium transition-colors ${todo.completed ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-900 dark:text-slate-100'}`}>
                    {todo.title}
                  </span>
                  <button
                    class="p-2 inline-flex items-center justify-center rounded-lg text-red-500 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-600 transition-all transform hover:scale-110"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Delete todo"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </div>
    </main>
  );
}

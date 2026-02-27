import { A } from "@solidjs/router";
import { SquareCheck, Database, ArrowRight, Sun } from "lucide-solid";
import { Button } from "../components/ui/Button";

export default function Home() {
  return (
    <main class="w-full max-w-4xl mx-auto px-4 py-24 text-center">
      <div class="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 animate-bounce transition-colors">
        <SquareCheck size={48} />
      </div>
      <h1 class="text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 transition-colors">
        Organize your life with <span class="text-blue-600">Todo Vibe</span>
      </h1>
      <p class="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 transition-colors">
        A premium task management experience built with Micronaut, DuckDB, and SolidJS.
        Track your goals, explore your data, and stay in the flow.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <A href="/todo">
          <Button size="lg" class="px-8 shadow-lg shadow-blue-500/30">
            Get Started <ArrowRight class="ml-2" size={20} />
          </Button>
        </A>
        <A href="/sql">
          <Button variant="outline" size="lg" class="px-8">
            <Database class="mr-2 text-slate-500" size={20} /> SQL Explorer
          </Button>
        </A>
      </div>

      <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
          <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 mb-6 transition-colors">
            <SquareCheck size={24} />
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Task Management</h3>
          <p class="text-slate-500 dark:text-slate-400 transition-colors">Streamlined interface for creating and managing your daily tasks with ease.</p>
        </div>
        <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
          <div class="w-12 h-12 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center text-pink-600 mb-6 transition-colors">
            <Sun size={24} />
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Adaptive Theme</h3>
          <p class="text-slate-500 dark:text-slate-400 transition-colors">Seamlessly switch between Light and Dark modes to suit your work environment.</p>
        </div>
        <div class="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
          <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 mb-6 transition-colors">
            <Database size={24} />
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">SQL Power</h3>
          <p class="text-slate-500 dark:text-slate-400 transition-colors">Advanced users can query the underlying DuckDB database directly using raw SQL.</p>
        </div>
      </div>
    </main>
  );
}

import { A } from "@solidjs/router";
import { SquareCheck, Database, ArrowRight, Sun } from "lucide-solid";
import { Motion } from "solid-motionone";
import { Button } from "../components/ui/Button";

export default function Home() {
  return (
    <main class="w-full max-w-4xl mx-auto px-4 py-24 text-center">
      <Motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, easing: "ease-out" }}
      >
        <Motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, easing: "ease-out" }}
          class="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-500 transition-colors"
        >
          <SquareCheck size={48} />
        </Motion.div>
        <h1 class="text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 transition-colors">
          Organize your life with <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 transition-all">Todo Vibe</span>
        </h1>
        <p class="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 transition-colors">
          A premium task management experience built with Micronaut, DuckDB, and SolidJS.
          Track your goals, explore your data, and stay in the flow.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <A href="/todo">
            <Button size="lg" class="px-8 shadow-lg shadow-primary-500/30 bg-gradient-to-r from-primary-600 to-secondary-500 border-0">
              Get Started <ArrowRight class="ml-2" size={20} />
            </Button>
          </A>
          <A href="/sql">
            <Button variant="outline" size="lg" class="px-8 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Database class="mr-2 text-slate-500" size={20} /> SQL Explorer
            </Button>
          </A>
        </div>
      </Motion.div>

      <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: SquareCheck, title: "Task Management", desc: "Streamlined interface for creating and managing your daily tasks with ease.", bgFrom: "from-primary-600", bgTo: "to-secondary-500", shadow: "shadow-primary-500/20" },
          { icon: Sun, title: "Adaptive Theme", desc: "Seamlessly switch between Light and Dark modes to suit your work environment.", bgFrom: "from-pink-500", bgTo: "to-rose-400", shadow: "shadow-pink-500/20" },
          { icon: Database, title: "SQL Power", desc: "Advanced users can query the underlying DuckDB database directly using raw SQL.", bgFrom: "from-emerald-500", bgTo: "to-secondary-400", shadow: "shadow-emerald-500/20" }
        ].map((feature, i) => (
          <Motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.6, easing: [0.22, 1, 0.36, 1] }}
            hover={{ scale: 1.03, y: -5 }}
            class="relative group cursor-default p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            <div class={`absolute inset-0 bg-gradient-to-br ${feature.bgFrom} ${feature.bgTo} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-15 transition-opacity duration-500 ease-out`} />
            <div class={`absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 group-hover:ring-black/10 dark:group-hover:ring-white/20 rounded-3xl transition-colors duration-500`} />

            <div class={`relative w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:text-white group-hover:shadow-lg ${feature.shadow} transition-all duration-500 ease-out mb-6`}>
              <div class={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bgFrom} ${feature.bgTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out`} />
              <div class="relative z-10"><feature.icon size={26} /></div>
            </div>

            <h3 class="relative text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-slate-900 dark:group-hover:from-white dark:group-hover:to-slate-200 transition-colors duration-300">{feature.title}</h3>
            <p class="relative text-slate-500 dark:text-slate-400 leading-relaxed transition-colors duration-300 group-hover:text-slate-700 dark:group-hover:text-slate-300">{feature.desc}</p>
          </Motion.div>
        ))}
      </div>
    </main>
  );
}


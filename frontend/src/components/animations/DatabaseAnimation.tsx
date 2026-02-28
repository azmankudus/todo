import { Database } from "lucide-solid";

export function DatabaseAnimation() {
  return (
    <div class="relative text-primary-500 dark:text-primary-400">
      <div class="animate-[dbPulse_1.5s_ease-in-out_infinite]">
        <Database size={48} />
      </div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-10 h-0.5 bg-gradient-to-r from-transparent via-secondary-400 to-transparent animate-[scanLine_1.5s_ease-in-out_infinite] rounded-full" />
      </div>
    </div>
  );
}

import { LoaderCircle } from "lucide-solid";

export function SpinnerAnimation() {
  return (
    <div class="relative w-16 h-16 flex items-center justify-center">
      <div class="absolute text-primary-500 dark:text-primary-400 animate-spin">
        <LoaderCircle size={52} />
      </div>
      <div class="absolute text-secondary-400 dark:text-secondary-500 animate-[spin_1.5s_linear_infinite_reverse] opacity-40">
        <LoaderCircle size={36} />
      </div>
    </div>
  );
}

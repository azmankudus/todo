import { Hourglass } from "lucide-solid";

export function HourglassAnimation() {
  return (
    <div class="animate-[hourglassFlip_2s_ease-in-out_infinite] text-primary-500 dark:text-primary-400">
      <Hourglass size={48} />
    </div>
  );
}

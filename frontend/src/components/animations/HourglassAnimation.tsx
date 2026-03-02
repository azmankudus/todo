import { TbOutlineHourglass } from "solid-icons/tb";

export function HourglassAnimation() {
  return (
    <div class="animate-[hourglassFlip_2s_ease-in-out_infinite] text-primary-500 dark:text-primary-400">
      <TbOutlineHourglass size={48} />
    </div>
  );
}

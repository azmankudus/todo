import { TbOutlineCircleCheck } from "solid-icons/tb";

export function CheckAnimation() {
  return (
    <div class="text-emerald-500 dark:text-emerald-400 animate-[checkBounce_1.2s_ease-in-out_infinite]">
      <TbOutlineCircleCheck size={52} />
    </div>
  );
}

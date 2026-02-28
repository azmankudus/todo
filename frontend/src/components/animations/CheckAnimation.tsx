import { CircleCheckBig } from "lucide-solid";

export function CheckAnimation() {
  return (
    <div class="text-emerald-500 dark:text-emerald-400 animate-[checkBounce_1.2s_ease-in-out_infinite]">
      <CircleCheckBig size={52} />
    </div>
  );
}

import { Trash2 } from "lucide-solid";

export function TrashAnimation() {
  return (
    <div class="text-red-500 dark:text-red-400 animate-[trashShake_0.8s_ease-in-out_infinite]">
      <Trash2 size={48} />
    </div>
  );
}

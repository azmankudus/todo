import { Pencil } from "lucide-solid";

export function PencilAnimation() {
  return (
    <div class="text-primary-500 dark:text-primary-400 animate-[pencilWrite_1s_ease-in-out_infinite]">
      <Pencil size={48} />
    </div>
  );
}

import { TbOutlineTrash } from "solid-icons/tb";

export function TrashAnimation() {
  return (
    <div class="text-red-500 dark:text-red-400 animate-[trashShake_0.8s_ease-in-out_infinite]">
      <TbOutlineTrash size={48} />
    </div>
  );
}

import { TbOutlinePencil } from "solid-icons/tb";

export function PencilAnimation() {
  return (
    <div class="text-primary-500 dark:text-primary-400 animate-[pencilWrite_1s_ease-in-out_infinite]">
      <TbOutlinePencil size={48} />
    </div>
  );
}

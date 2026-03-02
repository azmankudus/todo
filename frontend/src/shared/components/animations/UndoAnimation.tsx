import { TbOutlineArrowBackUp } from "solid-icons/tb";

export function UndoAnimation() {
  return (
    <div class="text-amber-500 dark:text-amber-400 animate-[undoSpin_1s_ease-in-out_infinite]">
      <TbOutlineArrowBackUp size={48} />
    </div>
  );
}

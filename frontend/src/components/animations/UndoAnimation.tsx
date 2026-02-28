import { Undo2 } from "lucide-solid";

export function UndoAnimation() {
  return (
    <div class="text-amber-500 dark:text-amber-400 animate-[undoSpin_1s_ease-in-out_infinite]">
      <Undo2 size={48} />
    </div>
  );
}

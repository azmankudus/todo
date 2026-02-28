import { Match, Switch } from "solid-js";
import type { LoadingIcon } from "../../stores/loadingStore";
import {
  HourglassAnimation,
  DatabaseAnimation,
  PencilAnimation,
  CheckAnimation,
  TrashAnimation,
  RocketAnimation,
  SpinnerAnimation,
  UndoAnimation,
} from "../animations";

export function LoadingAnimation(props: { icon: LoadingIcon }) {
  return (
    <div class="relative w-16 h-16 flex items-center justify-center">
      <Switch>
        <Match when={props.icon === "hourglass"}><HourglassAnimation /></Match>
        <Match when={props.icon === "database"}><DatabaseAnimation /></Match>
        <Match when={props.icon === "pencil"}><PencilAnimation /></Match>
        <Match when={props.icon === "check"}><CheckAnimation /></Match>
        <Match when={props.icon === "trash"}><TrashAnimation /></Match>
        <Match when={props.icon === "undo"}><UndoAnimation /></Match>
        <Match when={props.icon === "rocket"}><RocketAnimation /></Match>
        <Match when={props.icon === "spinner"}><SpinnerAnimation /></Match>
      </Switch>
    </div>
  );
}

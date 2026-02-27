import { JSX, splitProps } from "solid-js";

export function Label(props: JSX.LabelHTMLAttributes<HTMLLabelElement>) {
  const [local, others] = splitProps(props, ["class", "children"]);

  return (
    <label
      class={`block text-sm font-medium mb-2 dark:text-white ${local.class || ""}`}
      {...others}
    >
      {local.children}
    </label>
  );
}

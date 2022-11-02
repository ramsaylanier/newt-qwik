import { component$, Slot, useStyles$, PropFunction } from "@builder.io/qwik";
// import type { QRL } from "@builder.io/qwik";
import styles from "./buttons.css";

interface ButtonProps {
  onClick$?: PropFunction<() => void>;
  style?: any;
  classNames?: string;
}

export default component$((props: ButtonProps) => {
  useStyles$(styles);

  return (
    <button
      class={`base-button newt-button ${
        props.classNames ? props.classNames : ""
      }`}
      style={props.style}
      onClick$={props.onClick$}
    >
      <Slot />
    </button>
  );
});

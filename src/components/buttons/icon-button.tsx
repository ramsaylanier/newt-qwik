import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import styles from "./buttons.css";

interface IconButtonProps {
  onClick$: PropFunction<() => void>;
  classNames?: string;
  style?: any;
}

export default component$((props: IconButtonProps) => {
  useStyles$(styles);

  return (
    <button
      class={`base-button newt-icon-button ${
        props.classNames ? props.classNames : ""
      }`}
      style={props.style}
      onClick$={props.onClick$}
    >
      <Slot />
    </button>
  );
});

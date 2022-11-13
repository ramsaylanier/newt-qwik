import {
  component$,
  Slot,
  $,
  useStore,
  useStylesScoped$,
  useSignal,
} from "@builder.io/qwik";
import styles from "./tooltip.css?inline";

interface TooltipProps {
  title: string;
  placement?: "top" | "bottom";
}

interface TooltipState {
  show: boolean;
  timer: any;
}

export default component$(({ title, placement = "top" }: TooltipProps) => {
  useStylesScoped$(styles);
  const state = useStore<TooltipState>({
    show: false,
    timer: null,
  });
  const tooltipRef = useSignal<Element>();
  const containerRef = useSignal<Element>();
  const containerHeight =
    containerRef.value?.firstElementChild?.getBoundingClientRect().height || 0;
  const tooltipHeight = tooltipRef.value?.getBoundingClientRect().height || 0;

  const offset = containerRef.value
    ? placement === "top"
      ? tooltipHeight
      : placement === "bottom"
      ? -containerHeight - tooltipHeight / 2
      : 0
    : 0;

  const handleMouseEnter = $(() => {
    state.timer = window.setTimeout(() => {
      state.show = true;
    }, 350);
  });

  const handleMouseLeave = $(() => {
    clearTimeout(state.timer);
    state.show = false;
    state.timer = null;
  });

  return (
    <span
      onMouseEnter$={handleMouseEnter}
      onMouseLeave$={handleMouseLeave}
      class="tooltip-container"
      ref={containerRef}
    >
      <Slot />
      {state.show && (
        <div
          class="tooltip"
          style={{
            transform: `translate(0px, ${-offset}px)`,
          }}
          ref={tooltipRef}
        >
          {title}
        </div>
      )}
    </span>
  );
});

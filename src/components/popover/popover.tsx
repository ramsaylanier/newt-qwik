import {
  component$,
  useStyles$,
  $,
  PropFunction,
  Slot,
  useSignal,
  useClientEffect$,
  useStore,
} from "@builder.io/qwik";
import styles from "./popover.css?inline";

// Components
import IconButton from "../buttons/icon-button";
import Icon from "../icons/icon";

// Types
import type { DOMElement } from "slate-react/dist/utils/dom";

interface PopoverProps {
  anchorEl?: DOMElement | null;
  onClose$: PropFunction<(event: any) => void>;
  placement: "left" | "right" | "center";
}

interface State {
  x: number | null;
  y: number | null;
}

export default component$(
  ({ anchorEl, onClose$, placement = "left" }: PopoverProps) => {
    useStyles$(styles);

    const state = useStore<State>({
      x: null,
      y: null,
    });

    const containerRef = useSignal<Element>();

    if (!anchorEl) return null;

    useClientEffect$(({ track }) => {
      track(() => containerRef.value);

      if (anchorEl) {
        const anchorRect = anchorEl.getBoundingClientRect();
        const containerRect = containerRef?.value?.getBoundingClientRect();
        const aX = anchorRect.x;
        const cWidth = containerRect?.width || 0;
        const x = Math.max(
          0,
          placement === "left"
            ? aX
            : placement === "center"
            ? aX - cWidth / 2
            : aX - cWidth
        );

        state.x = x;
        state.y = anchorRect.y + 20;
      } else {
        state.x = null;
        state.y = null;
      }
    });

    const handleRootClick = $((event: any) => {
      if (event.target.id === "newt-popover-root") {
        onClose$(event);
      }
    });

    return (
      <div
        class="popover-root"
        onClick$={handleRootClick}
        id="newt-popover-root"
      >
        <div
          class="popover-container"
          style={{
            opacity: state.x !== null ? "1" : "0",
            transform:
              state.x !== null
                ? `translate(${state.x}px, ${state.y}px)`
                : undefined,
          }}
          ref={containerRef}
        >
          <div class="popover-header">
            <IconButton onClick$={(event) => onClose$(event)}>
              <Icon name="close" />
            </IconButton>
          </div>
          <Slot />
        </div>
      </div>
    );
  }
);

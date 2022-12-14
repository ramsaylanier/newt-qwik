import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import Icon from "~/components/icons/icon";
import IconButton from "~/components/buttons/icon-button";
import Button from "~/components/buttons/button";
import { Auth0Context } from "~/lib/auth";
import Popover from "../popover/popover";

interface DeletePageIconProps {
  page: Page;
}

interface StateProps {
  anchorEl: Element | null;
}

export default component$((props: DeletePageIconProps) => {
  const state = useStore<StateProps>({
    anchorEl: null,
  });
  const store = useContext(Auth0Context);
  const nav = useNavigate();

  const handleClick = $((event: any) => {
    state.anchorEl = event.target;
  });

  const handleClose = $(() => {
    state.anchorEl = null;
  });

  const handleDelete = $(async () => {
    const res = await fetch("/page/api/delete", {
      method: "POST",
      body: JSON.stringify({ pageId: props.page._id }),
    });

    if (res.ok && store.activePond) {
      store.activePond.pages =
        store.activePond.pages?.filter((p) => p._id !== props.page._id) || [];
      state.anchorEl = null;
      nav.path = "/";
    }
  });

  return (
    <>
      <IconButton onClick$={handleClick}>
        <Icon name="delete" />
      </IconButton>

      <Popover
        anchorEl={state.anchorEl}
        onClose$={handleClose}
        placement="left"
      >
        <header class="dialog-header">
          <h3 class="dialog-title">Delete Page</h3>
        </header>
        <section class="dialog-body">
          <p>Are You Sure?</p>

          <Button
            onClick$={handleDelete}
            style={{
              marginTop: "1rem",
              backgroundColor: "var(--light-purple)",
            }}
          >
            Delete
          </Button>
        </section>
      </Popover>
    </>
  );
});

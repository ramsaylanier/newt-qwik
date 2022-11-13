import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import Icon from "~/components/icons/icon";
import IconButton from "~/components/buttons/icon-button";
import Button from "~/components/buttons/button";
import { Auth0Context } from "~/lib/auth";
import Popover from "../popover/popover";

interface DeletePondIconProps {
  pond: Pond;
}

export default component$((props: DeletePondIconProps) => {
  const state = useStore({
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
    const res = await fetch("/pond/api/delete", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify({ pondId: props.pond._id }),
    });

    if (res.ok) {
      store.ponds = store.ponds.filter((p) => p._id !== props.pond._id);
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
          <h3 class="dialog-title">Delete Pond</h3>
        </header>
        <section class="dialog-body">
          <p>
            Are You Sure? This will delete all Pages associated to this Pond.
          </p>

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

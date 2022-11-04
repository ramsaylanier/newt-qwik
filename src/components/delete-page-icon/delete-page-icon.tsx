import { component$, useStore, $, useContext } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { MUIDeleteIcon, MUIDialog } from "~/integrations/react/mui";
import IconButton from "~/components/buttons/icon-button";
import Button from "~/components/buttons/button";
import { Auth0Context } from "~/lib/auth";
import page from "../page/page";

interface DeletePageIconProps {
  page: Page;
}

export default component$((props: DeletePageIconProps) => {
  const state = useStore({
    open: false,
  });

  const store = useContext(Auth0Context);

  const nav = useNavigate();

  const handleClick = $(() => {
    state.open = true;
  });

  const handleClose = $(() => {
    state.open = false;
  });

  const handleDelete = $(async () => {
    const res = await fetch("/page/api/delete", {
      method: "POST",
      body: JSON.stringify({ pageId: props.page._id }),
    });

    if (res.ok) {
      store.pages = store.pages.filter((p) => p._id !== props.page._id);
      state.open = false;
      nav.path = "/";
    }
  });

  return (
    <>
      <IconButton onClick$={handleClick}>
        <MUIDeleteIcon fontSize="inherit" client:visible />
      </IconButton>

      <MUIDialog open={state.open} onClose$={handleClose}>
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
      </MUIDialog>
    </>
  );
});

import {
  component$,
  useStore,
  $,
  useStyles$,
  useContext,
} from "@builder.io/qwik";
import { MUIAddIcon, MUIDialog } from "~/integrations/react/mui";
import styles from "./create-page-icon.css?inline";
import IconButton from "~/components/buttons/icon-button";
import Button from "~/components/buttons/button";
import { Auth0Context } from "~/lib/auth";

export default component$(() => {
  useStyles$(styles);
  const userStore = useContext(Auth0Context);

  const store = useStore({
    open: false,
    title: "",
  });

  const handleClick = $(() => {
    store.open = true;
  });

  const handleClose = $(() => {
    store.open = false;
  });

  const handleChange = $((event: any) => {
    store.title = event?.target?.value;
  });

  const handleSubmit = $(async () => {
    const res = await fetch("/page/api/create", {
      method: "POST",
      body: JSON.stringify({ title: store.title }),
    });

    if (res.ok && userStore.user) {
      const newPage = await res.json();
      userStore.pages.push(newPage);
      store.open = false;
    }
  });

  return (
    <>
      <IconButton onClick$={handleClick}>
        <MUIAddIcon fontSize="inherit" />
      </IconButton>

      <MUIDialog open={store.open} onClose$={handleClose}>
        <header class="dialog-header">
          <h3 class="dialog-title">Create New Page</h3>
        </header>
        <section class="dialog-body">
          <form onSubmit$={handleSubmit} preventdefault:submit>
            <input
              type="text"
              name="page-title"
              placeholder="Page Title"
              onChange$={handleChange}
            />

            <Button
              style={{
                marginTop: "1rem",
                backgroundColor: "var(--light-purple)",
              }}
            >
              Create
            </Button>
          </form>
        </section>
      </MUIDialog>
    </>
  );
});

import {
  component$,
  useStore,
  $,
  useStyles$,
  useContext,
} from "@builder.io/qwik";
import { MUIDialog } from "~/integrations/react/mui";
import Icon from "~/components/icons/icon";
import styles from "./create-page-icon.css?inline";
import IconButton from "~/components/buttons/icon-button";
import Button from "~/components/buttons/button";
import { Auth0Context } from "~/lib/auth";

export default component$(() => {
  useStyles$(styles);
  const userStore = useContext(Auth0Context);

  const state = useStore({
    open: false,
    title: "",
  });

  const handleClick = $(() => {
    state.open = true;
  });

  const handleClose = $(() => {
    state.open = false;
  });

  const handleChange = $((event: any) => {
    state.title = event?.target?.value;
  });

  const handleSubmit = $(async () => {
    const res = await fetch("/page/api/create", {
      method: "POST",
      headers: {
        responseType: "application/json",
      },
      body: JSON.stringify({ title: state.title }),
    });

    console.log({ res });

    if (res.ok && userStore.user) {
      const newPage = await res.json();
      userStore.pages.unshift(newPage);
      state.open = false;
    }
  });

  return (
    <>
      <IconButton onClick$={handleClick}>
        <Icon name="add" />
      </IconButton>

      <MUIDialog open={state.open} onClose$={handleClose} client:visible>
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
              value={state.title}
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

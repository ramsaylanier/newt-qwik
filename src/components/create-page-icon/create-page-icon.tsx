import {
  component$,
  useStore,
  $,
  useStyles$,
  useContext,
} from "@builder.io/qwik";
import Icon from "~/components/icons/icon";
import styles from "./create-page-icon.css?inline";
import IconButton from "~/components/buttons/icon-button";
import Button from "~/components/buttons/button";
import { Auth0Context } from "~/lib/auth";
import Popover from "../popover/popover";
import { useCreatePage } from "~/hooks/useCreatePage";

export default component$(() => {
  useStyles$(styles);
  const userStore = useContext(Auth0Context);
  // const { mutation$ } = useCreatePage();

  const state = useStore({
    anchorEl: null,
    title: "",
  });

  const handleClick = $((event: any) => {
    state.anchorEl = event.target;
  });

  const handleClose = $(() => {
    state.anchorEl = null;
    state.title = "";
  });

  const handleChange = $((event: any) => {
    state.title = event?.target?.value;
  });

  const handleSubmit = $(async () => {
    // mutation$({ title: state.title, private: false });
    const res = await fetch(`${window.location.origin}/page/api/create`, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify({ title: state.title, user: userStore.user }),
    });
    if (res.ok && userStore.user) {
      handleClose();
      const newPage = await res.json();
      if (userStore.activePond) {
        userStore.activePond.pages.push(newPage);
      }
    }
  });

  return (
    <>
      <IconButton onClick$={handleClick}>
        <Icon name="add" />
      </IconButton>

      <Popover
        anchorEl={state.anchorEl}
        onClose$={handleClose}
        placement="left"
      >
        <section class="dialog-body">
          <h5 class="popover-title">Create New Page</h5>
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
              onClick$={handleSubmit}
            >
              Create
            </Button>
          </form>
        </section>
      </Popover>
    </>
  );
});

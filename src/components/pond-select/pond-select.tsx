import {
  component$,
  useStylesScoped$,
  useContext,
  useMount$,
  useStore,
  $,
} from "@builder.io/qwik";
import styles from "./pond-select.css?inline";
import { Auth0Context } from "~/lib/auth";
import { getUserPonds } from "~/lib/database";
import IconButton from "~/components/buttons/icon-button";
import Icon from "~/components/icons/icon";
import Popover from "~/components/popover/popover";
import Button from "../buttons/button";

import { createPond } from "~/lib/database";

export default component$(() => {
  useStylesScoped$(styles);
  const store = useContext(Auth0Context);
  const state = useStore({
    title: "",
    anchorEl: null,
  });

  // hydrate state with ponds
  useMount$(async () => {
    if (store.user) {
      const ponds = await getUserPonds(store.user.user_id);
      store.ponds = ponds;
      const activePond = store.ponds?.find(
        (p) => p._key === store.user?.user_metadata?.activePond
      );

      if (activePond) {
        store.activePond = activePond;
      }
    }
  });

  const handleSubmit = $(async () => {
    if (store.user?.user_id) {
      const newPond = await createPond(state.title, store.user.user_id);
      console.log({ newPond });
    }
  });

  const handleItemClick = $(async (pond: Pond) => {
    try {
      store.activePond = pond;
      const res = await fetch(`${window.location.origin}/auth/updateUser`, {
        method: "POST",
        credentials: "include",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({ activePond: pond._key }),
      });

      if (res.ok) {
        state.anchorEl = null;
      }
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <div class="pond-select-container">
      <p class="active-pond-title">{store.activePond?.title}</p>
      <IconButton
        onClick$={(event) => {
          state.anchorEl = event.target;
        }}
        classNames="select-button"
      >
        <Icon name="arrowDown" />
      </IconButton>

      <Popover
        anchorEl={state.anchorEl}
        onClose$={() => {
          state.anchorEl = null;
        }}
        placement="right"
      >
        <ul class="pond-list">
          {store.ponds.map((pond) => {
            return (
              <li
                class="pond-list-item"
                key={pond._id}
                onClick$={() => handleItemClick(pond)}
              >
                {pond.title}
              </li>
            );
          })}
        </ul>

        <div class="form-container">
          <form preventdefault:submit onSubmit$={handleSubmit}>
            <div class="form-control">
              <label>New Pond</label>
              <input
                type="text"
                value={state.title}
                onChange$={(event) => (state.title = event.target.value)}
              />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </div>
      </Popover>
    </div>
  );
});

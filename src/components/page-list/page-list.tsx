import {
  component$,
  useStyles$,
  useContext,
  useWatch$,
} from "@builder.io/qwik";
import styles from "./page-list.css?inline";
import PageLink from "../page-link";

import { Auth0Context } from "~/lib/auth";
import { getPagesFromPond } from "~/lib/database";

export default component$(() => {
  useStyles$(styles);
  const store = useContext(Auth0Context);

  useWatch$(async ({ track }) => {
    track(() => store.activePond);
    if (store.activePond) {
      const pages = await getPagesFromPond(store.activePond._key);
      store.activePond.pages = pages;
    }
  });

  return (
    <ul class="page-list">
      {store.activePond?.pages?.map((page) => {
        return (
          <li key={page._id} class="page-list-item">
            <PageLink page={page} />
          </li>
        );
      })}
    </ul>
  );
});

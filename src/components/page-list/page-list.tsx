import {
  component$,
  useStyles$,
  useContext,
  useWatch$,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./page-list.css?inline";
import Tooltip from "../tooltip/tooltip";

import { Auth0Context } from "~/lib/auth";
import { getPagesFromPond } from "~/lib/database";

export default component$(() => {
  useStyles$(styles);
  const store = useContext(Auth0Context);

  useWatch$(async ({ track }) => {
    track(() => store.activePond);
    if (store.activePond) {
      const pages = await getPagesFromPond(store.activePond);
      console.log({ pages });
      store.activePond.pages = pages;
    }
  });

  return (
    <ul class="page-list">
      {store.activePond?.pages?.map((page) => {
        console.log({ page });
        return (
          <li key={page._id} class="page-list-item">
            <Tooltip title={page.title}>
              <Link prefetch={true} href={`/page/${page._key}`}>
                {page.title}
              </Link>
            </Tooltip>
          </li>
        );
      })}
    </ul>
  );
});

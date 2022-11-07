import {
  component$,
  useStyles$,
  useContext,
  useMount$,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./page-list.css?inline";
import { Auth0Context } from "~/lib/auth";
import { getCurrentUserPages } from "~/lib/pageConnector";

export default component$(() => {
  useStyles$(styles);
  const store = useContext(Auth0Context);

  console.log(store.pages);

  useMount$(async () => {
    const pages = await getCurrentUserPages();
    store.pages = pages;
  });

  return (
    <ul class="page-list">
      {store.pages.map((page) => {
        return (
          <li key={page._id} class="page-list-item">
            <Link prefetch={true} href={`/page/${page._key}`}>
              {page.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
});

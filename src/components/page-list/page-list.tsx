import {
  component$,
  useResource$,
  useStyles$,
  Resource,
  useContext,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { getUserPages } from "~/lib/database";
import styles from "./page-list.css?inline";
import { Auth0Context } from "~/lib/auth";

export default component$(() => {
  useStyles$(styles);
  const store = useContext(Auth0Context);

  const pagesResource = useResource$<Page[]>(async ({ track, cleanup }) => {
    track(() => store.pages.length);
    const controller = new AbortController();
    cleanup(() => controller.abort());

    return getUserPages(store.user?.sub);
  });

  return (
    <Resource
      value={pagesResource}
      onResolved={(data) => {
        return (
          <>
            {data ? (
              <ul class="page-list">
                {data.map((page) => {
                  return (
                    <li key={page._key} class="page-list-item">
                      <Link prefetch={true} href={`/page/${page._key}`}>
                        {page.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div />
            )}
          </>
        );
      }}
    />
  );
});

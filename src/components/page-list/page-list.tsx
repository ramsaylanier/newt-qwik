import {
  component$,
  useResource$,
  useStyles$,
  Resource,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { getUserPages } from "~/lib/database";
import { getCurrentUser } from "~/routes/auth/[...auth0]";
import styles from "./page-list.css?inline";

export default component$(() => {
  useStyles$(styles);

  const pages = useResource$(async () => {
    const user = await getCurrentUser();
    return user ? getUserPages(user?.sub) : [];
  });

  return (
    <Resource
      value={pages}
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

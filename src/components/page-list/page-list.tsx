import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./page-list.css?inline";
import PageLink from "../page-link";

import { useGetActivePond } from "~/hooks/useGetPond";

export default component$(() => {
  useStyles$(styles);
  const { pond, loading } = useGetActivePond();

  console.log({ pond });

  return (
    <ul class="page-list">
      {loading && <p>Loading...</p>}
      {pond?.pages?.map((page) => {
        return (
          <li key={page._id} class="page-list-item">
            <PageLink page={page} />
          </li>
        );
      })}
    </ul>
  );
});

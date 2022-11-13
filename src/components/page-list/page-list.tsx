import {
  component$,
  useStyles$,
  useContext,
  useWatch$,
  $,
} from "@builder.io/qwik";
import styles from "./page-list.css?inline";
// import PageLink from "../page-link";
import { Link } from "@builder.io/qwik-city";

import { Auth0Context } from "~/lib/auth";
import { gql } from "graphql-tag";
import { client } from "~/lib/graphql/client";

export const query = $(
  () => gql`
    query GetPagesForPond($key: String, $ownerId: String) {
      pond(key: $key, ownerId: $ownerId) {
        _id
        _key
        title
        ownerId
        lastEdited
        private
        pages {
          _id
          _key
          title
          ownerId
          lastEdited
          private
          content
        }
      }
    }
  `
);

export default component$(() => {
  useStyles$(styles);
  const store = useContext(Auth0Context);

  useWatch$(async ({ track }) => {
    track(() => store.activePond);
    if (store.activePond) {
      const res = await client.query({
        query: await query(),
        variables: {
          key: store.activePond._key,
          ownerId: store.user?.user_id,
        },
      });
      const pages = res.data?.pond?.pages || [];
      store.activePond.pages = pages;
    }
  });

  return (
    <ul class="page-list">
      {store.activePond?.pages?.map((page) => {
        return (
          <li key={page._id} class="page-list-item">
            <Link
              key={page._id}
              prefetch={true}
              href={`http://dev.newt:5173/page/${page._key}`}
            >
              {page.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
});

import { useStore, useContext, useWatch$ } from "@builder.io/qwik";
import { client } from "~/lib/graphql/client";
import { gql } from "graphql-tag";
import { Auth0Context } from "~/lib/auth";

interface HookState {
  pond: Pond | null;
  loading: boolean;
  error: any;
}

export const query$ = gql`
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
`;

export function useGetActivePond() {
  const store = useContext(Auth0Context);
  const state = useStore<HookState>({
    pond: null,
    loading: false,
    error: null,
  });

  useWatch$(async ({ track }) => {
    track(() => store.activePond);
    state.loading = true;
    if (store.activePond) {
      client
        .query({
          query: query$,
          variables: {
            key: store.activePond._key,
            ownerId: store.user?.user_id,
          },
        })
        .then((r: any) => {
          state.loading = false;
          state.pond = r.data.pond;
        });
    }
  });

  return state;
}

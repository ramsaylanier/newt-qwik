import { useContext, useStore, useClientEffect$ } from "@builder.io/qwik";
import { Auth0Context } from "~/lib/auth";
import { client } from "~/lib/graphql/client";
import { gql } from "graphql-tag";

interface CurrentUserState {
  user: UserProfile | null;
  loading: boolean;
  error: any;
}

export const query$ = gql`
  query GetCurrentUser {
    currentUser {
      user_id
      user_metadata {
        activePond
      }
      activePond {
        _id
        _key
        title
        pages {
          _id
          _key
          title
        }
      }
      ponds {
        _id
        _key
        title
      }
    }
  }
`;

export function useCurrentUser() {
  const store = useContext(Auth0Context);
  const state = useStore<CurrentUserState>({
    user: null,
    loading: false,
    error: null,
  });

  useClientEffect$(async () => {
    state.loading = true;
    client
      .query({ query: query$ })
      .then((r) => {
        state.loading = false;
        state.user = r.data?.currentUser;
        store.user = state.user;
      })
      .catch((err) => {
        state.error = err;
      });
  });

  return state;
}

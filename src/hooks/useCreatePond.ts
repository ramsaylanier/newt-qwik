import { useStore, $ } from "@builder.io/qwik";
import { client } from "~/lib/graphql/client";
import { gql } from "graphql-tag";

interface HookState {
  newPond: Pond | null;
  loading: boolean;
  error: any;
}

export const mutationQuery$ = gql`
  mutation CreatePond($title: String, $private: Boolean) {
    createPond(title: $title, private: $private) {
      _id
      _key
      title
      ownerId
      lastEdited
      private
    }
  }
`;

export function useCreatePond() {
  const state = useStore<HookState>({
    newPond: null,
    loading: false,
    error: null,
  });

  const mutate$ = $((variables: any) => {
    state.loading = true;
    return client
      .mutate({
        mutation: mutationQuery$,
        variables,
      })
      .then((r: any) => {
        state.loading = false;
        state.newPond = r.data.createPond;
        return r.data.createPond;
      });
  });

  return { mutate$, ...state };
}

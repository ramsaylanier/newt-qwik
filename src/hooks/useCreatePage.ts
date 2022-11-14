import { useStore, $ } from "@builder.io/qwik";
import { client } from "~/lib/graphql/client";
import { gql } from "graphql-tag";

interface HookState {
  newPage: Page | null;
  loading: boolean;
  error: any;
}

export const mutationQuery$ = gql`
  mutation CreatePage($title: String, $private: Boolean) {
    createPage(title: $title, private: $private) {
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

export function useCreatePage() {
  const state = useStore<HookState>({
    newPage: null,
    loading: false,
    error: null,
  });

  const mutate$ = $((variables: any) => {
    console.log({ variables });
    state.loading = true;
    client
      .mutate({
        mutation: mutationQuery$,
        variables,
      })
      .then((r: any) => {
        state.loading = false;
        state.newPage = r.data.createPage;
      });
  });

  return { mutate$, ...state };
}

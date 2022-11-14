import { useStore } from "@builder.io/qwik";
import { client } from "~/lib/graphql/client";

interface UseQueryProps {
  query$: any;
  variables: any;
}

interface HookState {
  data: any;
  loading: boolean;
  error: any;
}

export function useQuery({ query$, variables }: UseQueryProps) {
  const state = useStore<HookState>({
    data: null,
    loading: false,
    error: null,
  });

  state.loading = true;
  client
    .query({ query: query$, variables })
    .then((data: any) => {
      if (data) {
        state.data = data;
        state.loading = false;
      }
    })
    .catch((err: Error) => {
      if (err) {
        state.error = err;
        state.loading = false;
      }
    });

  return state;
}

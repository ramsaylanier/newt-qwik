import {
  component$,
  useStore,
  useContextProvider,
  createContext,
  Slot,
} from "@builder.io/qwik";

interface AuthProps {
  user?: UserProfile | null;
  activePond: Pond | null;
  ponds: Pond[];
  loading: boolean;
}

export const Auth0Context = createContext<AuthProps>("auth0-context");
export const Auth0Provider = component$(() => {
  const state = useStore(
    {
      user: null,
      activePond: null,
      ponds: [],
      loading: false,
    },
    { recursive: true }
  );

  useContextProvider(Auth0Context, state);
  return <Slot name="children" />;
});

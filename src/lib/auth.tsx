import {
  component$,
  useStore,
  useContextProvider,
  createContext,
  Slot,
} from "@builder.io/qwik";

interface User {
  sub: string;
}

interface AuthProps {
  user?: User;
  loading: boolean;
}

export const Auth0Context = createContext<AuthProps>("auth0-context");
export const Auth0Provider = component$(() => {
  const state = useStore({
    loading: false,
  });
  useContextProvider(Auth0Context, state);
  return <Slot name="children" />;
});

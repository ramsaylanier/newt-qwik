import {
  component$,
  useStylesScoped$,
  $,
  Resource,
  useResource$,
} from "@builder.io/qwik";
import styles from "./sidebar.css?inline";
import auth0Client from "~/lib/authClient";
import PageList from "~/components/page-list/page-list";
import { getCurrentUser } from "~/routes/auth/[...auth0]";

export default component$(() => {
  useStylesScoped$(styles);

  const user = useResource$(() => {
    return getCurrentUser();
  });

  const handleClick = $(async (user: UserProfile | null) => {
    if (user) {
      const auth0 = await auth0Client;
      await auth0.logout({
        returnTo: `${window.location.origin}/auth/logout`,
      });
    } else {
      const auth0 = await auth0Client;
      await auth0.authorize({
        redirectUri: `${window.location.origin}/auth/callback`,
      });
    }
  });

  return (
    <aside>
      <Resource
        value={user}
        onResolved={(user) => {
          console.log({ user });
          return (
            <>
              <button onClick$={() => handleClick(user)}>
                {user ? "Logout" : "Login"}
              </button>

              {user && <PageList />}
            </>
          );
        }}
      />
    </aside>
  );
});

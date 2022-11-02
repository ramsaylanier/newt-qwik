import {
  component$,
  useStyles$,
  $,
  Resource,
  useResource$,
  useContext,
} from "@builder.io/qwik";
import styles from "./sidebar.css?inline";
import auth0Client from "~/lib/authClient";
import PageList from "~/components/page-list/page-list";
import { getCurrentUser } from "~/routes/auth/[...auth0]";
import CreatePageIcon from "~/components/create-page-icon/create-page-icon";
import { MUIShareIcon } from "~/integrations/react/mui";
import IconButton from "~/components/buttons/icon-button";
import Button from "~/components/buttons/button";
import { Auth0Context } from "~/lib/auth";

export default component$(() => {
  useStyles$(styles);
  const store = useContext(Auth0Context);

  const userResource = useResource$<any>(async () => {
    return getCurrentUser();
  });

  const handleClick = $(async () => {
    if (store.user) {
      const auth0 = await auth0Client;
      store.user = null;
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

  const handleGraphClick = $(() => {
    console.log("graph click");
  });

  return (
    <aside class="sidebar">
      <Resource
        value={userResource}
        onResolved={(user: UserProfile) => {
          store.user = user;
          return (
            <>
              <header class="sidebar-header">
                <div class="sidebar-header-container">
                  <Button onClick$={handleClick}>
                    {user ? "Logout" : "Login"}
                  </Button>

                  {user && (
                    <div style={{ marginLeft: "10px" }}>
                      <CreatePageIcon />
                      <IconButton onClick$={handleGraphClick}>
                        <MUIShareIcon fontSize="inherit" />
                      </IconButton>
                    </div>
                  )}
                </div>
              </header>

              <nav class="sidebar-nav">{user && <PageList />}</nav>
            </>
          );
        }}
      />
    </aside>
  );
});

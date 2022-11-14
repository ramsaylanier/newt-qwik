import { component$, useStyles$, $, useContext } from "@builder.io/qwik";
import styles from "./sidebar.css?inline";
import auth0Client from "~/lib/authClient";
import PageList from "~/components/page-list/page-list";
import CreatePageIcon from "~/components/create-page-icon/create-page-icon";
import Icon from "~/components/icons/icon";
import IconButton from "~/components/buttons/icon-button";
import Button from "~/components/buttons/button";
import PondSelect from "~/components/pond-select/pond-select";
import { Auth0Context } from "~/lib/auth";
import { useCurrentUser } from "~/hooks/useCurrentUser";

export default component$(() => {
  useStyles$(styles);
  useCurrentUser();
  const store = useContext(Auth0Context);

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
      <>
        <header class="sidebar-header">
          <div class="sidebar-header-container">
            <Button onClick$={handleClick}>
              {store.user ? "Logout" : "Login"}
            </Button>

            {store.user && (
              <div style={{ marginLeft: "10px" }}>
                <CreatePageIcon />
                <IconButton onClick$={handleGraphClick}>
                  <Icon name="graphBubble" />
                </IconButton>
              </div>
            )}
          </div>
        </header>

        {store.user && (
          <nav class="sidebar-nav">
            <div class="nav-inner">
              <PondSelect />
              {store.activePond && <PageList />}
            </div>
          </nav>
        )}
      </>
    </aside>
  );
});

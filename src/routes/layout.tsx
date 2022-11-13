import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import Sidebar from "~/components/sidebar/sidebar";
import styles from "./layout.css?inline";
import { Auth0Provider } from "~/lib/auth";

export default component$(() => {
  useStyles$(styles);

  return (
    <Auth0Provider>
      <main q:slot="children">
        <Sidebar />;
        <section class="page">
          <Slot />
        </section>
      </main>
    </Auth0Provider>
  );
});

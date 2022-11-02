import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import Sidebar from "~/components/sidebar/sidebar";
import { Auth0Provider } from "~/lib/auth";
import styles from "./layout.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <Auth0Provider>
      <main q:slot="children">
        <Sidebar />
        <section class="page">
          <Slot />
        </section>
      </main>
    </Auth0Provider>
  );
});

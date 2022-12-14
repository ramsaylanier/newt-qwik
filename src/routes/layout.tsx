import { component$, Slot, useStyles$ } from "@builder.io/qwik";
import Sidebar from "~/components/sidebar/sidebar";
import styles from "./layout.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <main>
      <Sidebar />;
      <section class="page">
        <Slot />
      </section>
    </main>
  );
});

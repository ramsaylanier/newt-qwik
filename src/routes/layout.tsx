import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import Sidebar from "~/components/sidebar/sidebar";
import styles from "./layout.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <>
      <main>
        <Sidebar />
        <div class="page">
          <Slot />
        </div>
      </main>
    </>
  );
});

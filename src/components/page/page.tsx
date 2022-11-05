import { component$, useStyles$ } from "@builder.io/qwik";
import styles from "./page.css?inline";

import PageLinks from "~/components/page-links/page-links";
import Editor from "../editor/editor";
// import { MUIBox } from "~/integrations/react/mui";
import DeletePageIcon from "~/components/delete-page-icon/delete-page-icon";
import { MUIBox } from "~/integrations/react/mui";

export default component$(({ page }: PageProps) => {
  useStyles$(styles);

  return (
    <>
      <header>
        <h2 class="page-title">{page.title}</h2>

        <DeletePageIcon page={page} />
      </header>

      <div class="page-content">
        <section class="page-editor">
          <MUIBox client:only>
            <Editor page={page} />
          </MUIBox>
        </section>
        <aside class="page-links">
          <PageLinks page={page} />
        </aside>
      </div>
    </>
  );
});

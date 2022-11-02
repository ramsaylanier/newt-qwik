import { component$, useStyles$, useClientEffect$ } from "@builder.io/qwik";
import styles from "./page.css?inline";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/simple-image";
import MarkerTool from "@editorjs/marker";
import PageLinks from "~/components/page-links/page-links";
import LinkAutocomplete from "@editorjs/link-autocomplete";

export default component$(({ page }: PageProps) => {
  useStyles$(styles);

  useClientEffect$(
    () => {
      const editor = new EditorJS({
        autofocus: true,
        holder: "js-editor-holder",
        data: page.content,
        tools: {
          header: Header,
          list: {
            class: List,
            inlineToolbar: false,
          },
          image: {
            class: ImageTool,
            inlineToolbar: false,
          },
          link: {
            class: LinkAutocomplete,
            config: {
              endpoint: `${window.location.origin}/page/api/search`,
              queryParam: "search",
            },
          },
          marker: {
            class: MarkerTool,
            shortcut: "CMD+SHIFT+M",
          },
        },
        onChange: async (api, event) => {
          console.log({ api, event });
          const update = await editor.save();
          await fetch("../page/api/update", {
            method: "POST",
            body: JSON.stringify({ id: page._id, update }),
          });
        },
      });
    },
    { eagerness: "load" }
  );

  return (
    <>
      <header>
        <h2 class="page-title">{page.title}</h2>
      </header>

      <div class="page-content">
        <section class="page-editor">
          <div id="js-editor-holder" />
        </section>
        <aside class="page-links">
          <PageLinks page={page} />
        </aside>
      </div>
    </>
  );
});

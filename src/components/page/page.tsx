import { component$, useStyles$, useClientEffect$ } from "@builder.io/qwik";
import styles from "./page.css?inline";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/simple-image";
import Hyperlink from "editorjs-hyperlink";

export default component$(({ page }: PageProps) => {
  useStyles$(styles);

  useClientEffect$(
    () => {
      const editor = new EditorJS({
        holder: "js-editor-holder",
        data: page.content,
        tools: {
          header: Header,
          list: List,
          image: ImageTool,
          hyperlink: {
            class: Hyperlink,
            config: {
              shortcut: "CMD+L",
              target: "_blank",
              rel: "nofollow",
              availableTargets: ["_blank", "_self"],
              availableRels: ["author", "noreferrer"],
              validate: false,
            },
          },
        },
        onChange: async () => {
          const update = await editor.save();
          await fetch("../page/update", {
            method: "POST",
            body: JSON.stringify({ id: page._id, update }),
          });
        },
      });
    },
    { eagerness: "load" }
  );

  return (
    <section class="page">
      <header>
        <h2 class="page-title">{page.title}</h2>
      </header>

      <div class="page-content">
        <div id="js-editor-holder" />
      </div>
    </section>
  );
});

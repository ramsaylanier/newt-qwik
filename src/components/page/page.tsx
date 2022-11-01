import {
  component$,
  useStylesScoped$,
  useClientEffect$,
} from "@builder.io/qwik";
import styles from "./page.css?inline";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

export default component$(({ page }: PageProps) => {
  useStylesScoped$(styles);

  useClientEffect$(
    () => {
      console.log("load");
      const editor = new EditorJS({
        holder: "js-editor-holder",
        data: page.content,
        tools: {
          header: Header,
          list: List,
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
    <div class="page">
      <h2>{page.title}</h2>

      <div id="js-editor-holder" />
    </div>
  );
});

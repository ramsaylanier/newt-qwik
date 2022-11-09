import { useClientEffect$, component$ } from "@builder.io/qwik";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/simple-image";
import MarkerTool from "@editorjs/marker";
import LinkAutocomplete from "@editorjs/link-autocomplete";

export default component$(({ page }: PageProps) => {
  useClientEffect$(() => {
    if (typeof window !== "undefined") {
      const editor = new EditorJS({
        autofocus: true,
        holder: "js-editor-holder",
        data: page.content,
        tools: {
          header: Header,
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            inlineToolbar: true,
          },
          link: {
            class: LinkAutocomplete,
            inlineToolbar: true,
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
        onChange: async () => {
          const update = await editor.save();
          fetch("../page/api/update", {
            method: "POST",
            body: JSON.stringify({ id: page._id, update }),
          });
        },
      });
    }
  });

  return <div id="js-editor-holder" />;
});

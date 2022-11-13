import { useClientEffect$, component$ } from "@builder.io/qwik";
// import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
// import ImageTool from "@editorjs/simple-image";
// import MarkerTool from "@editorjs/marker";

interface EditorProps {
  page: Page;
}

export default component$(({ page }: EditorProps) => {
  useClientEffect$(async () => {
    if (typeof window !== "undefined") {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const ImageTool = (await import("@editorjs/simple-image")).default;
      const MarkerTool = (await import("@editorjs/marker")).default;
      const LinkAutocomplete = (await import("@editorjs/link-autocomplete"))
        .default;

      const editor = new EditorJS({
        autofocus: true,
        holder: "js-editor-holder",
        data: page.content || "",
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

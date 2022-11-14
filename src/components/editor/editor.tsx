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
      // const EditorJS = (import("@editorjs/editorjs"));
      // const Header = (import("@editorjs/header"));
      // const List = (import("@editorjs/list"));
      // const ImageTool = (import("@editorjs/simple-image"));
      // const MarkerTool = import("@editorjs/marker"));
      // const LinkAutocomplete = (import("@editorjs/link-autocomplete"))

      const [EditorJS, Header, List, ImageTool, MarkerTool, LinkAutocomplete] =
        await Promise.all([
          import("@editorjs/editorjs"),
          import("@editorjs/header"),
          import("@editorjs/list"),
          import("@editorjs/simple-image"),
          import("@editorjs/marker"),
          import("@editorjs/link-autocomplete"),
        ]);

      const editor = new EditorJS.default({
        autofocus: true,
        holder: "js-editor-holder",
        data: page.content || "",
        tools: {
          header: Header.default,
          list: {
            class: List.default,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool.default,
            inlineToolbar: true,
          },
          link: {
            class: LinkAutocomplete.default,
            inlineToolbar: true,
            config: {
              endpoint: `${window.location.origin}/page/api/search`,
              queryParam: "search",
            },
          },
          marker: {
            class: MarkerTool.default,
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

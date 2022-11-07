/** @jsxImportSource react */
import { useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/simple-image";
import MarkerTool from "@editorjs/marker";
import LinkAutocomplete from "@editorjs/link-autocomplete";

interface EditorProps {
  page: Page;
}

const Editor = (props: EditorProps) => {
  const editorRef = useRef<any>();
  const containerRef = useRef<any>();
  const renderedRef = useRef(false);

  console.log(editorRef.current);

  const initEditor = () => {
    const editor = new EditorJS({
      // holder: `js-editor-${page._key}`,
      holder: `js-editor`,
      placeholder: "Let`s write an awesome story!",
      data: props.page.content,
      onReady: () => {
        console.log("ready");
        editorRef.current = editor;
      },
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
      onChange: async () => {
        const update = await editor.save();
        await fetch("../page/api/update", {
          method: "POST",
          body: JSON.stringify({ id: props.page._id, update }),
        });
      },
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      renderedRef.current = true;
    }
  }, [containerRef.current, renderedRef.current]);

  useEffect(() => {
    if (renderedRef.current && containerRef.current) {
      console.log("init");
      initEditor();
    }
    return () => {
      console.log("return");
      editorRef?.current?.destroy();
      editorRef.current = null;
    };
  }, [renderedRef.current, containerRef.current, editorRef.current]);

  return <div id="js-editor" ref={containerRef} />;
};

export default Editor;

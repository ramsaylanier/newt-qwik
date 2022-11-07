/** @jsxImportSource react */
import { qwikify$ } from "@builder.io/qwik-react";
import { lazy, Suspense, useMemo } from "react";

interface Props {
  page: Page;
}

const EditorContainer = qwikify$((props: Props) => {
  const Editor = useMemo(() => lazy(() => import("./editor")), []);
  return (
    <Suspense fallback={<div>LOADING</div>}>
      <Editor {...props} key={props.page._key} />
    </Suspense>
  );
});

export default EditorContainer;

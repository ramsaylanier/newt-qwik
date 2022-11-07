import {
  component$,
  useStyles$,
  $,
  useStore,
  useContext,
} from "@builder.io/qwik";
import styles from "./page.css?inline";

// Components
import { Auth0Context } from "~/lib/auth";
import PageLinks from "~/components/page-links/page-links";
import Editor from "~/components/editor/editor";
import DeletePageIcon from "~/components/delete-page-icon/delete-page-icon";
import Icon from "../icons/icon";
import IconButton from "../buttons/icon-button";

// Data
import { updatePageTitle } from "~/lib/pageConnector";

export default component$(({ page }: PageProps) => {
  useStyles$(styles);
  const store = useContext(Auth0Context);

  const state = useStore({
    title: page.title,
    isEditing: false,
  });

  const handleChange = $((event: any) => {
    state.title = event.target?.value || "";
  });

  const handleEditName = $(() => {
    state.isEditing = true;
  });

  const handleSaveName = $(() => {
    page.title = state.title;
    state.isEditing = false;

    const storePage = store.pages.find((p) => p._id === page._id);
    if (storePage) {
      storePage.title = state.title;
      store.pages = [...store.pages];
    }

    updatePageTitle(page._id, state.title);
  });

  const handleCancelEdit = $(() => {
    state.isEditing = false;
    state.title = page.title;
  });

  return (
    <>
      <header>
        {state.isEditing ? (
          <>
            <input
              class="page-title-input"
              type="text"
              value={state.title}
              onChange$={handleChange}
            />

            <div>
              <IconButton onClick$={handleSaveName}>
                <Icon name="accept" />
              </IconButton>
            </div>

            <div>
              <IconButton onClick$={handleCancelEdit}>
                <Icon name="cancel" />
              </IconButton>
            </div>
          </>
        ) : (
          <>
            <h2 class="page-title">{page.title}</h2>
            <IconButton onClick$={handleEditName}>
              <Icon name="edit" />
            </IconButton>

            <DeletePageIcon page={page} />
          </>
        )}
      </header>

      <div class="page-content">
        <section class="page-editor">
          <Editor page={page} />
        </section>
        <aside class="page-links">
          <PageLinks page={page} />
        </aside>
      </div>
    </>
  );
});

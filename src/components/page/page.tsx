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
import { Link } from "@builder.io/qwik-city";

// Data
import { updatePageTitle } from "~/lib/pageConnector";

interface PageProps {
  page?: Page | null;
}

export default component$(({ page }: PageProps) => {
  useStyles$(styles);
  const store = useContext(Auth0Context);

  const state = useStore({
    title: page?.title || "",
    isEditing: false,
  });

  const handleChange = $((event: any) => {
    state.title = event.target?.value || "";
  });

  const handleEditName = $(() => {
    state.isEditing = true;
  });

  const handleSaveName = $(() => {
    if (state.title.length > 0 && page) {
      page.title = state.title;
      state.isEditing = false;

      const storePage = store.activePond?.pages.find((p) => p._id === page._id);
      if (storePage) {
        storePage.title = state.title;
      }

      updatePageTitle(page._id, state.title);
    }
  });

  const handleCancelEdit = $(() => {
    if (page) {
      state.isEditing = false;
      state.title = page.title;
    }
  });

  return (
    <>
      <header>
        <div class="page-title-container">
          {state.isEditing ? (
            <>
              <form preventdefault:submit onSubmit$={handleSaveName}>
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
              </form>
              <div>
                <IconButton onClick$={handleCancelEdit}>
                  <Icon name="cancel" />
                </IconButton>
              </div>
            </>
          ) : (
            <>
              <h2 class="page-title">{page?.title}</h2>
              {page && (
                <>
                  <IconButton onClick$={handleEditName}>
                    <Icon name="edit" />
                  </IconButton>
                  <DeletePageIcon page={page} />
                </>
              )}
            </>
          )}
        </div>

        <div class="pond-links-container">
          <span style={{ marginRight: ".5rem" }}>in:</span>
          {page?.ponds?.map((pond) => (
            <Link href={`/pond/${pond._key}`} class="pond-link">
              {pond.title}
            </Link>
          ))}
        </div>
      </header>

      <div class="page-content">
        <section class="page-editor">{page && <Editor page={page} />}</section>
        <aside class="page-links">
          <PageLinks page={page} />
        </aside>
      </div>
    </>
  );
});

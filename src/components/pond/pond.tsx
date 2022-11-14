import {
  component$,
  useStyles$,
  $,
  useStore,
  useContext,
} from "@builder.io/qwik";
import styles from "./pond.css?inline";

// Components
import { Link } from "@builder.io/qwik-city";
import { Auth0Context } from "~/lib/auth";
import DeletePondIcon from "~/components/delete-pond-icon/delete-pond-icon";
import Icon from "../icons/icon";
import IconButton from "../buttons/icon-button";
import Table from "~/components/table/table";

// Data
import { updatePondTitle } from "~/lib/database";

export default component$(({ pond }: PondProps) => {
  useStyles$(styles);
  const store = useContext(Auth0Context);

  const state = useStore({
    title: pond?.title || "",
    isEditing: false,
  });

  const handleChange = $((event: any) => {
    state.title = event.target?.value || "";
  });

  const handleEditName = $(() => {
    state.isEditing = true;
  });

  const handleSaveName = $(() => {
    if (state.title.length > 0 && pond) {
      pond.title = state.title;
      state.isEditing = false;

      if (store.activePond) {
        store.activePond.title = state.title;
      }

      updatePondTitle(pond._id, state.title);
    }
  });

  const handleCancelEdit = $(() => {
    state.isEditing = false;
    state.title = pond?.title || "";
  });

  return (
    <>
      <header class="pond-header">
        <div class="pond-title-container">
          {state.isEditing ? (
            <>
              <form preventdefault:submit onSubmit$={handleSaveName}>
                <input
                  class="pond-title-input"
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
              <h2 class="pond-title">{pond?.title}</h2>

              {pond && (
                <>
                  <IconButton onClick$={handleEditName}>
                    <Icon name="edit" />
                  </IconButton>

                  <DeletePondIcon pond={pond} />
                </>
              )}
            </>
          )}
        </div>
        <Link href="/ponds">Ponds</Link>
      </header>

      <div class="pond-content">
        <Table
          data={pond?.pages || []}
          columns={[
            {
              id: "id",
              hide: true,
            },
            {
              id: "title",
              heading: "Title",
              formatData$: $((page: Page) => {
                return <Link href={`/page/${page._key}`}>{page.title}</Link>;
              }),
            },
            {
              id: "lastEdited",
              heading: "Last Edited",
              formatData$: $((page: Page) => {
                const date = new Date(page.lastEdited);

                return date.toString();
              }),
            },
          ]}
        />
      </div>
    </>
  );
});

import { component$, Resource } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { getPage } from "~/lib/database";
import { getCurrentUser } from "~/routes/auth/[...auth0]";
import Page from "~/components/page/page";

export const onGet: RequestHandler<Page> = async ({ params, response }) => {
  try {
    const user = getCurrentUser();

    if (!user) {
      throw Error("No user!");
    }

    const page = await getPage(params._key, user);
    if (page) {
      return page;
    }
  } catch (err) {
    console.log({ err });
    throw response.redirect("/");
  }
};

export default component$(() => {
  const page = useEndpoint<Page>();

  return (
    <Resource
      value={page}
      onResolved={(page) => {
        return <Page key={page._key} page={page} />;
      }}
    />
  );
});

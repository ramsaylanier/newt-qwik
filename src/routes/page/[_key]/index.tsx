import { component$, Resource } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { getPage } from "~/lib/database";
import Page from "~/components/page/page";

export const onGet: RequestHandler = async ({ params, cookie }) => {
  try {
    const userCookie = cookie.get("newt-user");
    console.log({ userCookie });
    if (userCookie) {
      const page = await getPage(params._key, userCookie.value);
      console.log({ page });
      if (page) {
        return page;
      }
    }
  } catch (err) {
    console.log({ err });
    return null;
  }
};

export default component$(() => {
  const page = useEndpoint<Page>();

  return (
    <>
      <Resource
        value={page}
        onResolved={(page) => {
          return <>{page && <Page key={page._key} page={page} />}</>;
        }}
      />
    </>
  );
});

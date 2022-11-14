import { component$, $, Resource } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Page from "~/components/page/page";
import { client } from "~/lib/graphql/client";
import { gql } from "graphql-tag";
export const query = $(
  () => gql`
    query GetPage($key: String, $ownerId: String) {
      page(key: $key, ownerId: $ownerId) {
        _id
        _key
        title
        ownerId
        lastEdited
        private
        content
        ponds {
          _id
          _key
          title
          ownerId
          lastEdited
          private
        }
      }
    }
  `
);

export const onGet: RequestHandler<Page> = async ({ params, cookie }) => {
  try {
    const userCookie = cookie.get("newt-user");
    if (userCookie) {
      const userId = userCookie.value;
      const pageQuery = await client.query({
        query: await query(),
        variables: {
          key: params._key,
          ownerId: userId,
        },
      });

      console.log({ pageQuery });

      const page = pageQuery.data?.page;
      return page;
    }
  } catch (err) {
    console.log({ err });
    return err;
  }
};

export default component$(() => {
  const pageResource = useEndpoint<Page>();
  return (
    <Resource
      value={pageResource}
      onPending={() => <></>}
      onResolved={(page: Page) => <Page key={page?._key} page={page} />}
    />
  );
});

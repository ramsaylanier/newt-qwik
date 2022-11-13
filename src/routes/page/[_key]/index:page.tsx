import {
  component$,
  useContext,
  useWatch$,
  useStore,
  $,
  // Resource,
} from "@builder.io/qwik";
// import { useEndpoint } from "@builder.io/qwik-city";
// import type { RequestHandler } from "@builder.io/qwik-city";
import Page from "~/components/page/page";
import { client } from "~/lib/graphql/client";
import { gql } from "graphql-tag";
import { useLocation } from "@builder.io/qwik-city";
import { Auth0Context } from "~/lib/auth";

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

// export const onGet: RequestHandler<Page> = async ({ params, cookie }) => {
//   try {
//     const userCookie = cookie.get("newt-user");
//     if (userCookie) {
//       const userId = userCookie.value;
//       const c = await client();
//       const pageQuery = await c.query({
//         query: await query(),
//         variables: {
//           key: params._key,
//           ownerId: userId,
//         },
//       });

//       const page = pageQuery.data?.page;
//       return page;
//     }
//   } catch (err) {
//     console.log({ err });
//     return err;
//   }
// };

export default component$(() => {
  // const pageResource = useEndpoint<Page>();
  // return (
  //   <Resource
  //     value={pageResource}
  //     onPending={() => (
  //       <>
  //         <div>Loading...</div>
  //       </>
  //     )}
  //     onRejected={() => {
  //       console.log("REJECTED");
  //       return <h1>DOH</h1>;
  //     }}
  //     onResolved={(page: Page) => <Page key={page?._key} page={page} />}
  //   />
  // );
  const store = useContext(Auth0Context);
  const state = useStore<{ page: Page | null }>({
    page: null,
  });
  console.log(state);
  const { params } = useLocation();

  useWatch$(async ({ track }) => {
    track(() => store.user);

    if (store.user) {
      const pageQuery = await client.query({
        query: await query(),
        variables: {
          key: params._key,
          ownerId: store.user.user_id,
        },
      });

      const page = pageQuery.data?.page;
      console.log({ page });
      if (page) {
        state.page = page;
      }
    }
  });

  return state.page ? <Page key={state.page?._key} page={state.page} /> : null;
});

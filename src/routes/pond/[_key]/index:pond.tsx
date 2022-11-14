import { component$, Resource } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import Pond from "~/components/pond/pond";
import { client } from "~/lib/graphql/client";
import { gql } from "graphql-tag";

const query = gql`
  query GetPond($key: String, $ownerId: String) {
    pond(key: $key, ownerId: $ownerId) {
      _id
      _key
      title
      ownerId
      lastEdited
      private
      pages {
        _id
        _key
        title
        ownerId
        lastEdited
        private
      }
    }
  }
`;

export const onGet: RequestHandler<Pond> = async ({ params, cookie }) => {
  try {
    const userCookie = cookie.get("newt-user");
    if (userCookie) {
      const userId = userCookie.value;
      const pondQuery = await client.query({
        query,
        variables: {
          key: params._key,
          ownerId: userId,
        },
      });

      console.log(pondQuery.data);

      const pond = pondQuery.data?.pond;
      return pond;
    }
  } catch (err) {
    console.log({ err });
    return null;
  }
};

export default component$(() => {
  const pondResource = useEndpoint<Pond>();

  return (
    <Resource
      value={pondResource}
      onPending={() => <Pond />}
      onRejected={() => <div>Error</div>}
      onResolved={(pond) => {
        return <Pond key={pond?._key} pond={pond} />;
      }}
    />
  );
});

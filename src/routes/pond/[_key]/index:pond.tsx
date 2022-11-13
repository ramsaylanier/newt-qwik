import { component$, Resource } from "@builder.io/qwik";
import { useEndpoint } from "@builder.io/qwik-city";
import type { RequestHandler } from "@builder.io/qwik-city";
import { getPond, getPagesFromPond } from "~/lib/database";
import Pond from "~/components/pond/pond";

export const onGet: RequestHandler<Pond> = async ({ params, cookie }) => {
  try {
    const userCookie = cookie.get("newt-user");
    if (userCookie) {
      const pondResult = getPond(params._key, userCookie.value);
      const pagesResult = getPagesFromPond(params._key);
      const [pond, pages] = await Promise.all([pondResult, pagesResult]);

      if (pond) {
        if (pages) {
          pond.pages = pages;
        }
        return pond;
      }
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
        return <Pond key={pond._key} pond={pond} />;
      }}
    />
  );
});

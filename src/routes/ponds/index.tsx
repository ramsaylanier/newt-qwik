import { component$, useContext } from "@builder.io/qwik";
import { Auth0Context } from "~/lib/auth";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  const store = useContext(Auth0Context);
  return (
    <div>
      <h2>Ponds</h2>
      {store.ponds?.map((pond) => {
        return <Link href={`/pond/${pond._key}`}>{pond.title}</Link>;
      })}
    </div>
  );
});

import {
  component$,
  useResource$,
  Resource,
  useStylesScoped$,
} from "@builder.io/qwik";
import styles from "./page-links.css?inline";

interface Props {
  page: Page;
}

export default component$(({ page }: Props) => {
  useStylesScoped$(styles);

  const links = useResource$(async () => {
    try {
      const res = await fetch(`http://localhost:5173/page/api/links`, {
        method: "POST",
        body: JSON.stringify({ page }),
      });

      if (!res.ok) {
        throw Error(res.statusText);
      } else {
        return await res.json();
      }
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <Resource
      value={links}
      onResolved={(links) => {
        return (
          <div class="container">
            <header>
              <h5 class="title">Mentioned In</h5>
            </header>
            <section>
              <ul>
                {links ? (
                  links.map((link: PageEdge) => {
                    return (
                      <li>
                        <a href={`/page/${link.target._key}`}>
                          {link.target.title}
                        </a>
                      </li>
                    );
                  })
                ) : (
                  <div />
                )}
              </ul>
            </section>
          </div>
        );
      }}
    />
  );
});

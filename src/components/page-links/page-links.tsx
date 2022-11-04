import {
  component$,
  useResource$,
  Resource,
  useStylesScoped$,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./page-links.css?inline";
import { getPageLinks } from "~/lib/database";

interface Props {
  page: Page;
}

export default component$(({ page }: Props) => {
  useStylesScoped$(styles);

  const links = useResource$<PageEdge[]>(async () => {
    try {
      const links = (await getPageLinks(page)) || [];
      return links;
    } catch (err) {
      console.log(err);
      return [];
    }
  });

  return (
    <Resource
      value={links}
      onResolved={(links: PageEdge[]) => {
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
                        <Link href={`/page/${link.target._key}`}>
                          {link.target.title}
                        </Link>
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

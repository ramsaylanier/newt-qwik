import {
  component$,
  useResource$,
  Resource,
  useStylesScoped$,
} from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./page-links.css?inline";
import { getPageLinks } from "~/lib/database";
import { load } from "cheerio";

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
                    const excerpt = link.target.content.blocks.find((block) => {
                      const dom = load(block.data?.text);
                      const anchor = dom(`a[data-page-key=${page._key}]`);
                      return anchor.length > 0;
                    });

                    return (
                      <li>
                        <Link href={`/page/${link.target._key}`} class="link">
                          {link.target.title}
                        </Link>

                        {excerpt && (
                          <p
                            class="excerpt"
                            dangerouslySetInnerHTML={excerpt.data.text}
                          />
                        )}
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

import { updatePageContent } from "~/lib/database";
import type { RequestHandler } from "@builder.io/qwik-city";
import { getPageLinks, searchPages, createPage } from "~/lib/database";

export const onPost: RequestHandler = async ({ params, request }) => {
  if (params.api === "create") {
    const { title } = await request.json();

    try {
      const newPage = await createPage({
        title,
      });

      return newPage;
    } catch (err) {
      console.log(err);
    }
  }

  if (params.api === "update") {
    const { id, update } = await request.json();

    try {
      const updatedPageContent = await updatePageContent({
        id,
        update,
      });

      return updatedPageContent;
    } catch (err) {
      console.log(err);
    }
  }

  if (params.api === "links") {
    try {
      const { page } = await request.json();
      const links = await getPageLinks(page);
      return links;
    } catch (err) {
      console.log(err);
    }
  }
};

export const onGet: RequestHandler = async ({ params, url }) => {
  if (params.api === "search") {
    try {
      const query = url.searchParams.get("search");
      console.log({ query });

      if (query) {
        const pages = await searchPages(query);
        return pages;
      } else {
        throw Error("No query!");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

import { updatePageContent } from "~/lib/database";
import type { RequestHandler } from "@builder.io/qwik-city";
import { getPageLinks } from "~/lib/database";

export const onPost: RequestHandler = async ({ params, request }) => {
  if (params.api === "update") {
    const { id, update } = await request.json();

    console.log({ update });

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

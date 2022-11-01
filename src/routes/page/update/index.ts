import { updatePageContent } from "~/lib/database";
import type { RequestHandler } from "@builder.io/qwik-city";

export const onPost: RequestHandler = async ({ request }) => {
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
};

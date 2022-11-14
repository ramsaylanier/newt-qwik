import type { RequestHandler } from "@builder.io/qwik-city";
import { deletePond } from "~/lib/database";

export const onPost: RequestHandler = async ({ params, request, cookie }) => {
  const userCookie = cookie.get("newt-user");
  const userId = userCookie ? userCookie.value : null;

  if (!userId) return null;

  if (params.api === "delete") {
    try {
      const { pondId } = await request.json();
      return await deletePond(pondId, userId);
    } catch (err) {
      console.log(err);
    }
  }
};

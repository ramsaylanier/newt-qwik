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

// export const onGet: RequestHandler = async ({ params, url, cookie }) => {
// const userCookie = cookie.get("newt-user");
// const userId = userCookie ? userCookie.value : null;

// if (params.api === "search") {
//   try {
//     const query = url.searchParams.get("search");

//     if (query) {
//       const pages = await searchPages(query);
//       return pages;
//     } else {
//       throw Error("No query!");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// if (params.api === "currentUserPonds") {
//   console.log({ userId });
//   try {
//     if (userId) {
//       const ponds = await getUserPonds(userId);
//       return ponds;
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
// };

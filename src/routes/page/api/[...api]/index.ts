import type { RequestHandler } from "@builder.io/qwik-city";
import {
  getPageLinks,
  searchPages,
  createPage,
  deletePage,
  getPage,
  updatePageContent,
  updatePageTitle,
  getUserPonds,
} from "~/lib/database";

export const onPost: RequestHandler = async ({ params, request, cookie }) => {
  const userCookie = cookie.get("newt-user");
  const userId = userCookie ? userCookie.value : null;

  // TODO: redirect or error handle
  if (!userId) return null;

  if (params.api === "get") {
    try {
      if (userId) {
        const { pageKey } = await request.json();
        if (pageKey && userId) {
          const page = await getPage(pageKey, userId);
          return page;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (params.api === "create") {
    try {
      const { title, user } = await request.json();
      const newPage = await createPage(title, user);
      return newPage;
    } catch (err) {
      console.log(err);
    }
  }

  if (params.api === "delete") {
    try {
      const { pageId } = await request.json();
      return await deletePage(pageId, userId);
    } catch (err) {
      console.log(err);
    }
  }

  if (params.api === "update") {
    try {
      const { id, update } = await request.json();
      const updatedPageContent = await updatePageContent({
        id,
        update,
      });

      return updatedPageContent;
    } catch (err) {
      console.log(err);
    }
  }

  if (params.api === "updatePageTitle") {
    try {
      const { id, title } = await request.json();
      const updatedPageContent = await updatePageTitle({
        id,
        title,
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

export const onGet: RequestHandler = async ({ params, url, cookie }) => {
  const userCookie = cookie.get("newt-user");
  const userId = userCookie ? userCookie.value : null;

  if (params.api === "search") {
    try {
      const query = url.searchParams.get("search");

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

  if (params.api === "currentUserPonds") {
    try {
      if (userId) {
        const ponds = await getUserPonds(userId);
        return ponds;
      }
    } catch (err) {
      console.log(err);
    }
  }
};

import db from "~/lib/database";
import { aql } from "arangojs";
import { literal } from "arangojs/aql";

export const onPost = async ({ request }) => {
  const { userId } = await request.json();

  if (userId) {
    let filter = `FILTER page.ownerId == '${userId}'`;
    let limit = "";
    try {
      const collection = db.view("pageSearch");
      filter = literal(filter);
      limit = literal(limit);
      const query = await db.query(aql`
          FOR page IN ${collection} 
          ${filter}
          SORT page.lastEdited DESC
          ${limit}
          RETURN page
        `);

      const pages = [];
      for await (const page of query) {
        pages.push(page);
      }

      return pages;
    } catch (e) {
      console.log(e);
    }
  }
};

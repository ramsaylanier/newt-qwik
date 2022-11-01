import { Database, aql } from "arangojs";
import { literal } from "arangojs/aql";
import { File } from "arangojs/foxx-manifest";
import { load } from "cheerio";

const host = import.meta.env.VITE_DATABASE_HOST;
const databaseName = import.meta.env.VITE_DATABASE_NAME;
const username = import.meta.env.VITE_DATABASE_USERNAME;
const password = import.meta.env.VITE_DATABASE_PASSWORD || "";
export const GRAPH_NAME = "pagesGraph";

export const db = new Database({
  url: host,
  databaseName,
  auth: { username, password },
});

export const updatePageContent = async ({
  id,
  update,
}: {
  id: string;
  update: any;
}) => {
  try {
    const collection = await db.collection("Pages");
    const edgeCollection = await db.collection("PageEdges");
    const document = await collection.document(id);
    const updatedDoc = await collection.update(document._key, {
      content: update,
      lastEdited: new Date(),
    });
    const newDocument = await collection.document(updatedDoc);

    updatePageLinks(update, id);

    return newDocument;
  } catch (err) {
    console.log(err);
  }
};

export const updatePageLinks = async (
  pageContent: PageContent,
  pageId: string
) => {
  const contentLinks: any = {};

  // get links from blocks
  pageContent.blocks.forEach((block: any) => {
    const text = block.data?.text;

    if (text) {
      const dom = load(text);
      dom("a").each((_, element) => {
        const pageKey = dom(element).data("page-key") as string;
        if (pageKey) {
          if (contentLinks[pageKey]) {
            contentLinks[pageKey].push(block.id);
          } else {
            contentLinks[pageKey] = [block.id];
          }
        }
      });
    }
  });

  // update existing edges, remove old ones
  const edgeCollection = await db.collection("PageEdges");
  const { edges } = await edgeCollection.outEdges(pageId, {});
  console.log({ edges });
  edges.forEach((edge) => {
    console.log({ edge });
    const contentLink = contentLinks[edge._to];
    if (contentLink) {
      console.log({ contentLink });
      edgeCollection.update(edge._key, {
        blockKeys: contentLink,
      });

      delete contentLinks[edge._to];
    } else {
      edgeCollection.remove(edge._id);
    }
  });

  // create new edges
  Object.keys(contentLinks).forEach((key) => {
    console.log({ key });
    const blockKeys = contentLinks[key];
    try {
      edgeCollection.save({
        _from: pageId,
        _to: `Pages/${key}`,
        blockKeys,
      });
    } catch (e) {
      console.log(e);
    }
  });
};

export const getUserPages = async (userId: string) => {
  if (userId) {
    try {
      const collection = db.view("pageSearch");
      const filter = literal(`FILTER page.ownerId == '${userId}'`);
      const limit = literal("");
      const query = await db.query(aql`
          FOR page IN ${collection} 
          ${filter}
          SORT page.lastEdited DESC
          ${limit}
          RETURN page
        `);

      const pages: Page[] = [];
      for await (const page of query) {
        pages.push(page);
      }

      return pages;
    } catch (e) {
      console.log(e);
    }
  }
};

export const searchPages = async (queryString: string) => {
  try {
    console.log({ queryString });
    const collection = db.view("pageSearch");
    const filter = literal(`FILTER page.title LIKE '%${queryString}%'`);
    const query = await db.query(aql`
        FOR page IN ${collection} 
        ${filter}
        SORT page.lastEdited DESC
        RETURN page
      `);

    const pages: any[] = [];
    for await (const page of query) {
      pages.push({
        href: `/page/${page._key}`,
        name: page.title,
        description: "",
        pageKey: page._key,
      });
    }

    return {
      success: true,
      items: pages,
    };
  } catch (err) {
    console.log(err);
  }
};

export const getPage = async (pageKey: string, user: UserProfile) => {
  try {
    const collection = db.collection("Pages");
    const filter = `FILTER page._key == '${pageKey}'`;
    const cursor = await db.query(aql`
            FOR page IN ${collection}
            ${literal(filter)}
              RETURN page
          `);

    const result = await cursor.next();

    if (!result.private || result.ownerId === user.sub) {
      return result;
    } else {
      throw Error("No access");
    }
  } catch (e) {
    console.log(e);
  }
};

export const getPageLinks = async (page: Page) => {
  try {
    console.log({ page });
    const collection = await db.collection("PageEdges");
    const filter = `FILTER edge._to == ${page._id}`;
    const cursor = await db.query(aql`
      FOR edge IN ${collection}
      FILTER edge._to == ${page._id}
        FOR page IN Pages FILTER page._id == edge._from
        RETURN {edge, page}
    `);

    const result = await cursor.all();
    return result
      .filter((r) => {
        return r.page.ownerId === page.ownerId || !r.page.private;
      })
      .map((r) => {
        r.edge.target = r.page;
        return r.edge;
      });
  } catch (e) {
    console.log(e);
  }
};

// export const makeDb = async () => {
//   try {
//     const useDb = () => {
//       db.useDatabase(name);
//       db.useBasicAuth("root", password);
//     };
//     ``;
//     const exists = await db.exists();

//     if (!exists) {
//       db.useDatabase("_system");
//       await db.createDatabase(name, [{ username }]);
//       useDb();
//     }

//     const pageCollection = db.collection("Pages");
//     const pageCollectionExists = await pageCollection.exists();

//     if (!pageCollectionExists) {
//       pageCollection.create();
//     }

//     const pageEdgeCollection = db.collection("PageEdges");
//     const pageEdgeCollectionExists = await pageEdgeCollection.exists();

//     if (!pageEdgeCollectionExists) {
//       db.createEdgeCollection("PageEdges");
//     }

//     const searchView = db.view("pageSearch");
//     const searchViewExists = await searchView.exists();

//     if (!searchViewExists) {
//       searchView.create();
//     }

//     const viewProps = {
//       links: {
//         Pages: {
//           fields: {
//             title: {
//               analyzers: ["text_en", "identity"],
//             },
//           },
//         },
//       },
//     };
//     await searchView.replaceProperties(viewProps);

//     const graph = db.graph(GRAPH_NAME);
//     const graphExists = await graph.exists();

//     if (!graphExists) {
//       graph.create([
//         {
//           collection: "PageEdges",
//           from: ["Pages"],
//           to: ["Pages"],
//         },
//       ]);
//     }

//     return db;
//   } catch (e) {
//     console.log("ERRRROR", e);
//   }
// };

export default db;

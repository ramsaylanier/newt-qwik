import { Database, aql } from "arangojs";
import type { EdgeCollection } from "arangojs/collection";
import { literal } from "arangojs/aql";
import { load } from "cheerio";
import { updateUserMetadata } from "~/routes/auth/[...auth0]";

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

export const createPage = async (title: string, user: UserProfile) => {
  const collection = db.collection("Pages");
  const edgeCollection = db.collection("PondEdges");
  if (!user) return;
  try {
    const newPage = await collection.save({
      title: title,
      lastEdited: new Date(),
      ownerId: user.user_id,
      private: true,
    });

    edgeCollection.save({
      _from: `Ponds/${user.user_metadata.activePond}`,
      _to: newPage._id,
    });

    return await collection.document(newPage);
  } catch (e) {
    console.log(e);
  }
};

export const deletePage = async (pageId: string, userId: string) => {
  if (!userId) return;
  try {
    const collection = db.collection("Pages");
    const edgeCollection = db.collection("PondEdges");
    const document = await collection.document(pageId);

    if (document.ownerId !== userId) {
      throw Error("You aren't the owner");
    }

    const { edges } = await edgeCollection.edges(document._id, {
      allowDirtyRead: true,
    });

    edges.forEach((edge) => {
      edgeCollection.remove(edge);
    });
    collection.remove(document._key);
    return pageId;
  } catch (e) {
    console.log(e);
  }
};

export const updatePageContent = async ({
  id,
  update,
}: {
  id: string;
  update: any;
}) => {
  try {
    const collection = await db.collection("Pages");
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

export const updatePageTitle = async ({
  id,
  title,
}: {
  id: string;
  title: string;
}) => {
  try {
    const collection = await db.collection("Pages");
    const document = await collection.document(id);
    const updatedDoc = await collection.update(document._key, {
      title,
      lastEdited: new Date(),
    });
    const newDocument = await collection.document(updatedDoc);
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
  edges.forEach((edge) => {
    const contentLink = contentLinks[edge._to];
    if (contentLink) {
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

export const createPond = async (
  title: string,
  userId: string
): Promise<Pond | null> => {
  const collection = db.collection("Ponds");
  try {
    if (!userId) throw Error("No user!");
    const newPond = await collection.save({
      title: title,
      lastEdited: new Date(),
      ownerId: userId,
      private: true,
    });
    return await collection.document(newPond);
  } catch (e) {
    console.log(e);
  }

  return null;
};

export const getUserPonds = async (userId?: string) => {
  if (userId) {
    try {
      const collection = db.view("pondSearch");
      const filter = literal(`FILTER pond.ownerId == '${userId}'`);
      const query = await db.query(aql`
          FOR pond IN ${collection}
          ${filter}
          SORT pond.lastEdited DESC
          RETURN pond
        `);

      const ponds: Pond[] = [];
      for await (const pond of query) {
        ponds.push(pond);
      }

      // create new pond
      if (ponds.length === 0) {
        const newPond = await createPond("My First Pond", userId);
        if (newPond) {
          updateUserMetadata(userId, { activePond: newPond._key });
        }
      }

      return ponds;
    } catch (e) {
      console.log(e);
    }
  }

  return [];
};

export const getPagesFromPond = async (pond?: Pond): Promise<Page[]> => {
  if (pond) {
    try {
      const pages = [];
      const query = await db.query(aql`
          FOR pond IN Ponds
          FILTER pond._id == ${pond._id}
            FOR page IN OUTBOUND pond PondEdges
            RETURN page
        `);

      for await (const page of query) {
        console.log({ page });
        pages.push(page);
      }

      console.log({ pages });
      return pages;
    } catch (e) {
      console.log(e);
    }
  }

  return [];
};

// used when hyperlinking pages together in the editor
export const searchPages = async (queryString: string) => {
  try {
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

export const getPage = async (pageKey: string, userId: string) => {
  try {
    console.log({ pageKey, userId });
    const cursor = await db.query(aql`
            FOR page IN Pages
            FILTER page._key == ${pageKey}
              RETURN page
          `);

    const result = await cursor.next();

    console.log({ result });

    if (!result.private || result.ownerId === userId) {
      return result;
    } else {
      throw Error("No access");
    }
  } catch (e) {
    console.log(e);
  }
};

interface PageResult {
  edge: PageEdge;
  page: Page;
}

export const getPageLinks = async (page: Page) => {
  try {
    const collection = await db.collection("PageEdges");
    const cursor = await db.query<PageResult>(aql`
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
      .map<PageEdge>((r) => {
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

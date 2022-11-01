import { Database, aql } from "arangojs";
import { literal } from "arangojs/aql";

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
    return newDocument;
  } catch (err) {
    console.log(err);
  }
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

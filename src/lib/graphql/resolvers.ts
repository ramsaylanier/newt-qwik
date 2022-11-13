import {
  getPage,
  getPond,
  getPondEdgesForPage,
  getPondEdgesForPond,
  getUserPonds,
} from "../database";

export const resolvers = {
  Pond: {
    pages: (parent: Page) => {
      console.log({ parent });
      return getPondEdgesForPond(parent._key);
    },
  },
  Page: {
    ponds: (parent: Page) => {
      return getPondEdgesForPage(parent._key);
    },
    content: (parent: Page) => {
      return parent.content;
    },
  },
  Query: {
    ponds(_: Pond, args: any) {
      return getUserPonds(args.ownerId);
    },
    pond(_: Pond, args: any) {
      return getPond(args.key, args.ownerId);
    },
    page(_: Page, args: any) {
      return getPage(args.key, args.ownerId);
    },
  },
};

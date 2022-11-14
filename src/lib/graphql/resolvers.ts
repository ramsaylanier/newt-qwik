import {
  getPage,
  getPond,
  getPondEdgesForPage,
  getPondEdgesForPond,
  getUserPonds,
  createPond,
  createPage,
} from "../database";
import type { IExecutableSchemaDefinition } from "@graphql-tools/schema";

export const resolvers: IExecutableSchemaDefinition<any>["resolvers"] = {
  Pond: {
    pages: (parent: Page) => {
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
    ponds(_: Pond, args) {
      return getUserPonds(args.ownerId);
    },
    pond(_: Pond, args) {
      return getPond(args.key, args.ownerId);
    },
    page(_: Page, args) {
      return getPage(args.key, args.ownerId);
    },
  },
  Mutation: {
    createPond(_, args, context) {
      console.log({ args, context });
      return createPond(args.title, context.user);
    },
    createPage(_, args, context) {
      return createPage(args.title, context.user);
    },
  },
};

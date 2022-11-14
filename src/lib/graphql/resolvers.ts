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
import { getUserWithMetadata } from "~/routes/auth/[...auth0]/index:auth";

export const resolvers: IExecutableSchemaDefinition<any>["resolvers"] = {
  User: {
    ponds: (parent: UserProfile) => {
      return getUserPonds(parent.user_id);
    },
    activePond: (parent: UserProfile, args, context) => {
      if (parent.user_metadata.activePond) {
        return getPond(parent.user_metadata?.activePond, context.user);
      }
    },
  },
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
    currentUser(_: UserProfile, args, context) {
      return getUserWithMetadata(context.user);
    },
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

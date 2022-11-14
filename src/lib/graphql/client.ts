// import { ApolloClient, InMemoryCache } from "@apollo/client/core/core.cjs";
// import { createHttpLink } from "@apollo/client/link/http/http.cjs";

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

export const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: "http://dev.newt:5173/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

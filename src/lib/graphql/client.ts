import { ApolloClient, InMemoryCache } from "@apollo/client/core/core.cjs";
import { createHttpLink } from "@apollo/client/link/http/http.cjs";

export const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: createHttpLink({
    uri: "http://dev.newt:5173/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
import { $ } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";
import { ApolloServer, ContextFunction } from "@apollo/server";
import typeDefs from "~/lib/graphql/typeDefs";
import { resolvers } from "~/lib/graphql/resolvers";

const defaultContext: ContextFunction<[], any> = async () => ({});
const contextFunction = defaultContext;

let server: ApolloServer;

export const apolloServer = $(
  () =>
    new ApolloServer({
      typeDefs,
      resolvers,
    })
);

apolloServer().then((r) => {
  r.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();
  server = r;
});

export const onRequest: RequestHandler = async ({ request, response }) => {
  const formData = await request.formData();
  const body = JSON.parse(Array.from(formData.keys())[0]);
  const headers = new Map<string, string>();

  for (const [key, value] of Object.entries(request.headers)) {
    if (value !== undefined) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }
  headers.set("apollo-require-preflight", "false");

  const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
    context: () => contextFunction(),
    httpGraphQLRequest: {
      body,
      headers,
      method: request.method.toUpperCase() || "POST",
      search: "",
    },
  });

  for (const [key, value] of httpGraphQLResponse.headers) {
    response.headers.set(key, value);
  }

  response.status = httpGraphQLResponse.status || 200;
  if (httpGraphQLResponse.body.kind === "complete") {
    console.log("RESPONSE", JSON.parse(httpGraphQLResponse.body.string));
    return JSON.parse(httpGraphQLResponse.body.string);
  }

  for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
    console.log({ chunk });
    // response.write(chunk);
    if (typeof (response as any).flush === "function") {
      (response as any).flush();
    }
  }
};

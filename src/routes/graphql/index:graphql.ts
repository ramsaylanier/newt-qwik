import { ApolloServer, ContextFunction } from "@apollo/server";
import typeDefs from "~/lib/graphql/typeDefs";
import { resolvers } from "~/lib/graphql/resolvers";
import { RequestHandler } from "@builder.io/qwik-city";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();

const defaultContext: ContextFunction<[], any> = async () => ({});
const contextFunction = defaultContext;

export const onRequest: RequestHandler = async ({ request, response }) => {
  console.log({ request });
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
};

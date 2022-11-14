import { gql } from "graphql-tag";

export default gql`
  scalar GenericScalar

  type User {
    user_id: String
    ponds: [Pond]
  }

  type Pond {
    _id: String
    _key: String
    title: String
    ownerId: String
    owner: User
    lastEdited: String
    private: Boolean
    pages: [Page]
  }

  type Page {
    _id: String
    _key: String
    title: String
    ownerId: String
    owner: User
    lastEdited: String
    private: Boolean
    ponds: [Pond]
    content: GenericScalar
  }

  type Query {
    ponds(ownerId: String): [Pond]
    pond(key: String, ownerId: String): Pond
    page(key: String, ownerId: String): Page
  }

  type Mutation {
    createPond(title: String, private: Boolean): Pond
    createPage(title: String, private: Boolean): Page
  }
`;

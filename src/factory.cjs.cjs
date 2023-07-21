const { makeExecutableSchema } = require("@graphql-tools/schema");
const { addMocksToSchema } = require("@graphql-tools/mock");
const { graphqlSync } = require("graphql");

const schemaString = `type User {
  id: String!
  name: String!
}
type Query {
  me: User
}
type Mutation {
  changeMyName(newName: String!): User!
}`;

const queryString = /* GraphQL */ `
  query tasksForUser {
    me {
      id
      name
    }
  }
`;

const schema = makeExecutableSchema({ typeDefs: schemaString });

// see original code of `mockServer` - https://github.com/ardatan/graphql-tools/blob/%40graphql-tools/schema%4010.0.0/packages/mock/src/mockServer.ts
// we are doing basically the same, but on our end now it fails
const mockedSchema = addMocksToSchema({ schema });

const result = graphqlSync({ schema: mockedSchema, source: queryString });
console.log(result);

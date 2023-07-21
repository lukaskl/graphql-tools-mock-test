import { graphqlSync, buildSchema, graphql } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema, mockServer } from "@graphql-tools/mock";

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

describe("working cases (but not what we want)", () => {
  it("original case (without mocking)", () => {
    const schema = buildSchema(schemaString);

    // this is what we want - we want to execute graphql operation on our schema
    // using SYNC variation of the graphql (we really don't have anything async going on)
    const result = graphqlSync({
      schema,
      source: queryString,
    });

    // it works - however, without mocks we are getting null
    console.log(result);
  });

  it("using mockedServer", async () => {
    const schema = makeExecutableSchema({ typeDefs: schemaString });

    const mockedServer = mockServer(schema, {});

    // it works! But the problem here is that it requires to use async code - which would be annoying to us
    // see original code: https://github.com/ardatan/graphql-tools/blob/%40graphql-tools/schema%4010.0.0/packages/mock/src/mockServer.ts
    const result = await mockedServer.query(queryString, {});
    console.log(result);
  });
});

describe("failing cases", () => {
  it("replicating mockedServer but on our end", async () => {
    const schema = makeExecutableSchema({ typeDefs: schemaString });

    // see original code of `mockServer` - https://github.com/ardatan/graphql-tools/blob/%40graphql-tools/schema%4010.0.0/packages/mock/src/mockServer.ts
    // we are doing basically the same, but on our end now it fails
    const mockedSchema = addMocksToSchema({ schema });

    const result = await graphql({ schema: mockedSchema, source: queryString });
    console.log(result);
  });

  it("add mocks to graphql's schema", () => {
    const schema = buildSchema(schemaString);
    const mockedSchema = addMocksToSchema({ schema });

    // code never reaches this step:
    // const result = graphqlSync({
    //   schema: mockedSchema,
    //   source: queryString,
    // });
  });

  it("parse schema using @graphql-tools/schema and use it with graphql's `graphqlSync`", () => {
    // see the source code at:
    // https://github.com/ardatan/graphql-tools/blob/%40graphql-tools/schema%4010.0.0/packages/schema/src/makeExecutableSchema.ts
    const schema = makeExecutableSchema({ typeDefs: schemaString });

    const result = graphqlSync({
      schema,
      source: queryString,
    });
    console.log(result);
  });
});

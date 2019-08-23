import { makePrismaSchema } from 'nexus-prisma';
import path from 'path';
import { ApolloServer } from 'apollo-server';
import datamodelInfo from './generated/nexus-prisma';
import { prisma } from './generated/prisma-client';
import * as types from './schema';

const schema = makePrismaSchema({
  types,
  prisma: {
    datamodelInfo,
    client: prisma,
  },
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/typegen.ts'),
  },
  nonNullDefaults: {
    input: true,
    output: false,
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, './typeDefs.ts'),
        alias: 't',
      },
    ],
    contextType: 't.Context',
  },
});

const server = new ApolloServer({
  schema,
  // mocks: true,
  context: { prisma },
});

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server ready at ${url}`);
});

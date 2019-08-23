import { prismaObjectType } from 'nexus-prisma';

export const Pokemon = prismaObjectType({
  name: 'Pokemon',
  definition(t) {
    t.prismaFields([
      '*',
      {
        name: 'content',
        alias: 'body',
      },
    ]);
    t.string('uppercaseTitle', {
      resolve: ({ title }) => title.toUpperCase(),
    });
  },
});

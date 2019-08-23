import { prismaObjectType } from 'nexus-prisma';

export const User = prismaObjectType({
  name: 'User',
  definition(t) {
    t.prismaFields([
      'id',
      'name',
      {
        name: 'posts',
        args: ['where', 'orderBy'],
      },
      'email',
    ]);
  },
});

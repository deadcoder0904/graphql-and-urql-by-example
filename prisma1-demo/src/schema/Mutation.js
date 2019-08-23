import { prismaObjectType } from 'nexus-prisma';

export const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['createPokemon']);

    // t.field('publish', {
    //   type: 'Post',
    //   nullable: true,
    //   args: {
    //     id: idArg(),
    //   },
    //   resolve: (parent, { id }, ctx) => {
    //     return ctx.prisma.updatePost({
    //       where: { id },
    //       data: { published: true },
    //     });
    //   },
    // });
  },
});

// export const createDraft = mutationField('createDraft', {
//   type: 'Post',
//   args: {
//     title: stringArg(),
//     content: stringArg({ nullable: true }),
//     authorEmail: stringArg(),
//   },
//   resolve: (parent, { title, content, authorEmail }, ctx) => {
//     return ctx.prisma.createPost({
//       title,
//       content,
//       author: {
//         connect: { email: authorEmail },
//       },
//     });
//   },
// });

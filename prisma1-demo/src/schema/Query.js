import { prismaObjectType } from 'nexus-prisma';

export const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.crud.findManyPokemon({
      alias: 'pokemons'
    })

    t.list.field('pokemon', {
      type: 'Pokemon',
      args: {
        name: stringArg(),
      },
      resolve: (parent, { name }, ctx) => {
        return ctx.prisma.pokemon.findMany({
          where: {
              name
          }
        })
      },
    })
  },
});

const { GraphQLServer } = require('graphql-yoga')
const { join } = require('path')
const { prismaObjectType, makePrismaSchema } = require('nexus-prisma')
const { idArg } = require('nexus')
const { prisma } = require('./generated/prisma-client')
const datamodelInfo = require('./generated/nexus-prisma')
/* 
const resolvers = {
  Query: {
    pokemons: (parent, args, ctx) => {
      return ctx.prisma.pokemons()
    },
    pokemon: (parent, { name }, ctx) => {
      return ctx.prisma.pokemon({
        where: { name }
      })
    },
  },
  Mutation: {
    createPokemon: (parent, { number, name }, ctx) => {
      return ctx.prisma.createPokemon({
        number,
        name,
      })
    },
  },  
  Subscription: {
    pokemon: {
      subscribe: async (parent, args, context) => {
        return context.prisma.$subscribe
          .pokemon({
            mutation_in: ['CREATED', 'UPDATED'],
          })
          .node()
      },
      resolve: payload => {
        return payload
      },
    },
  },
} */

const Attack = objectType({
  name: "Attack",
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.damage()
  }
})

const PokemonAttack = objectType({
  name: "PokemonAttack",
  definition(t) {
    t.model.id()
    t.model.special()
  }
})

const Pokemon = objectType({
  name: "Pokemon",
  definition(t) {
    t.model.id()
    t.model.number()
    t.model.name()
    t.model.attacks()
  }
})

const Query = objectType({
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
        return ctx.photon.pokemon.findMany({
          where: {
              name
          }
        })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.crud.createOnePokemon({ alias: 'addPokemon' })
  },
})

const Subscription = subscriptionField('newPokemon', {
  type: 'Pokemon',
  subscribe: (parent, args, ctx) => {
    return ctx.photon.$subscribe.pokemon()
  },
  resolve: payload => payload
})

/* const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    prisma,
  },
}) */

const schema = makePrismaSchema({
  types: [Query, Mutation, Subscription, Pokemon, Attack, PokemonAttack],
  prisma: {
    datamodelInfo,
    client: prisma,
  },
  outputs: {
    schema: join(__dirname, './generated/schema.graphql'),
    typegen: join(__dirname, './generated/nexus.ts'),
  },
})

const server = new GraphQLServer({
  schema,
  context: { prisma },
})

server.start(() => console.log('Server is running on http://localhost:4466'))

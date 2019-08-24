const { GraphQLServer } = require('graphql-yoga')
const { join } = require('path')
const { makeSchema, objectType, idArg, stringArg, subscriptionField } = require('@prisma/nexus')
const Photon = require('@generated/photon')
const { nexusPrismaPlugin } = require('@generated/nexus-prisma')

const photon = new Photon()

const nexusPrisma = nexusPrismaPlugin({
  photon: ctx => ctx.photon,
})

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
        });
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

const schema = makeSchema({
  types: [Query, Mutation, Subscription, Pokemon, Attack, PokemonAttack, nexusPrisma],
  outputs: {
    schema: join(__dirname, '/schema.graphql')
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@generated/photon',
        alias: 'photon',
      },
    ],
  },
})

const server = new GraphQLServer({
  schema,
  context: request => {
    return {
      ...request,
      photon,
    }
  },
})

server.start(() => console.log(`🚀 Server ready at http://localhost:4000`))

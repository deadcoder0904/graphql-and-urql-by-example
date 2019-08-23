import { prisma } from '../src/generated/prisma-client';

async function main() {
  await prisma.createPokemon({
    name: "Pikachu",
    id: '123132',
    number: 215,
    attacks: {
      create: {
        special: {
          create: {
            name: "Abra cadabra",
            damage: "100",
          }
        }
      }
    }
  })

  await prisma.createPokemon({
    name: "Raichu",
    id: '940910',
    number: 21,
    attacks: {
      create: {
        special: {
          create: {
            name: "Zopaychay",
            damage: "10",
          }
        }
      }
    }
  })


  await prisma.createPokemon({
    name: "Snorlax",
    id: '290',
    number: 900,
    attacks: {
      create: {
        special: {
          create: {
            name: "Khaychay",
            damage: "500",
          }
        }
      }
    }
  })
}

// eslint-disable-next-line no-console
main().catch(e => console.error(e));

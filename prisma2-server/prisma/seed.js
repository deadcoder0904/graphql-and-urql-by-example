const Photon = require('@generated/photon')
const photon = new Photon.default()

async function main() {
  const pikachu = await photon.pokemon.create({
    data: {
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
    }
  })
  console.log({ pikachu })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await photon.disconnect()
  })

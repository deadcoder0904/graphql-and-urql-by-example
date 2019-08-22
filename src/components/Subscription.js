import React from 'react'
import { Subscription } from 'urql'

const newPokemon = `
  subscription PokemonSub {
    newPokemon {
      id
			number
			name
			attacks {
				special {
					name
					type
					damage
				}
			}
    }
  }
`

export const NewPokemonSubscription = () => (
  <Subscription query={newPokemon}>
    {({ fetching, data, error }) => {
      if (fetching) {
        return `Loading...`
      } else if (error) {
        return `Oh no! Error: ${error}`
      }

      const { newPokemon } = data
      return (
        <>
          <h1>
            #{newPokemon.number} {newPokemon.name}
          </h1>
          <ul>
            {newPokemon.attacks.special.map(({ name, type, damage }) => (
              <li key={name}>
                {name} ({type}) - {damage}
              </li>
            ))}
          </ul>
        </>
      )
    }}
  </Subscription>
)
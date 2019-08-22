import React from 'react';
import { useSubscription } from 'urql';

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

export const NewPokemonSubscriptionHook = () => {
  const [{ fetching, data, error }] = useSubscription({ query: newPokemon }, (pokemons = [], res) => {
		return [res.newPokemon, ...pokemons] 
	})

  if (fetching) {
    return `Loading...`
  } else if (error) {
    return `Oh no! Error: ${error}`
  }
	return (
		<>
			{data.map(pokemon => {
			  const { newPokemon } = pokemon
				return (
					<div key={newPokemon.number}>
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
					</div>
				)
			})}
		</>
	)
}
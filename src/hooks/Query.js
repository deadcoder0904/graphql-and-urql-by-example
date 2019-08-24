import React from "react";
import { useQuery } from "urql";

const getPokemonData = `
	query GetPokemonData($name: String!) {
		pokemon(name: $name) {
			id
			number
			name
			attacks {
				special {
					id
					name
					damage
				}
			}
		}
	}
`;

export const ListPokemonDataHook = ({ name = "Pikachu" }) => {
	const [{ fetching, data, error }] = useQuery({
		query: getPokemonData,
		variables: { name },
	})

	if (fetching) {
		return `Loading ${name}...`;
	} else if (error) {
		return `Oh no! Error: ${error}`;
	}

	const pokemon = data.pokemon[0];
	return (
		<>
			<h1>
				#{pokemon.number} {pokemon.name}
			</h1>
			<ul>
				{pokemon.attacks.special.map(({ name, id, damage }) => (
					<li key={name}>
						#{id} {name} - {damage}
					</li>
				))}
			</ul>
		</>
	);
}

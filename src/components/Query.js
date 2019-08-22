import React from 'react';
import { useQuery } from "urql";

const getPokemonData = `
	query GetPokemonData($name: String!) {
		pokemon(name: $name) {
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
`;

export const ListPokemonDataQuery = ({ name = "Pikachu" }) => {
	const [{ fetching, data, error }] = useQuery({
		query: getPokemonData,
		variables: { name }
	});

	if (fetching) {
		return `Loading ${name}...`;
	} else if (error) {
		return `Oh no! Error: ${error}`;
	}

	const { pokemon } = data;
	return (
		<>
			<h1>
				#{pokemon.number} {pokemon.name}
			</h1>
			<ul>
				{pokemon.attacks.special.map(({ name, type, damage }) => (
					<li key={name}>
						{name} ({type}) - {damage}
					</li>
				))}
			</ul>
		</>
	);
};

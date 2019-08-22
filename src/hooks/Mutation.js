import React, { useState } from 'react'
import { useMutation } from 'urql'

const addPokemon = `
  mutation AddPokemon($name: String!) {
    addPokemon(name: $name) {
      id
      name
    }
  }
`

export const InsertPokemonHook = () => {
  const [name, setName] = useState('')
	const [{ fetching, data, error }, executeMutation] = useMutation(addPokemon)

  return (
    <>
      {error && <div>Error: {error}</div>}
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => executeMutation({ name })}>Add Pokemon</button>
    </>
  )
}
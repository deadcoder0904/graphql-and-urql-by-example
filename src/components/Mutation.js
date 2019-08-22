import React, { useState } from 'react'
import { Mutation } from 'urql'

const addPokemon = `
  mutation AddPokemon($name: String!) {
    addPokemon(name: $name) {
      id
      name
    }
  }
`

export const InsertPokemonMutation = () => {
  const [name, setName] = useState('')
  return (
    <Mutation query={addPokemon}>
      {({ fetching, data, error, executeMutation }) => (
        <>
          {error && <div>Error: {error}</div>}
          <input value={name} onChange={e => setName(e.target.value)} />
          <button onClick={() => executeMutation({ name })}>Add Pokemon</button>
        </>
      )}
    </Mutation>
  )
}
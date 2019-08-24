import React, { useState } from 'react';
import { useMutation } from 'urql';

const addPokemon = `
  mutation AddPokemon($number: Int!, $name: String!) {
    addPokemon(data: {
      number: $number,
      name: $name
    }) {
      id
      number
      name
    }
  }
`

export const InsertPokemonHook = () => {
  const [name, setName] = useState('')
  const [{ fetching, data, error }, executeMutation] = useMutation(addPokemon)
  return (
    <>
      {error && <div>Error: {JSON.stringify(error)}</div>}
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => {
        if (name.trim() === "") return
        executeMutation({ name, number: Math.ceil(Math.random() * 1000) })
        setName("")
      }}>
        Add Pokemon
      </button>
      {data && (<div>
        <br/>
        Mutation successful: 
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>)}
    </>
  )
}
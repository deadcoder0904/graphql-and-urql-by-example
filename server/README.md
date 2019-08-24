# server

First, make sure you have `prisma2` installed globally. If you don't have it globally installed, then go ahead and install it globally using `yarn`:

```bash
$ yarn global add prisma2
```

Then go into the `server/` directory and install the dependencies using `yarn`:

```bash
$ cd server
$ yarn
```

This will also run the `postinstall` script in `package.json` which runs `prisma2 generate`.

You must run `prisma2 generate` everytime you change the `prisma.schema` file.

After that, create a migration using `prisma2 lift --save init` and then `prisma2 lift up`.

Insert seed data into the SQLite database using:

```bash
$ yarn seed
```

Now start the server using:

```bash
$ yarn start
```

Use the following queries and mutations:

```graphql
# list all pokemons
query pokemons {
  pokemons {
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

# query a pokemon
query pokemon {
  pokemon(name: "Raichu") {
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

# add a pokemon
mutation addPokemon {
  addPokemon(data: {
    number: 1,
    name: "Raichu"
  }) {
    id
    number
    name
  }
}

# subscribe when new pokemon is added
subscription PokemonSub {
  newPokemon {
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
```

Unfortunately, [subscriptions](https://github.com/prisma/prisma2/issues/298) aren't supported yet by Prisma 2. But I'll add them as soon as they are :)
import React from "react";
import { Client, Provider, defaultExchanges, subscriptionExchange } from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";

import { ListPokemonDataQuery } from "./components/Query";
import { InsertPokemonMutation } from "./components/Mutation";
import { NewPokemonSubscription } from "./components/Subscription";

import { ListPokemonDataHook } from "./hooks/Query";
import { InsertPokemonHook } from "./hooks/Mutation";
import { NewPokemonSubscriptionHook } from "./hooks/Subscription";

const subscriptionClient = new SubscriptionClient(
  "ws://localhost:4001/graphql",
  {
		reconnect: true,
    timeout: 20000
	}
);

const client = new Client({
  url: "http://localhost:3000/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});

const App = () => (
  <Provider value={client}>
		<h1>Render Props</h1>

		<h3>`Query` component</h3>
    <ListPokemonDataQuery />
		
		<h3>`Mutation` component</h3>
		<InsertPokemonMutation />

		<h3>`Subscription` component</h3>
		<NewPokemonSubscription />
		
		<h1>Hooks</h1>

		<h3>`useQuery` Hook</h3>
		<ListPokemonDataHook />

		<h3>`useMutation` Hook</h3>
		<InsertPokemonHook />

		<h3>`useSubscription` Hook</h3>
		<NewPokemonSubscriptionHook />
  </Provider>
);

export default App
import React from "react";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Client, defaultExchanges, Provider, subscriptionExchange } from "urql";
import { InsertPokemonMutation } from "./components/Mutation";
import { ListPokemonDataQuery } from "./components/Query";
import { NewPokemonSubscription } from "./components/Subscription";
import { InsertPokemonHook } from "./hooks/Mutation";
import { ListPokemonDataHook } from "./hooks/Query";
import { NewPokemonSubscriptionHook } from "./hooks/Subscription";

const subscriptionClient = new SubscriptionClient(
  "ws://localhost:4001/graphql",
  {
		reconnect: true,
    timeout: 20000
	}
);

const client = new Client({
  url: "http://localhost:4000",
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
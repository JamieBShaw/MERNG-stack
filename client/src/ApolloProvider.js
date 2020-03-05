import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";

import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
	uri: "http://localhost:5000"
});

const authLink = setContext(() => {
	const token = localStorage.getItem("token");
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : ""
		}
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
	connectToDevTools: true
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);

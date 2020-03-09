import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";

import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
	uri: "http://localhost:5000"
});

const errorLink = onError(({ graphQLErrors }) => {
	if (graphQLErrors) {
		return (graphQLErrors.errors = undefined);
	}
});

const authLink = setContext(() => {
	const token = localStorage.getItem("token");
	const refreshToken = localStorage.getItem("refreshToken");

	return {
		headers: {
			authorizationToken: token ? `Bearer ${token}` : "",
			authorizationRefreshToken: refreshToken ? `Bearer ${refreshToken}` : ""
		}
	};
});

const client = new ApolloClient({
	link: errorLink.concat(authLink.concat(httpLink)),
	cache: new InMemoryCache()
});

export default (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
);

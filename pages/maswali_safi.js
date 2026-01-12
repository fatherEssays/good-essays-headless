// lib/graphql-client.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API, // Your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;

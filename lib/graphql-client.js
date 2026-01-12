import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://blog.good-essays.com/graphql', // your live WordPress site
  cache: new InMemoryCache(),
});

export default client;

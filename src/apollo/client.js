import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';


export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://netlify-bookmarking-app.netlify.app/.netlify/functions/bookmarks',
    fetch,
  }),
  cache: new InMemoryCache()
});
 


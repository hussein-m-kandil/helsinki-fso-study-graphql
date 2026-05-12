import { HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/client/react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';

export const TOKEN_STORAGE_KEY = 'seco_seco';

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token
    ? { headers: { ...prevContext.headers, authorization: `Bearer ${token}` } }
    : {};
});

const httpLink = new HttpLink({ uri: 'http://localhost:4000/' });

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </StrictMode>,
);

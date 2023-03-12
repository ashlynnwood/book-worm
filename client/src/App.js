import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
// Import apollo
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create graphql endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Create request middleware for auth
const authLink = setContext((_, { headers }) => {
  // Get auth token from local storage
  const token = localStorage.getItem('id_token');
    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
});

const client = new ApolloClient({
  // Set up client to execute the `authLink` middleware prior to making the request to GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  // Wrap router with apollo tag
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route 
              path='/' 
              element={<SearchBooks />} 
            />
            <Route 
              path='/saved' 
              element={<SavedBooks />} 
            />
            <Route 
              path='*'
              element={<h1 className='display-2'>Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;

// TODO: refactor code for graphql, reference activity 26

const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

// TODO: require typedefs, resolvers, apolloserver
const { typeDefs, resolvers } = require('./schemas');
const { ApolloServer } = require('apollo-server-express');

const app = express();
const PORT = process.env.PORT || 3001;
// TODO: call your server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// TODO: refactor routes to instead call startApolloServer
// app.use(routes);
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

db.once('open', () => {
  app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  });
};

// Call the async function to start the server
  startApolloServer(typeDefs, resolvers);
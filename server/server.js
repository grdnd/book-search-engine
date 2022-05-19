// import express & path packages
const express = require("express");
const path = require("path");

// import ApolloServer express module
const { ApolloServer } = require("apollo-server-express");

// letting go of routes
// const routes = require('./routes');

// establish Apollo Server
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

// path to database connection
const db = require("./config/connection");

// create new Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// create express app
const app = express();

// PORT
const PORT = process.env.PORT || 3001;

// apply Apollo Server middleware to our app
server.applyMiddleware({ app });

// switch to false
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    // TODO: describe user model
  }

  type Book {
    // TODO: describe Book
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser( // args (email, password, usrname) ): // response- auth
    saveBook( // args ): // response- array of books
    removeBook( // args ): // response
  }
`;

module.exports = typeDefs;
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
    bookCount: Int

  }

  type Book {
    authors: [String]
    description: String!
    title: String!
    link: String
    image: String
    bookId: String!
  }

  type Auth {
    token: ID!
    user: User
  }
  
  input BookInput {
    authors: [String]
    description: String!
    title: String!
    link: String
    image: String
    bookId: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook( // args ): // response- array of books
    removeBook( // args ): User
  }
`;

module.exports = typeDefs;
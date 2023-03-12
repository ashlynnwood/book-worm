// Delete contollers folder and refactor into resolvers
// instead of response.json, return the user method, etc.
// look at 26

const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // find current user and return userData
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      // create new user, sign token, return token and user data
    },
    login: async (parent, { email, password }) => {
      // find user, check password, sign token, return token and user data
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
    },
    saveBook: async (parent, args, context) => {
      // protect route, find current user, update their savedBooks array, return user data
    },
    removeBook: async (parent, args, context) => {
      // protect route, find current user, update their savedBooks array, return user data
    },
  },
};

module.exports = resolvers;
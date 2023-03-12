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
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('books');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (_, { username, email, password }) => {
      // create new user, sign token, return token and user data
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
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
    saveBook: async (_, { bookData }, { user }) => {
      // protect route, find current user, update their savedBooks array, return user data
      
      if (user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );

        return updatedUser.savedBooks;
      }
      throw new AuthenticationError('You need to be logged in to save a book!');
    },
    removeBook: async (_, args, { user }) => {
      // protect route, find current user, update their savedBooks array, return user data
    },
  },
};

module.exports = resolvers;
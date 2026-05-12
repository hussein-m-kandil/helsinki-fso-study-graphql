const { GraphQLError } = require('graphql');
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),

    authorCount: () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      let filters = {};
      if (args.genre) filters.genres = { $all: [args.genre] };
      if (args.author) {
        if (mongoose.isObjectIdOrHexString(args.author)) {
          filters.author = args.author;
        } else {
          const author = await Author.findOne({ name: args.author });
          if (author) filters.author = author;
          else return [];
        }
      }
      return await Book.find(filters).populate('author');
    },

    allAuthors: async () => await Author.find({}),

    me: (root, args, context) => context.currentUser,
  },

  Author: {
    bookCount: (root) => Book.collection.countDocuments({ author: root._id }),
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      let author = await Author.findOne({ name: args.author });

      try {
        if (!author) author = await Author.create({ name: args.author });
      } catch (error) {
        throw new GraphQLError(`Saving author failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error,
          },
        });
      }

      try {
        const book = await Book.create({ ...args, author });

        currentUser.books = currentUser.books.concat(book);
        await currentUser.save();

        return book;
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args, error },
        });
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;

      try {
        author.born = args.setBornTo;
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error,
          },
        });
      }
    },

    createUser: async (root, args) => {
      try {
        return await User.create({ ...args });
      } catch (error) {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        });
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError(
          '_resetDatabase is only available in test mode',
        );
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },
};

module.exports = resolvers;

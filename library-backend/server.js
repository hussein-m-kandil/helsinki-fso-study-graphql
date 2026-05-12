const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloServer } = require('@apollo/server');
const resolvers = require('./resolvers');
const User = require('./models/user');
const typeDefs = require('./schema');
const jwt = require('jsonwebtoken');

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
  return User.findById(decodedToken.id).populate('books');
};

function startServer(port) {
  startStandaloneServer(new ApolloServer({ typeDefs, resolvers }), {
    listen: { port },
    context: async ({ req }) => {
      const auth = req.headers.authorization;
      const currentUser = await getUserFromAuthHeader(auth);
      return { currentUser };
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
}

module.exports = startServer;

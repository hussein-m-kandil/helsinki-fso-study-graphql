const mongoose = require('mongoose');

const hideUriCredentials = (uri) => {
  if (typeof uri !== 'string') return uri;
  return uri
    .replace(/(?<=.+:\/\/).+(?=:)/, '<user>')
    .replace(/(?<=.+:\/\/.+:).+(?=@)/, '<password>');
};

const connectToDatabase = async (uri) => {
  console.log('connecting to database URI:', hideUriCredentials(uri));
  try {
    mongoose.set('bufferTimeoutMS', 57 * 1000);
    await mongoose.connect(uri);
    console.log('connected to MongoDB');
  } catch (error) {
    console.log('error connection to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;

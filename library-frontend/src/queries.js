import { gql } from '@apollo/client';

const authorEntries = `
  id
  born
  name
  bookCount
`;

export const ALL_AUTHORS = gql` query { allAuthors { ${authorEntries} } } `;

export const EDIT_AUTHOR = gql`
  mutation updateAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) { ${authorEntries} }
  }
`;

const bookEntries = `
  id
  title
  genres
  published
  author { ${authorEntries} }
`;

export const ALL_BOOKS = gql`
  query getAllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      ${bookEntries}
    }
  }
`;

export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      genres: $genres
      published: $published
    ) { ${bookEntries} }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const userEntries = `
  id
  username
  favoriteGenre
`;

export const REGISTER = gql`
  mutation register($username: String!, $favoriteGenre: String!) {
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
      ${userEntries}
    }
  }
`;

export const ME = gql`
  query {
    me {
      ${userEntries}
    }
  }
`;

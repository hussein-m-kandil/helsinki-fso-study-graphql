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
  author
  genres
  published
`;

export const ALL_BOOKS = gql` query { allBooks { ${bookEntries} } } `;

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

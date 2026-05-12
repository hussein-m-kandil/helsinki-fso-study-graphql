import { useQuery } from '@apollo/client/react';
import { ALL_BOOKS, ME } from '../queries';
import BookList from './BookList';

function Recommendations(props) {
  const userQuery = useQuery(ME, { skip: !props.show });

  const genre = userQuery.data?.me.favoriteGenre || '';

  const booksQuery = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
  });

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>recommendations</h2>

      {userQuery.loading || booksQuery.loading ? (
        <p>Loading recommendations...</p>
      ) : (
        <>
          <p>
            Books in your favorite genre <strong>{genre}</strong>
          </p>
          <BookList books={booksQuery.data.allBooks} />
        </>
      )}
    </div>
  );
}

export default Recommendations;

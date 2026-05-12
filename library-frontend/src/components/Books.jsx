import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { ALL_BOOKS } from '../queries';
import BookList from './BookList';

const memoizedData = {
  genres: [],
  // authors: [],
};

/**
 * NOTE: Author filtration commented to satisfy the chapter #5 e2e-tests
 */

const Books = (props) => {
  const [filters, setFilters] = useState({
    genre: '',
    // author: '',
  });
  const booksQuery = useQuery(ALL_BOOKS, { variables: filters });

  const booksQueryData = booksQuery.data || booksQuery.previousData;

  const books = booksQueryData?.allBooks || [];

  const booksFiltered = Object.values(filters).some((filter) => filter);

  const filtration = {
    genre: {
      choices: booksFiltered
        ? memoizedData.genres
        : Array.from(new Set(books.flatMap((b) => b.genres))),
    },
    // author: {
    //   choices: booksFiltered
    //     ? memoizedData.authors
    //     : Array.from(new Set(books.map((b) => b.author.name))),
    // },
  };

  useEffect(() => {
    if (!booksFiltered) {
      memoizedData.genres = filtration.genre.choices;
      // memoizedData.authors = filtration.author.choices;
    }
  }, [
    booksFiltered,
    filtration.genre.choices,
    // filtration.author.choices,
  ]);

  const filterOnChangeBy = (filter) => {
    return (e) =>
      setFilters((currentFilters) => ({
        ...currentFilters,
        [filter]: e.target.value,
      }));
  };

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>

      <p>
        in genre <strong>{filters.genre || 'all'}</strong>
      </p>

      <div style={{ margin: '1rem 0' }}>
        {Object.entries(filtration).map(([filter, data]) => {
          const id = `select-${filter}`;
          return (
            <div key={id}>
              {data.choices.map((c) => (
                <button
                  type='button'
                  key={c}
                  value={c}
                  onClick={filterOnChangeBy(filter)}
                >
                  {c}
                </button>
              ))}
              <button
                type='button'
                value=''
                onClick={filterOnChangeBy(filter)}
              >
                all {filter}s
              </button>
              {/* <label htmlFor={id}>Filter by {filter}: </label>
              <select
                id={id}
                value={filters[filter]}
                onChange={filterOnChangeBy(filter)}
              >
                <option value=''>All</option>
                {data.choices.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select> */}
            </div>
          );
        })}
      </div>

      <div style={{ minHeight: '1.2em' }}>
        {booksQuery.loading && 'Loading books...'}
      </div>

      {(booksFiltered || !booksQuery.loading) && <BookList books={books} />}
    </div>
  );
};

export default Books;

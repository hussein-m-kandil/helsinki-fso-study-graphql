import { useState } from 'react';
import Authors from './components/Authors';
import NewBook from './components/NewBook';
import Books from './components/Books';

const App = () => {
  const [page, setPage] = useState('authors');
  const [error, setError] = useState('');

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <p style={{ color: 'red', fontSize: 'small', minHeight: '1em' }}>
        {error}
      </p>

      <Authors show={page === 'authors'} onError={handleError} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} onError={handleError} />
    </div>
  );
};

export default App;

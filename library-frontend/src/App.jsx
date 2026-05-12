import { useState } from 'react';
import { TOKEN_STORAGE_KEY } from './main';
import { useApolloClient } from '@apollo/client/react';
import Recommendations from './components/Recommendations';
import Register from './components/Register';
import Authors from './components/Authors';
import NewBook from './components/NewBook';
import Books from './components/Books';
import Login from './components/Login';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [page, setPage] = useState('authors');
  const [error, setError] = useState('');

  const gqlClient = useApolloClient();

  const refreshPage = () => {
    setPage('authors');
    setError('');
  };

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const login = (token) => {
    setToken(token);
    refreshPage();
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  };

  const logout = () => {
    setToken(null);
    refreshPage();
    localStorage.clear();
    gqlClient.resetStore();
  };

  return (
    <div>
      <div>
        <button type='button' onClick={() => setPage('authors')}>
          authors
        </button>
        <button type='button' onClick={() => setPage('books')}>
          books
        </button>
        {token ? (
          <>
            <button type='button' onClick={() => setPage('recommendations')}>
              recommend
            </button>
            <button type='button' onClick={() => setPage('add')}>
              add book
            </button>
            <button type='button' onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <>
            <button type='button' onClick={() => setPage('login')}>
              login
            </button>
            <button type='button' onClick={() => setPage('register')}>
              register
            </button>
          </>
        )}
      </div>

      <p style={{ color: 'red', fontSize: 'small', minHeight: '1em' }}>
        {error}
      </p>

      <Authors
        show={page === 'authors'}
        authenticated={!!token}
        onError={handleError}
      />

      <Books show={page === 'books'} />

      <Recommendations show={page === 'recommendations'} />

      <NewBook show={page === 'add'} onError={handleError} />

      <Register
        show={page === 'register' && !token}
        onError={handleError}
        onSuccess={() => setPage('login')}
      />

      <Login
        show={page === 'login' && !token}
        onError={handleError}
        onSuccess={login}
      />
    </div>
  );
};

export default App;

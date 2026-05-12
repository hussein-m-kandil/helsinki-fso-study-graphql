import { useState } from 'react';
import { REGISTER } from '../queries';
import { useMutation } from '@apollo/client/react';

function Register(props) {
  const [username, setUsername] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');

  const [register] = useMutation(REGISTER, {
    onCompleted: (data) => props.onSuccess(data.createUser),
    onError: (error) => props.onError(error.message),
  });

  if (!props.show) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        register({
          variables: { username, favoriteGenre },
        });
      }}
      aria-labelledby='register-form-label'
    >
      <h2 id='register-form-label'>Register</h2>

      <div>
        <label htmlFor='username'>Username: </label>
        <input
          type='text'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor='genre'>Favorite Genre: </label>
        <input
          type='text'
          id='genre'
          value={favoriteGenre}
          onChange={(e) => setFavoriteGenre(e.target.value)}
        />
      </div>

      <button type='submit' disabled={!username || !favoriteGenre}>
        Submit
      </button>
    </form>
  );
}

export default Register;

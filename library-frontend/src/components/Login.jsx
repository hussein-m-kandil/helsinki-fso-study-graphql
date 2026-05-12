import { useState } from 'react';
import { LOGIN } from '../queries';
import { useMutation } from '@apollo/client/react';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => props.onSuccess(data.login.value),
    onError: (error) => props.onError(`Login failed: ${error.message}`),
  });

  if (!props.show) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login({ variables: { username, password } });
      }}
      aria-labelledby='login-form-label'
    >
      <h2 id='login-form-label'>Login</h2>

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
        <label htmlFor='password'>Password: </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type='submit' disabled={!username || !password}>
        Login
      </button>
    </form>
  );
}

export default Login;

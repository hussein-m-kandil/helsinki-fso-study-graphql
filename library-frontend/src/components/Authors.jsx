import { useMutation, useQuery } from '@apollo/client/react';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';
import { useState } from 'react';

const Authors = (props) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');

  const query = useQuery(ALL_AUTHORS);
  const [updateAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => props.onError(error.message),
    onCompleted: (data) => {
      if (!data.editAuthor) {
        props.onError('Author not found.');
      }
    },
  });

  if (!props.show) {
    return null;
  }

  if (query.loading) {
    return <div>Loading authors...</div>;
  }

  const authors = query.data.allAuthors;

  return (
    <div>
      <h2>authors</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set Birth Year</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateAuthor({ variables: { name, setBornTo: parseInt(year) } });
          setName('');
          setYear('');
        }}
      >
        <div>
          <label htmlFor='name'>Name: </label>
          <select
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          >
            <option value={''}>Select Name</option>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='year' style={{ color: name ? '' : 'gray' }}>
            Birth Year:{' '}
          </label>
          <input
            id='year'
            type='text'
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={!name}
          />
        </div>
        <button type='submit' disabled={!name || !year}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Authors;

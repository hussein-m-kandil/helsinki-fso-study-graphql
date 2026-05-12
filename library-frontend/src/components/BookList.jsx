function BookList({ books }) {
  if (!books) {
    return null;
  }

  if (!books.length) {
    return (
      <div>
        <em>Could not find any books!</em>
      </div>
    );
  }

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {books.map((a) => (
          <tr key={a.id}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BookList;

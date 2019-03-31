'use strict';

class SQLModel {
  constructor(client) {
    this.client = client;
  }

  get(id) {
    if (id) {
      return getBook(this.client, id);
    } else {
      return getBooks(this.client);
    }
  }

  post(body) {
    return createShelf(body.bookshelf, this.client).then(id => {
      const { title, author, isbn, image_url, description } = body;
      const SQL =
        'INSERT INTO books(title, author, isbn, image_url, description, bookshelf_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;';
      const values = [title, author, isbn, image_url, description, id];
      return this.client.query(SQL, values);
    });
  }

  put(body, id) {
    const { title, author, isbn, image_url, description, bookshelf_id } = body;
    // let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7;`;
    let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf_id=$6 WHERE id=$7;`;
    let values = [title, author, isbn, image_url, description, bookshelf_id, id];

    return this.client.query(SQL, values);
  }

  delete(id) {
    const SQL = 'DELETE FROM books WHERE id=$1;';
    const values = [id];
    return this.client.query(SQL, values);
  }
}

// createShelf is called as a helper function of createBook
const createShelf = (shelf, client) => {
  const normalizedShelf = shelf.toLowerCase();
  const SQL1 = `SELECT id from bookshelves where name=$1;`;
  const values1 = [normalizedShelf];

  return client.query(SQL1, values1).then(results => {
    if (results.rowCount) {
      return results.rows[0].id;
    } else {
      const INSERT = `INSERT INTO bookshelves(name) VALUES($1) RETURNING id;`;
      const insertValues = [shelf];

      return client.query(INSERT, insertValues).then(results => {
        return results.rows[0].id;
      });
    }
  });
};

// GET helper functions
/// GET BOOKSHELVES
const getBookshelves = client => {
  // let SQL = 'SELECT DISTINCT bookshelf FROM books ORDER BY bookshelf;';
  let SQL = 'SELECT DISTINCT id, name FROM bookshelves ORDER BY name;';

  return client.query(SQL);
};

/// GET BOOK
const getBook = (client, id) => {
  return getBookshelves(client).then(shelves => {
    let SQL =
      'SELECT books.*, bookshelves.name FROM books INNER JOIN bookshelves on books.bookshelf_id=bookshelves.id WHERE books.id=$1;';
    let values = [id];
    return client.query(SQL, values);
  });
};

/// GET BOOKS
const getBooks = client => {
  let SQL = 'SELECT * FROM books;';

  return client.query(SQL);
};

module.exports = SQLModel;

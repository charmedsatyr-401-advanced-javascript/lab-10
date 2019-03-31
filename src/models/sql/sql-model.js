'use strict';

/*
router.get('/', getBooks);
router.post('/searches', createSearch);
router.get('/searches/new', newSearch);
router.get('/books/:id', getBook);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);
*/

class SQLModel {
  constructor(client) {
    this.client = client;
  }

  get(id) {
    // GET for a single book
    if (id) {
      // Query the SQL db for all the bookshelves
      let SQL = 'SELECT DISTINCT id, name FROM bookshelves ORDER BY name;';
      return this.client.query(SQL).then(shelves => {
        // Print out all the shelves (id's, names)
        console.log(shelves.rows);
        // Attach them to the request object (req.model.shelves)
        this.shelves = shelves;

        // Query the SQL db for the specific book
        let SQL =
          'SELECT books.*, bookshelves.name FROM books INNER JOIN bookshelves on books.bookshelf_id=bookshelves.id WHERE books.id=$1;';
        let values = [parseInt(id)];
        return this.client.query(SQL, values);
      });
    }
    // GET for all books (home page)
    else {
      let SQL = 'SELECT * FROM books;';
      return this.client.query(SQL);
    }
  }

  post(body) {
    // createShelf is called as a helper function of createBook
    // createBook is called on a POST to '/books'
    const createShelf = shelf => {
      const normalizedShelf = shelf.toLowerCase();
      const SQL1 = `SELECT id from bookshelves where name=$1;`;
      const values1 = [normalizedShelf];

      return this.client.query(SQL1, values1).then(results => {
        if (results.rowCount) {
          return results.rows[0].id;
        } else {
          const INSERT = `INSERT INTO bookshelves(name) VALUES($1) RETURNING id;`;
          const insertValues = [shelf];

          return this.client.query(INSERT, insertValues).then(results => {
            return results.rows[0].id;
          });
        }
      });
    };

    return createShelf(body.bookshelf).then(id => {
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
    console.log('Accepting the ID:', id);
    let SQL = 'DELETE FROM books WHERE id=$1;';
    return this.client.query(SQL, id);
  }
}

function getBookshelves() {
  // let SQL = 'SELECT DISTINCT bookshelf FROM books ORDER BY bookshelf;';
  let SQL = 'SELECT DISTINCT id, name FROM bookshelves ORDER BY name;';
  return this.client.query(SQL);
}

module.exports = SQLModel;

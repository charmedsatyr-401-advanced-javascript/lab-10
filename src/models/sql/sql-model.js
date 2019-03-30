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

  test() {
    console.log('OMG OMG OMG OMG ');
  }
  get(_id) {
    let SQL = 'SELECT * FROM books;';
    return this.client.query(SQL);
  }

  post(record) {
    //
  }

  put(_id, record) {
    //
  }

  delete(_id) {
    //
  }
}

module.exports = SQLModel;

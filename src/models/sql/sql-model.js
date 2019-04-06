'use strict';
/**
 * @param  {} client
 * @param  {} {this.client=client;}get(id
 * @param  {} {if(id
 * @param  {} {returngetBook(this.client
 * @param  {} id
 * @param  {} ;}else{returngetBooks(this.client
 * @param  {} ;}}post(body
 * @param  {} {returncreateShelf(body.bookshelf
 * @param  {} this.client
 * @param  {} .then(id=>{const{title
 * @param  {} author
 * @param  {} isbn
 * @param  {} image_url
 * @param  {} description}=body;constSQL='INSERTINTObooks(title
 * @param  {} author
 * @param  {} isbn
 * @param  {} image_url
 * @param  {} description
 * @param  {} bookshelf_id
 * @param  {} VALUES($1
 * @param  {} $2
 * @param  {} $3
 * @param  {} $4
 * @param  {} $5
 * @param  {} $6
 * @param  {} RETURNINGid;';constvalues=[title
 * @param  {} author
 * @param  {} isbn
 * @param  {} image_url
 * @param  {} description
 * @param  {} id];returnthis.client.query(SQL
 * @param  {} values
 * @param  {} ;}
 * @param  {} ;}put(body
 * @param  {} id
 * @param  {} {const{title
 * @param  {} author
 * @param  {} isbn
 * @param  {} image_url
 * @param  {} description
 * @param  {} bookshelf_id}=body;constSQL=`UPDATEbooksSETtitle=$1
 * @param  {} author=$2
 * @param  {} isbn=$3
 * @param  {} image_url=$4
 * @param  {} description=$5
 * @param  {} bookshelf_id=$6WHEREid=$7;`;constvalues=[title
 * @param  {} author
 * @param  {} isbn
 * @param  {} image_url
 * @param  {} description
 * @param  {} bookshelf_id
 * @param  {} id];returnthis.client.query(SQL
 * @param  {} values
 * @param  {} ;}delete(id
 * @param  {} {constSQL='DELETEFROMbooksWHEREid=$1;';constvalues=[id];returnthis.client.query(SQL
 * @param  {} values
 */
class SQLModel {
  constructor(client) {
    this.client = client;
  }

  get(id) {
    // Both return a Promise.all()
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
    const SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf_id=$6 WHERE id=$7;`;
    const values = [title, author, isbn, image_url, description, bookshelf_id, id];

    return this.client.query(SQL, values);
  }

  delete(id) {
    const SQL = 'DELETE FROM books WHERE id=$1;';
    const values = [id];
    return this.client.query(SQL, values);
  }
}

// createShelf is called as a helper function of createBook
/**
 * @param  {} shelf
 * @param  {} client
 * @param  {} =>{constnormalizedShelf=shelf.toLowerCase(
 * @param  {} ;constSQL1=`SELECTidfrombookshelveswherename=$1;`;constvalues1=[normalizedShelf];returnclient.query(SQL1
 * @param  {} values1
 * @param  {} .then(shelves=>{if(shelves.rowCount
 * @param  {} {returnshelves.rows[0].id;}else{constINSERT=`INSERTINTObookshelves(name
 * @param  {} VALUES($1
 * @param  {} RETURNINGid;`;constinsertValues=[shelf];returnclient.query(INSERT
 * @param  {} insertValues
 * @param  {} .then(shelves=>{returnshelves.rows[0].id;}
 * @param  {} ;}}
 */
const createShelf = (shelf, client) => {
  const normalizedShelf = shelf.toLowerCase();
  const SQL1 = `SELECT id from bookshelves where name=$1;`;
  const values1 = [normalizedShelf];

  return client.query(SQL1, values1).then(shelves => {
    if (shelves.rowCount) {
      return shelves.rows[0].id;
    } else {
      const INSERT = `INSERT INTO bookshelves(name) VALUES($1) RETURNING id;`;
      const insertValues = [shelf];

      return client.query(INSERT, insertValues).then(shelves => {
        return shelves.rows[0].id;
      });
    }
  });
};

// GET helper functions
/// GET BOOKSHELVES
/**
 * @param  {} SQL
 */
const getBookshelves = client => {
  // let SQL = 'SELECT DISTINCT bookshelf FROM books ORDER BY bookshelf;';
  const SQL = 'SELECT DISTINCT id, name FROM bookshelves ORDER BY name;';

  return client.query(SQL);
};

/// GET BOOK
/**
 * @param  {} client
 * @param  {} id
 * @param  {} =>{constshelves=getBookshelves(client
 * @param  {} ;constSQL='SELECTbooks.*
 * @param  {} bookshelves.nameFROMbooksINNERJOINbookshelvesonbooks.bookshelf_id=bookshelves.idWHEREbooks.id=$1;';constvalues=[id];constbookResults=client.query(SQL
 * @param  {} values
 * @param  {} ;returnPromise.all([bookResults
 * @param  {} shelves]
 */
const getBook = (client, id) => {
  const shelves = getBookshelves(client);
  const SQL =
    'SELECT books.*, bookshelves.name FROM books INNER JOIN bookshelves on books.bookshelf_id=bookshelves.id WHERE books.id=$1;';
  const values = [id];
  const bookResults = client.query(SQL, values);

  return Promise.all([bookResults, shelves]);
};

/// GET BOOKS
/**
 * @param  {} [client.query(SQL
 * @param  {} ]
 */
const getBooks = client => {
  const SQL = 'SELECT * FROM books;';

  return Promise.all([client.query(SQL)]);
};

module.exports = SQLModel;

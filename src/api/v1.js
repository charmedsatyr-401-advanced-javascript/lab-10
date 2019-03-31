'use strict';

// Application dependencies
const express = require('express');
const superagent = require('superagent');
const methodOverride = require('method-override');

const router = express.Router();

const cwd = process.cwd();
const modelFinder = require('../middleware/model-finder.js');

const handleMissing = require('../middleware/404.js');
const handleError = require('../middleware/500.js');

// Application middleware
router.use(express.urlencoded({ extended: true }));
router.use(express.static('public'));

// Evaluate the model, dynamically
router.use(modelFinder);

router.use(
  methodOverride((request, response) => {
    if (request.body && typeof request.body === 'object' && '_method' in request.body) {
      // look in urlencoded POST bodies and delete it
      let method = request.body._method;
      delete request.body._method;
      return method;
    }
  })
);

// API Routes
router.get('/', getBooks);
router.get('/books/:id', getBooks);
router.post('/books', createBook);

router.post('/searches', createSearch);
router.get('/searches/new', newSearch);

/*
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);
*/

router.get('*', handleMissing);
router.use(handleError);

// HELPER FUNCTIONS
function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';

  this.title = info.title ? info.title : 'No title available';
  this.author = info.authors ? info.authors[0] : 'No author available';
  this.isbn = info.industryIdentifiers
    ? `ISBN_13 ${info.industryIdentifiers[0].identifier}`
    : 'No ISBN available';
  this.image_url = info.imageLinks ? info.imageLinks.smallThumbnail : placeholderImage;
  this.description = info.description ? info.description : 'No description available';
  this.id = info.industryIdentifiers ? `${info.industryIdentifiers[0].identifier}` : '';
}

function getBooks(request, response) {
  const { id } = request.params;
  request.model
    .get(id)
    .then(results => {
      if (results.rows.rowCount === 0) {
        response.render('pages/searches/new');
      } else {
        response.render('pages/index', { books: results.rows });
      }
    })
    .catch(err => handleError(err, response));
}

function createBook(request, response) {
  const { body } = request;
  request.model
    .post(body)
    .then(result => response.redirect(`/books/${result.rows[0].id}`))
    .catch(err => handleError(err, response));
}

function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (request.body.search[1] === 'title') {
    url += `+intitle:${request.body.search[0]}`;
  }
  if (request.body.search[1] === 'author') {
    url += `+inauthor:${request.body.search[0]}`;
  }

  superagent
    .get(url)
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/searches/show', { results: results }))
    .catch(err => handleError(err, response));
}

function newSearch(request, response) {
  response.render('pages/searches/new');
}

/*
function updateBook(request, response) {
  let { title, author, isbn, image_url, description, bookshelf_id } = request.body;
  // let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7;`;
  let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf_id=$6 WHERE id=$7;`;
  let values = [title, author, isbn, image_url, description, bookshelf_id, request.params.id];

  client
    .query(SQL, values)
    .then(response.redirect(`/books/${request.params.id}`))
    .catch(err => handleError(err, response));
}

function deleteBook(request, response) {
  let SQL = 'DELETE FROM books WHERE id=$1;';
  let values = [request.params.id];

  return client
    .query(SQL, values)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}
*/

module.exports = router;

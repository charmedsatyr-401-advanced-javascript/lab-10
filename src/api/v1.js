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

router.put('/books/:id', updateBook);

router.delete('/books/:id', deleteBook);

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

// GET
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

// POST
function createBook(request, response) {
  const { body } = request;
  request.model
    .post(body)
    .then(result => response.redirect(`/books/${result.rows[0].id}`))
    .catch(err => handleError(err, response));
}

// PUT
function updateBook(request, response) {
  console.log('PUT, updateBook', request);
  const { body } = request;
  const { id } = request.params;

  request.model
    .put(body, id)
    .then(response.redirect(`/books/${id}`))
    .catch(err => handleError(err, response));
}

// DELETE
function deleteBook(request, response) {
  console.log('Request body for DELETE:', request.body);
  const { id } = request.params;
  console.log('THIS IS THE ID:', id);
  request.model
    .delete(id)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}

// NON-DATABASE FUNCTIONS
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

module.exports = router;

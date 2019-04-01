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

// Documentation
router.use('/docs', express.static(`${cwd}/docs`));
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require(`${cwd}/docs/config/swagger.json`);
router.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// API Routes
// GET
router.get('/', getBooks);
router.get('/books/:id', getBooks);
router.get('/searches/new', newSearch);

// POST
router.post('/books', createBook);
router.post('/searches', createSearch);

// PUT
router.put('/books/:id', updateBook);

// DELETE
router.delete('/books/:id', deleteBook);

// ERROR
router.get('*', handleMissing);
router.use(handleError);

// HELPER FUNCTIONS
/**
 * @param  {object} info
 **/
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
/**
 * @param  {object} request
 * @param  {object} response
 */
function getBooks(request, response) {
  const { id } = request.params;
  request.model
    .get(id)
    .then(results => {
      const bookResults = results[0];
      const shelves = results[1];
      // getBook
      if (id) {
        response.render('pages/books/show', {
          book: bookResults.rows[0],
          bookshelves: shelves.rows,
        });
        // getBooks
      } else if (bookResults.rows.rowCount === 0) {
        response.render('pages/searches/new');
      } else {
        response.render('pages/index', { books: bookResults.rows });
      }
    })
    .catch(err => handleError(err, response));
}

// POST
/**
 * @param  {object} request
 * @param  {object} response
 */
function createBook(request, response) {
  const { body } = request;
  request.model
    .post(body)
    .then(result => response.redirect(`/books/${result.rows[0].id}`))
    .catch(err => handleError(err, response));
}

// PUT
/**
 * @param  {object} request
 * @param  {object} response
 */
function updateBook(request, response) {
  const { body } = request;
  const { id } = request.params;

  request.model
    .put(body, id)
    .then(response.redirect(`/books/${id}`))
    .catch(err => handleError(err, response));
}

// DELETE
/**
 * @param  {object} request
 * @param  {object} response
 */
function deleteBook(request, response) {
  const { id } = request.params;
  request.model
    .delete(id)
    .then(response.redirect('/'))
    .catch(err => handleError(err, response));
}

// NON-DATABASE FUNCTIONS
/**
 * @param  {object} request
 * @param  {object} response
 */
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
/**
 * @param  {object} request
 * @param  {object} response
 */
function newSearch(request, response) {
  response.render('pages/searches/new');
}

module.exports = router;

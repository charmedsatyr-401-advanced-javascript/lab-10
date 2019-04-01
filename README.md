![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

## Lab 10: Book App

### Author: Joseph Wolfe

### Links and Resources
* [PR](https://github.com/charmedsatyr-401-advanced-javascript/lab-09/pull/1)
* [![Build Status](https://travis-ci.org/charmedsatyr-401-advanced-javascript/lab-10.svg?branch=submission)](https://travis-ci.org/charmedsatyr-401-advanced-javascript/lab-10)
* [front end](https://shielded-crag-86438.herokuapp.com/)

#### Documentation
* [jsdoc] *Coming soon!*
* [swagger] *Coming soon!*

### Modules
`./index.js`

`./src/server.js`

`./src/api/v1.js`

`./src/middleware/404.js`

`./src/middleware/500.js`

`./src/middleware/model-finder.js`

`./src/models/mongo/mongo-model.js`

`./src/models/mongo/books/books-model.js`

`./src/models/mongo/books/books-schema.js`

`./src/models/mongo/bookshelf/bookshelf-schema.js`

`./src/models/sql/sql-model.js`

`./src/models/sql/books/books-model.js`

-----


#### `./index.js`
##### Exported Values and Methods from `./index.js`
This is the entry point of the application. When the app starts, the database connections are initiated.

If `DB=SQL` is set in the environment configuration, an instance of the PostgreSQL `client` will be exported to `./src/models/sql/books/books-model.js` to instantiate an instance of the `Books` class.

-----

#### `.src/server.js`
##### Exported Values and Methods from `./src/app.js`
This module sets the view engine and routes and exports a `start` method for the Express server.

-----


#### `.src/api/v1.js`
##### Exported Values and Methods from `v1.js`
This module exports an Express `router` that supports the following endpoints and associated content regardless of whether a PostgreSQL or MongoDB database is used:

###### `GET`

* `/` → home page

* `/searches/new` → interface for searching the Google Books API

* `/books/:id` → view a specific book in the collection

* `/api/v1/doc`, Swagger live API documentation (coming soon!)

* `/docs`, JSDocs documentation (coming soon!)

###### `POST`

* `/books` → post book details to be stored in the database collection

* `/searches` → post a search request to the Google Books API

###### `PUT`

* `/:id` → modify a book with the given `id`

###### `DELETE`

* `/books/:id` → delete a book with the given `id`

---
#### `.src/middleware/404.js`
##### Exported Values and Methods from `404.js`
Unknown path fallback middleware.

-----

#### `./src/middleware/500.js`
##### Exported Values and Methods from `500.js`
Server error handling middleware.

-----

#### `./src/middleware/model-finder.js`
##### Exported Values and Methods from `model-finder.js`
Middleware to set the correct path for the database models and request handlers based on the `DB` environmental variable.

If `DB=MONGO`, the models in `./src/models/mongo/` will be used.

If `DB=SQL`, the models in `./src/models/sql/` will be used.

The operation of the application is identical regardless of which type of database is used.

-----
#### `./src/models/mongo/mongo-model.js` and `./src/models/sql/sql-model.js`
##### Exported Values and Methods from `mongo-model.js` and `sql-model.js`
`get()` → `Promise.all array` → Array containing a single object that itself contains an array of objects `rows` with details of books from database and a count `rowCount` of the number of books. This structure is expected by the view engine.

`get(id)` → `Promise.all array` → Array containing two objects. Index `0` is an object that contains book data as described above. Index `1` also has the `rows` and `rowCount` keys but contains data about the bookshelf on which the book is stored.

`post(request.body)` → `Promise` → new record in database, formatted as an object with `rows` and `rowCount` keys as above.

`put(request.body id)` → `Promise` → modified `record` from database

`delete(id)` → `Promise` → deleted `record` from database

-----

#### `./src/models/mongo/books/books-model.js`
##### Exported Values and Methods from `books-model.js`
Exports an instance of a `Books` model that extends the class `MongoModel` from `.src/models/mongo/mongo-model.js` instantiated with a `books` schema from `./src/models/mongo/books/books-schema.js`.

-----

#### `./src/models/mongo/books/books-schema.js`
##### Exported Values and Methods from `books-schema.js`
Exports the Mongoose schema `books`, which has the following keys and configuration:
```
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  image_url: { type: String, required: true },
  description: { type: String, required: true },
  bookshelf_id: { type: String, required: true },
```
-----

#### `./src/models/mongo/bookshelf/bookshelf-schema.js`
##### Exported Values and Methods from `bookshelf-schema.js`
Exports the Mongoose schema `bookshelf`, which has the following keys and configuration:
```
  name: { type: String, required: true, lowercase: true },
```
-----

#### `./src/models/sql/books/books-model.js`
##### Exported Values and Methods from `books-model.js`
Exports an instance of a `Books` model that extends the class `SQLModel` from `.src/models/sql/sql-model.js` instantiated with an instance of the running SQL `client` from `./index.js`.

-----

#### Running the app
* On a local machine, make sure to configure your `.env` file with `SQL_DATABASE_URL`, `MONGO_URI`, `PORT`, and `DB` values.

* If you are running the application with a PostgreSQL database, make sure the environmental variable `DB=SQL` and that your local installation of PostgreSQL is properly configured.

* If you are running the application with a MongoDB database, make sure the environmental variable `DB=MONGO` and that your local installation of MongoDB is properly configured and running.

* Start the server on your local machine with `npm run start` or `npm run watch`.

* You can use the client UI to interact with the routes as indicated above. The client looks best if viewed as a mobile app.

#### Tests
* How do you run tests?
  * `npm run test`
  * `npm run test-watch`
  * `npm run lint`

* What assertions were made?
None!

* What assertions need to be / should be made?
  * All REST methods for the models `SQLModel` and `MongoModel` classes should be tested.

  * End-to-end testing should be performed on the server and routes.


#### UML
![UML Diagram](./docs/assets/uml.jpg)
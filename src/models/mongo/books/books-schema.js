'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const books = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  image_url: { type: String, required: true },
  description: { type: String, required: true },
  bookshelf_id: { type: String, required: true },
});

module.exports = mongoose.model('books', books);

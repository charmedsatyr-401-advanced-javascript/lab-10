'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const bookshelf = mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
});

module.exports = mongoose.model('bookshelf', bookshelf);

'use strict';

const MongoModel = require('../mongo-model.js');
const schema = require('./books-schema.js');

class Books extends MongoModel {}

module.exports = new Books(schema);

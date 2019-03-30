'use strict';

const { client } = require('../../../server.js');
const SQLModel = require('../sql-model.js');

class Books extends SQLModel {}

const books = new Books(client);

module.exports = books;

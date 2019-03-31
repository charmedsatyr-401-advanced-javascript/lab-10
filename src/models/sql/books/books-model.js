'use strict';

const { client } = require('../../../server.js');
const SQLModel = require('../sql-model.js');

class Books extends SQLModel {}

module.exports = new Books(client);

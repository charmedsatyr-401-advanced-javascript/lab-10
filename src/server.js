'use strict';

const router = require('./api/v1.js');

// Application Dependencies
const express = require('express');

// Application Setup
const app = express();

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

app.use(router);

module.exports = {
  start: port => app.listen(port, () => console.log(`Listening on port: ${port}`)),
};

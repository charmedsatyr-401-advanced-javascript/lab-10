'use strict';

const router = require('./api/v1.js');

// Application Dependencies
const express = require('express');

// Application Setup
const app = express();

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

app.use(router);

// Database Setup
const pg = require('pg');
const client = new pg.Client(process.env.SQL_DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

const start = port => app.listen(port, () => console.log(`Listening on port: ${port}`));

module.exports = { client, start };

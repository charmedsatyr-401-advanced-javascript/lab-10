'use strict';

require('dotenv').config();
const router = require('./api/v1.js');

// Application Dependencies
const express = require('express');
const pg = require('pg');

// Application Setup
const app = express();
const PORT = process.env.PORT;

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

app.use(router);

// Database Setup
const client = new pg.Client(process.env.SQL_DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

const start = port => app.listen(port, () => console.log(`Listening on port: ${port}`));

module.exports = { client, start };

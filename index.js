'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const pg = require('pg');
const { start } = require('./src/server.js');

// Database Setup
let client;
if (process.env.DB === 'SQL') {
  console.log();
  client = new pg.Client(process.env.SQL_DATABASE_URL);
  client.connect(err =>
    err
      ? console.log(`Connection error: ${err.stack}`)
      : console.log(`Connected to PostgresSQL database.`)
  );
  client.on('error', err => console.error(err));
} else if (process.env.DB === 'MONGO') {
  const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };
  mongoose.connect(process.env.MONGO_URI, mongooseOptions, err =>
    err ? console.log(`Connection error: ${err}`) : console.log(`Connected to MongoDB.`)
  );
}

const PORT = process.env.PORT || 3000;

start(PORT);

// This is required by the SQL book model
module.exports = client;

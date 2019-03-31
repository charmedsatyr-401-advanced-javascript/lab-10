'use strict';
/**
 * Model Finder Middleware
 * @module middleware/model-finder
 */

module.exports = (req, res, next) => {
  console.log('req.params', req.params);
  const db = process.env.DB === 'SQL' ? 'sql' : 'mongo';
  // const modelName = req.params.model.replace(/[^a-z0-9-_]/gi, '');
  req.model = require(`../models/${db}/books/books-model.js`);
  next();
};

'use strict';

const MongoModel = require('../mongo-model.js');

describe('`MongoModel` class', () => {
  it('should be alive', () => {
    MongoModel;
    expect(true).toBeTruthy();
  });
});

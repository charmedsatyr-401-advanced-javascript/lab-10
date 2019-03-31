'use strict';

const handleMissing = (request, response) => response.status(404).send('This route does not exist');

module.exports = handleMissing;

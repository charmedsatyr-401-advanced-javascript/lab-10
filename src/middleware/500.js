'use strict';
/**
 * @param  {} error
 * @param  {} response
 * @param  {} {response.render('pages/error'
 * @param  {error}} {error
 */
function handleError(error, response) {
  response.render('pages/error', { error: error });
}

module.exports = handleError;

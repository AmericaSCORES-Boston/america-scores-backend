'use strict';

const Promise = require('bluebird');

function createAccessDeniedError() {
  return Promise.reject({
    name: 'AccessDenied',
    status: 403,
    message: 'Access denied: this account does not have permission ' +
    'for this action'
  });
}

function createInvalidArgumentError(id, field, message) {
  var defaultIdError = 'Given ' + field + ' is of invalid format (e.g. not' +
  ' an integer or negative)';

  message = (typeof message === 'undefined') ? defaultIdError : message;

  return Promise.reject({
    name: 'InvalidArgumentError',
    status: 400,
    message: message,
    propertyName: field,
    propertyValue: id
  });
}

function createUnsupportedRequestError() {
  return Promise.reject({
    name: 'UnsupportedRequest',
    status: 501,
    message: 'The API does not support a request of this format. ' +
    ' See the documentation for a list of options.'
  });
}

function createArgumentNotFoundError(id, field) {
  return Promise.reject({
    name: 'ArgumentNotFoundError',
    status: 404,
    message: 'Invalid request: The given ' + field +
    ' does not exist in the database',
    propertyName: field,
    propertyValue: id
  });
}

function InvalidKeyError(key) {
  this.name = 'InvalidKeyError';
  this.message = 'Tried to access invalid key: ' + key;
}

module.exports = {
  createInvalidArgumentError, createArgumentNotFoundError,
  createUnsupportedRequestError, createAccessDeniedError,
  InvalidKeyError
};

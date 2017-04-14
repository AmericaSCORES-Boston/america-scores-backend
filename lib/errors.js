'use strict';

const Promise = require('bluebird');
// const Requirement = require('./utils').Requirement;

// TODO: pull constants into a constants file and use this to wrap them in rejections
// or throw regular errors

function createAccessDeniedError(acct_type) {
  return Promise.reject({
    name: 'AccessDenied',
    status: 403,
    message: 'Access denied: this account type (' + acct_type + ') does not have permission ' +
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

function createFieldError(name, pre_message, fields) {
  var message = pre_message;
  var field;
  for (var i = 0; i < fields.length; i++) {
    field = fields[i];
    message += (field.name == null ? field.type : (field.name + ' (' + field.type + ')')) + ', ';
  }

  return Promise.reject({
    name: name,
    status: 400,
    message: message.substring(0, message.length - 2)
  });
}

function createMissingFieldError(missingFields) {
  return createFieldError('Missing Field',
    'Request must have the following component(s): ',
    missingFields);
}

function createEmptyFieldError(emptyFields) {
  return createFieldError('Empty Field',
    'Request must have the following non-empty component(s): ',
    emptyFields);
}

function createError(name, status, message, fields) {
  var error = {
    name: name,
    status: status,
    message: message
  };

  if (typeof fields == 'object') {
    error = Object.assign(error, fields);
  }

  return Promise.reject(error);
}

function create500(fields) {
  return createError('Internal Server Error', 500,
    'The server encountered an unexpected condition which prevented it from fulfilling the request',
    fields);
}

function create404(fields) {
  return createError('Not Found', 404, 'The requested resource could not be found', fields);
}

function create400(fields) {
  return createError('Bad Request', 400, 'The request cannot be fulfilled due to bad syntax', fields);
}

// const AUTH_REQUIREMENT = new Requirement('auth', 'auth0_id');
function createMissingAuthError() {
  return createMissingFieldError([{type: 'auth', name: 'auth0_id'}]);
}

function InvalidKeyError(key) {
  this.name = 'InvalidKeyError';
  this.message = 'Tried to access invalid key: ' + key;
}

function AuthError() {
  this.name = 'AuthError';
  this.message = 'This endpoint requires an auth0_id in the auth portion of the request';
}

// TODO: improve these with abstraction (these come from creating events)
function createMalformedDateError() {
  return Promise.reject({
    name: 'Malformed Date Error',
    status: 400,
    message: 'Malformed date YYYY-MM-DD',
  });
}

module.exports = {
  createInvalidArgumentError, createArgumentNotFoundError,
  createUnsupportedRequestError, createAccessDeniedError,
  createMissingFieldError, createEmptyFieldError, createMissingAuthError,
  create500, create404, create400,
  InvalidKeyError, AuthError, createMalformedDateError
};

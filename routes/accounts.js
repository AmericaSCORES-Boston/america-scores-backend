'use strict';

const Promise = require('bluebird');
const utils = require('../lib/utils');
const query = utils.query;
const defined = utils.defined;

/*
 * User must have admin authorization
 *
 * Supports:
 * /accounts
 * /accounts?auth0_id=X
 * /accounts?acct_type=X
 * /accounts?account_id=X
 * /accounts?first_name=X&last_name=Y&email=Z
 */
function getAccounts(req) {
  /*
  if (req.user.authorization !== 'Admin') {
    return createAccessDeniedError();
  }
  */
  if (Object.keys(req.query).length == 0) {
    return query('SELECT acct_id, first_name, last_name, email, acct_type ' +
        'FROM Acct');
  }

  if (defined(req.query.auth0_id)) {
    return query('SELECT acct_id, first_name, last_name, email, acct_type ' +
        'FROM Acct ' +
        'WHERE auth0_id = ?',
    [req.query.auth0_id]);
  }

  if (defined(req.query.acct_type)) {
    return query('SELECT acct_id, first_name, last_name, email, acct_type ' +
        'FROM Acct ' +
        'WHERE acct_type = ?',
    [req.query.acct_type]);
  }

  if (defined(req.query.account_id)) {
      return query('SELECT acct_id, first_name, last_name, email, acct_type ' +
          'FROM Acct ' +
          'WHERE acct_id = ?',
          [req.query.account_id]);
  }

  if (defined(req.query.first_name) && defined(req.query.last_name) && defined(req.query.email)) {
      return query('SELECT acct_id, first_name, last_name, email, acct_type ' +
          'FROM Acct ' +
          'WHERE first_name = ? AND last_name = ? AND email = ?',
          [req.query.first_name, req.query.last_name, req.query.email]);
  }

  return createUnsupportedRequestError();
}

function getAccountsBySite(req) {
  return [];
}

function getAccountsByProgram(req) {
  return [];
}

function createAccount(req) {
  return [];
}

function updateAccount(req) {
  return [];
}

function deleteAccount(req) {
  return [];
}

/*
function createAccessDeniedError() {
  return Promise.reject({
    name: 'AccessDenied',
    status: 403,
    message: 'Access denied: this account does not have permission ' +
    'for this action'
  });
}
*/

function createUnsupportedRequestError() {
  return Promise.reject({
    name: 'UnsupportedRequest',
    status: 501,
    message: 'The API does not support a request of this format. ' +
    ' See the documentation for a list of options.'
  });
}

module.exports = {
  getAccounts, getAccountsByProgram, getAccountsBySite,
  getAccountsByProgram, createAccount, updateAccount, deleteAccount
};

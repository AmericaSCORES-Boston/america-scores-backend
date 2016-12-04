'use strict';

const Promise = require('bluebird');
const utils = require('../lib/utils');
const query = utils.query;
const defined = utils.defined;

function getAccounts(req) {
  if (req.user.authorization == 'Admin') {
    if (defined(req.query.first_name) && defined(req.query.last_name)
     && defined(req.query.email)) {
      return query('SELECT * FROM Acct WHERE first_name = ? AND last_name = ? ' +
       'AND email = ?', [req.query.first_name, req.query.last_name, req.query.email]);
    }

    return query('SELECT * FROM Acct');
  } else {
    return createAccessDeniedError();
  }
}

function getAccount(req) {
}

function getAccountsBySite(req) {
}

function getAccountsByProgram(req) {
}

function createAccount(req) {
}

function updateAccount(req) {
}

function deleteAccount(req) {
}

function createAccessDeniedError() {
  return Promise.reject({
    name: 'AccessDenied',
    status: 403,
    message: 'Access denied: this account does not have permission ' +
    'for this action'
  });
}

module.exports = {
  getAccounts, getAccount, getAccountsByProgram, getAccountsBySite,
  getAccountsByProgram, createAccount, updateAccount, deleteAccount
};

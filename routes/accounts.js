'use strict';

const Promise = require('bluebird');
const utils = require('../lib/utils');
const query = utils.query;
const defined = utils.defined;

function getAccounts(req) {
  if (req.user.authorization !== 'Admin') {
    return createAccessDeniedError();
  }

  if (defined(req.query.auth0_id)) {
    return query('SELECT acct_id, first_name, last_name, email, acct_type FROM Acct WHERE auth0_id = ?',
    [req.query.auth0_id]);
  }

  if (defined(req.query.acct_type)) {
    return query('SELECT acct_id, first_name, last_name, email, acct_type FROM Acct WHERE acct_type = ?',
    [req.query.acct_type]);
  }

  return query('SELECT acct_id, first_name, last_name, email, acct_type FROM Acct');
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

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

function addProgramToAccount(req) {
  if (req.user.authorization !== 'Admin') {
    return createAccessDeniedError();
  }

  return query('SELECT * FROM AcctToProgram WHERE acct_id = ? AND program_id = ?',
  [req.params.acct_id, req.params.program_id])
  .then(function(data) {
    if (data.length !== 0) {
      return;
    }

    return query('INSERT INTO AcctToProgram (acct_id, program_id) VALUES (?, ?)',
     [req.params.acct_id, req.params.program_id])
    .catch(function(err) {
      return createInvalidArgumentError();
    });
  });
}

function removeProgramFromAccount(req) {

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

function createInvalidArgumentError() {
  return Promise.reject({
    name: 'InvalidArgument',
    status: 400,
    message: 'Invalid account_id or program_id'
  });
}

module.exports = {
  getAccounts, getAccount, getAccountsByProgram, getAccountsBySite,
  getAccountsByProgram, createAccount, addProgramToAccount,
  removeProgramFromAccount, updateAccount, deleteAccount
};

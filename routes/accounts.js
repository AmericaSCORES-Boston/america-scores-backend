'use strict';

const utils = require('../lib/utils');
const errors = require('../lib/errors');
const query = utils.query;
const reqHasRequirements = utils.reqHasRequirements;
const makeQueryArgs = utils.makeQueryArgs;
const Requirement = utils.Requirement;
const PotentialQuery = utils.PotentialQuery;

const SELECT_ACCT = 'SELECT a.acct_id, a.first_name, a.last_name, a.email, a.acct_type ';
const FROM_ACCT = 'FROM Acct a ';

const ALL_ACCOUNTS = SELECT_ACCT + FROM_ACCT;
const ACCOUNT_BY_AUTH = SELECT_ACCT + FROM_ACCT + 'WHERE auth0_id = ?';
const ACCOUNT_BY_TYPE = SELECT_ACCT + FROM_ACCT + 'WHERE acct_type = ?';
const ACCOUNT_BY_ID = SELECT_ACCT + FROM_ACCT + 'WHERE acct_id = ?';
const ACCOUNT_BY_USER_INFO = SELECT_ACCT + FROM_ACCT +
    'WHERE first_name = ? AND last_name = ? AND email = ?';
const ACCOUNT_BY_PROGRAM = SELECT_ACCT +
    'FROM Acct a, AcctToProgram ap ' +
    'WHERE a.acct_id = ap.acct_id AND ? = ap.program_id';
const ACCOUNT_BY_SITE = SELECT_ACCT +
    'FROM Acct a, Program p, AcctToProgram ap ' +
    'WHERE a.acct_id = ap.acct_id AND ? = p.site_id AND p.program_id = ap.program_id';

const ACCOUNTS_QUERIES = [
  new PotentialQuery([new Requirement('auth0_id')], ACCOUNT_BY_AUTH),
  new PotentialQuery([new Requirement('acct_type')], ACCOUNT_BY_TYPE),
  new PotentialQuery([new Requirement('account_id')], ACCOUNT_BY_ID),
  new PotentialQuery([new Requirement('first_name'),
      new Requirement('last_name'),
      new Requirement('email')],
      ACCOUNT_BY_USER_INFO),
  new PotentialQuery([new Requirement('program_id')], ACCOUNT_BY_PROGRAM),
  new PotentialQuery([new Requirement('site_id')], ACCOUNT_BY_SITE),
];

/*
 * User must have admin authorization
 *
 * Supports:
 * /accounts
 * /accounts?auth0_id=X
 * /accounts?acct_type=X
 * /accounts?account_id=X
 * /accounts?first_name=X&last_name=Y&email=Z
 * /accounts?program_id=X
 * /accounts?site_id=X
 */
function getAccounts(req) {
  /*
  if (req.user.authorization !== 'Admin') {
    return errors.createAccessDeniedError();
  }
  */
  if (Object.keys(req.query).length == 0) {
    return query(ALL_ACCOUNTS);
  }

  var accountQuery;
  for (var i = 0; i < ACCOUNTS_QUERIES.length; i++) {
    accountQuery = ACCOUNTS_QUERIES[i];
    if (reqHasRequirements(req, accountQuery.requirements)) {
        return query(accountQuery.queryString,
                     makeQueryArgs(req, accountQuery.requirements));
    }
  }

  return errors.createUnsupportedRequestError();
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

module.exports = {
  getAccounts, createAccount, updateAccount, deleteAccount
};

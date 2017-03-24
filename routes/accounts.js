'use strict';

const auth0 = require('../lib/auth0_utils');
const utils = require('../lib/utils');
const errors = require('../lib/errors');
const query = utils.query;
const isPositiveInteger = utils.isPositiveInteger;
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
  new PotentialQuery([new Requirement('query', 'auth0_id')], ACCOUNT_BY_AUTH),
  new PotentialQuery([new Requirement('query', 'acct_type')], ACCOUNT_BY_TYPE),
  new PotentialQuery([new Requirement('query', 'account_id')], ACCOUNT_BY_ID),
  new PotentialQuery([new Requirement('query', 'first_name'),
      new Requirement('query', 'last_name'),
      new Requirement('query', 'email')],
      ACCOUNT_BY_USER_INFO),
  new PotentialQuery([new Requirement('query', 'program_id')], ACCOUNT_BY_PROGRAM),
  new PotentialQuery([new Requirement('query', 'site_id')], ACCOUNT_BY_SITE),
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
  // With no params in the URL, give back all accounts
  if (Object.keys(req.query).length == 0) {
    return query(ALL_ACCOUNTS);
  }

  // Otherwise, select the accounts by the params given in the URL
  var accountQuery;
  for (var i = 0; i < ACCOUNTS_QUERIES.length; i++) {
    accountQuery = ACCOUNTS_QUERIES[i];
    if (reqHasRequirements(req, accountQuery.requirements)) {
        return query(accountQuery.queryString,
                     makeQueryArgs(req, accountQuery.requirements));
    }
  }

  // Otherwise, not a valid request; error out
  return errors.createUnsupportedRequestError();
}

const UPDATE_KEYS = ['first_name', 'last_name', 'email', 'acct_type'];
const UPDATE_ACCT = 'UPDATE Acct ';
const UPDATE_WHERE_ACCT = ' WHERE acct_id = ?';
const UPDATE_ACCT_ALL = UPDATE_ACCT + 'SET ' +
    'first_name=?, last_name=?, email=?, acct_type=?' +
    UPDATE_WHERE_ACCT;
const UPDATE_REQS = [new Requirement('params', 'acct_id'), new Requirement('body', null)];

function updateAccount(req) {
  // Check that request has all necessary fields
  if (!reqHasRequirements(req, UPDATE_REQS)) {
      return errors.createUnsupportedRequestError();
  }

  var body = req.body;
  var account_id = req.params.acct_id;

  // All required fields are present. Check that account_id is valid
  if (!isPositiveInteger(account_id)) {
    return errors.createInvalidArgumentError(account_id, 'acct_id');
  }

  // Check that an account with the given id exists
  var promise = query(ACCOUNT_BY_ID, [account_id]);

  return promise.then(function(data) {
    if (data.length > 0) {
      // Account exists, do update
      var rollbackData = [data.first_name, data.last_name, data.email, data.acct_type, data.acct_id];

      var setStatement = 'SET ';
      var bodyKeys = Object.keys(body);
      var bodyKey;
      var bodyValue;
      var hasValidKey = false;
      var updatedBody = {};

      for (var i = 0; i < bodyKeys.length; i++) {
        bodyKey = bodyKeys[i];
        if (UPDATE_KEYS.includes(bodyKey)) {
          bodyValue = body[bodyKey];
          // Add to the query statement for our database
          setStatement += bodyKey + '="' + bodyValue + '",';
          hasValidKey = true;
          updatedBody = auth0.addToAuth0Body(updatedBody, bodyKey, bodyValue);
        } else {
          // Trying to update an invalid field
          return errors.createUnsupportedRequestError();
        }
      }

      if (hasValidKey) {
        setStatement = setStatement.substring(0, setStatement.length - 1);
      } else {
        setStatement = '';
      }

      if (!setStatement) {
        // Has no valid update fields
        return errors.createUnsupportedRequestError();
      }

      return query(UPDATE_ACCT + setStatement + UPDATE_WHERE_ACCT, [account_id]).then(function() {
        return auth0.getAuth0Id(account_id).then(function(auth0Id) {
          return auth0.updateAuth0User(auth0Id, updatedBody).then(function() {
            return query(ACCOUNT_BY_ID, [account_id]);
          }).catch(function(err) {
            console.log('Encountered an error trying to update account ' + account_id + '. Rolling back.');
            console.log(err.toString());
            return query(UPDATE_ACCT_ALL, rollbackData).then(function() {
              return errors.create500();
            });
          });
        });
      });
    } else {
      // Account does not exist, error out
      return errors.createArgumentNotFoundError(account_id, 'acct_id');
    }
  });
}

const CREATE_REQS = [
  new Requirement('body', 'first_name'),
  new Requirement('body', 'last_name'),
  new Requirement('body', 'email'),
  new Requirement('body', 'acct_type'),
  new Requirement('body', 'password')
];

const CREATE_ACCT = 'INSERT INTO Acct ' +
  '(first_name, last_name, email, acct_type, auth0_id) ' +
  'VALUES ("?", "?", "?", ?, ?)';

function createAccount(req) {
  if (!reqHasRequirements(CREATE_REQS)) {
      return errors.createUnsupportedRequestError();
  }
}

const DELETE_ACCT = 'DELETE FROM Acct WHERE acct_id = ?';
function deleteAccount(req) {
  return [];
}

module.exports = {
  getAccounts, createAccount, updateAccount, deleteAccount,
  UPDATE_ACCT_ALL, DELETE_ACCT, CREATE_ACCT
};

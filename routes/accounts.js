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

const COACH = require('../lib/constants/utils').COACH;
const STAFF = require('../lib/constants/utils').STAFF;
const VOLUNTEER = require('../lib/constants/utils').VOLUNTEER;
const ADMIN = require('../lib/constants/utils').ADMIN;

// const getAccountType = utils.getAccountType;
// const getReqAuth0Id = utils.getReqAuth0Id;
const ACCOUNT_TYPES = [COACH, STAFF, VOLUNTEER, ADMIN];

const SELECT_ACCT = 'SELECT a.acct_id, a.first_name, a.last_name, a.email, a.acct_type, a.auth0_id ';
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
  return getAccountsHelper(req);
  /*
  try {
    var auth0_id = getReqAuth0Id(req);

    return getAccountType(auth0_id).then(function(acct_type) {
      if (acct_type !== ADMIN) {
        return errors.createAccessDeniedError(acct_type);
      } else {
        return getAccountsHelper(req);
      }
    });
  } catch (e) {
    return errors.createMissingAuthError();
  }
  */
}

function getAccountsHelper(req) {
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
        if (UPDATE_KEYS.indexOf(bodyKey) >= 0) {
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
            return utils.rollback(err,
              'Encountered an error trying to update account ' + account_id + '. Rolling back.',
              function() {
                return query(UPDATE_ACCT_ALL, rollbackData);
              });
            /*
            console.log('Encountered an error trying to update account ' + account_id + '. Rolling back.');
            console.log(err.toString());
            return query(UPDATE_ACCT_ALL, rollbackData).then(function() {
              return errors.create500();
            });
            */
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
  new Requirement('body', 'username'),
  new Requirement('body', 'email'),
  new Requirement('body', 'acct_type'),
  new Requirement('body', 'password')
];

const CREATE_ACCT = 'INSERT INTO Acct ' +
  '(first_name, last_name, email, acct_type, auth0_id) ' +
  'VALUES (?, ?, ?, ?, ?)';


function createAccount(req) {
  console.log('backend');
  console.log(req.body)
    var missingReqs = utils.findMissingRequirements(req, CREATE_REQS);
  if (missingReqs.length !== 0) {
    return errors.createMissingFieldError(missingReqs);
  }

  var emptyReqs = utils.findEmptyRequirements(req, CREATE_REQS);
  if (emptyReqs.length !== 0) {
    return errors.createEmptyFieldError(emptyReqs);
  }

  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var username = req.body.username;
  var email = req.body.email;
  var acct_type = req.body.acct_type;
  var password = req.body.password;
  console.log(acct_type)
  // if given an invalid account type, throw a 400
  if (ACCOUNT_TYPES.indexOf(acct_type) < 0) {
    return errors.create400({
      message: 'Account type must be one of: Admin, Coach, Staff, Volunteer'
    });
  }

  if (!auth0.verifyPasswordStrength(password)) {
    return errors.create400({
      message: 'Password is too weak'
    });
  }
    console.log('CALLINF createAuth0User-------------------------------------------');
  // first, create the auth0 user and get the id
  return auth0.createAuth0User(first_name, last_name, username, email, acct_type, password)
    .then(function(auth0_id) {
      console.log('authid-------------------------------------------');
      console.log(auth0_id);
    // then add the user to our database
    return query(CREATE_ACCT, [first_name, last_name, email, acct_type, auth0_id])
      .catch(function(err) {
      // if there's an error adding to our database, rollback by deleting the auth0 user
      return utils.rollback(err,
        'Encountered an error trying to create account. Rolling back.',
        function() {
          return auth0.deleteAuth0User(auth0_id);
        });
      /*
      console.log('Encountered an error trying to create account. Rolling back.');
      console.log(err.toString());
      return auth0.deleteAuth0User(auth0_id).finally(function() {
        return errors.create500();
      });
      */
    });
  });
}

const DELETE_REQS = [new Requirement('params', 'account_id')];
const DELETE_ACCT = 'DELETE FROM Acct WHERE acct_id = ?';

function deleteAccount(req) {
  var missingReqs = utils.findMissingRequirements(req, DELETE_REQS);
  if (missingReqs.length !== 0) {
    return errors.createMissingFieldError(missingReqs);
  }

  var acct_id = req.params.account_id;
  // first, get the user from our database
  return query('SELECT * FROM Acct WHERE acct_id = ?', [acct_id]).then(function(accts) {
    // if no user with the given id is found, throw a 404
    if (accts.length < 1) {
      return errors.create404({
        message: 'No account with id ' + acct_id + ' exists in the database.'
      });
    }
    var acct = accts[0];

    // delete from our database -- bhupendra
      //return query(DELETE_ACCT, [acct_id]);

      // open this code when you have auth id associated with account
    return query(DELETE_ACCT, [acct_id]).then(function() {
      // now, delete from auth0
      return auth0.deleteAuth0User(acct.auth0_id).catch(function(err) {
        // if there's an error deleting the auth0 user, rollback by adding back to our database
        return utils.rollback(err,
          'Encountered an error trying to delete account. Rolling back.',
          function() {
            return query(CREATE_ACCT, [acct.first_name, acct.last_name, acct.email, acct.acct_type, acct.auth0_id]);
          });
      });
    });
  });
}

module.exports = {
  getAccounts, createAccount, updateAccount, deleteAccount,
  UPDATE_ACCT_ALL, DELETE_ACCT, CREATE_ACCT, ACCOUNT_BY_AUTH
};

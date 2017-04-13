'use strict';

const query = require('./utils').query;
const errors = require('./errors');
const createArgumentNotFoundError = errors.createArgumentNotFoundError;
const createUnsupportedRequestError = errors.createUnsupportedRequestError;
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;

const dotenv = require('dotenv');
// Travis doesn't see the .env file; it has the token/domain as env variables already
const fs = require('fs');
if (fs.existsSync('./.env')) {
  dotenv.load();
}

const AUDIENCE = 'https://asbadmin.auth0.com/api/v2/';
const CONNECTION = 'Username-Password-Authentication';
const CLIENT_ID = process.env.AUTH0_CLIENT_ID;

const AUTH = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

var timeout = Date.now();
var accessToken;

function getAccessToken() {
  if (Date.now() > timeout) {
    return AUTH.clientCredentialsGrant({audience: AUDIENCE})
      .then(function(data) {
        accessToken = data.access_token;
        timeout += data.expires_in;
        return accessToken;
      });
  } else {
    return Promise.resolve(accessToken);
  }
}

function getManagementClient() {
  return getAccessToken().then(function(accessToken) {
    return new ManagementClient({
      token: accessToken,
      domain: process.env.AUTH0_DOMAIN
    });
  });
}

function getAuth0Id(accId) {
  // returns the auth0_id field associated with the acct_id found in the 'Acct' table
  return query('SELECT auth0_id FROM Acct WHERE acct_id = ?', [accId]).then(function(data) {
    if (data.length == 1 && Object.keys(data[0]).indexOf('auth0_id') >= 0) {
      return data[0].auth0_id;
    } else {
      return createArgumentNotFoundError(accId, 'acct_id');
    }
  });
}

function getAuth0User(auth0Id) {
  var promise = getManagementClient();

  return promise.then(function(mgmt) {
    return mgmt.users.get({id: auth0Id})
      .then(function(user) {
          return user;
      }).catch(function(err) {
        return createArgumentNotFoundError(auth0Id, 'auth0_id');
    });
  });
}

function getAuth0UserByEmail(email) {
  var promise = getManagementClient();

  return promise.then(function(mgmt) {
    var q = 'email: "^' + email + '"$';
    return mgmt.users.get({q: q})
      .then(function(users) {
        if (users.length < 1) {
          return errors.create404({
            message: 'There is no Auth0 account with an email matching the query: ' + q
          });
        };
        return users[0];
    });
  });
}


function verifyPasswordStrength(password) {
  return password.length >= 8 &&
    /\d/.test(password) &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password);
}

// returns auth0_id of created client
function createAuth0User(firstName, lastName, username, email, acctType, password) {
  var promise = getManagementClient();

  return promise.then(function(mgmt) {
    return mgmt.users.create({
      connection: CONNECTION,
      username: username,
      email: email,
      password: password,
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      },
      app_metadata: {
        acct_type: acctType
      }
    }).then(function(user) {
      return user.user_id;
    });
  });
}

// delete a user by auth0 id
function deleteAuth0User(auth0Id) {
  var promise = getManagementClient();

  return promise.then(function(mgmt) {
    return mgmt.users.delete({id: auth0Id});
  });
}

const VALID_UPDATE_KEYS = ['username', 'password', 'email'];
const VALID_USER_UPDATE_KEYS = ['first_name', 'last_name'];
const VALID_APP_UPDATE_KEYS = ['acct_type'];
const VALID_KEYS = VALID_UPDATE_KEYS.concat(VALID_USER_UPDATE_KEYS.concat(VALID_APP_UPDATE_KEYS));
const APP_METADATA_KEY = 'app_metadata';
const USER_METADATA_KEY = 'user_metadata';

// update a user by auth0_id
// supported fields are: username, password, email, acct_type, first_name, last_name
function updateAuth0UserFromParams(auth0Id, updateParams) {
  var updates = {connection: CONNECTION, client_id: CLIENT_ID};

  var updateKey;
  var updateValue;
  for (updateKey in updateParams) {
    if (VALID_KEYS.indexOf(updateKey) >= 0) {
      updateValue = updateParams[updateKey];
      try {
        updates = addToAuth0Body(updates, updateKey, updateValue);
        continue;
      } catch (e) {
        // any error caught here is actually handled below
      }
    }
    // TODO: consider returning a better error here
    return createUnsupportedRequestError();
  }
  return updateAuth0User(auth0Id, updates);
}

function updateAuth0User(auth0Id, updateBody) {
  var promise = getManagementClient();
  return promise.then(function(mgmt) {
    return mgmt.users.update({id: auth0Id}, updateBody)
      .then(function(data) {
        return data;
      });
  });
}

function addToAuth0Body(obj, key, value) {
  if (VALID_UPDATE_KEYS.indexOf(key) >= 0) {
    // update username, password, or email
    obj[key] = value;
  } else if (VALID_USER_UPDATE_KEYS.indexOf(key) >= 0) {
    // update first or last name
    obj = addToMetadata(obj, USER_METADATA_KEY, key, value);
  } else if (VALID_APP_UPDATE_KEYS.indexOf(key) >= 0) {
    // update acct_type
    obj = addToMetadata(obj, APP_METADATA_KEY, key, value);
  } else {
    throw new errors.InvalidKeyError(key);
  }
  return obj;
}

function addToMetadata(obj, metadataType, key, value) {
  if (Object.keys(obj).indexOf(metadataType) < 0) {
    obj[metadataType] = {};
  }
  obj[metadataType][key] = value;
  return obj;
};

module.exports = {
  getManagementClient, getAuth0Id, getAuth0User,
  createAuth0User, deleteAuth0User, updateAuth0User,
  addToAuth0Body, updateAuth0UserFromParams,
  getAuth0UserByEmail, verifyPasswordStrength
};

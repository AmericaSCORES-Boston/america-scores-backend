'use strict';

const query = require('./utils').query;
const createArgumentNotFoundError = require('./errors').createArgumentNotFoundError;
const createUnsupportedRequestError = require('./errors').createUnsupportedRequestError;
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

// SEE AS-273; there's got to be a better way to do this than grabbing a new access token each time
function getAccessToken() {
  return AUTH.clientCredentialsGrant({audience: AUDIENCE})
    .then(function(data) {
      return data;
    });
}

function getManagementClient() {
  return getAccessToken().then(function(data) {
    return new ManagementClient({
      token: data.access_token,
      domain: process.env.AUTH0_DOMAIN
    });
  });
}

function getAuth0ID(accId) {
  // returns the auth0_id field associated with the acct_id found in the 'Acct' table
  return query('SELECT auth0_id FROM Acct WHERE acct_id = ?', [accId]).then(function(data) {
    if (data.length == 1 && Object.keys(data[0]).includes('auth0_id')) {
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
        type: acctType
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
const VALID_APP_UPDATE_KEYS = ['type'];
const APP_METADATA_KEY = 'app_metadata';
const USER_METADATA_KEY = 'user_metadata';

// update a user by auth0_id
// supported fields are: username, password, email, type, first_name, last_name
function updateAuth0User(auth0Id, updateParams) {
  var promise = getManagementClient();
  var updates = {connection: CONNECTION, client_id: CLIENT_ID};

  var update;
  var update_key;
  for (update_key in updateParams) {
    if (VALID_UPDATE_KEYS.includes(update_key)) {
      update = updateParams[update_key];
      // update username, password, or email
      updates[update_key] = update;
    } else if (VALID_USER_UPDATE_KEYS.includes(update_key)) {
      update = updateParams[update_key];
      // update first or last name
      if (!Object.keys(updates).includes(USER_METADATA_KEY)) {
        updates[USER_METADATA_KEY] = {};
      }
      updates[USER_METADATA_KEY][update_key] = update;
    } else if (VALID_APP_UPDATE_KEYS.includes(update_key)) {
      update = updateParams[update_key];
      // update type
      if (!Object.keys(updates).includes(APP_METADATA_KEY)) {
        updates[APP_METADATA_KEY] = {};
      }
      updates[APP_METADATA_KEY][update_key] = update;
    } else {
      // TODO: consider returning a better error here
      return createUnsupportedRequestError();
    }
  }

  return promise.then(function(mgmt) {
    return mgmt.users.update({id: auth0Id}, updates)
      .then(function(data) {
        return data;
      });
  });
};

module.exports = {
  getManagementClient, getAuth0ID, getAuth0User, createAuth0User, deleteAuth0User, updateAuth0User
};

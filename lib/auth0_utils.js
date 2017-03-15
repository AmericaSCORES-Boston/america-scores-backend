'use strict';

const query = require('./utils').query;
const createArgumentNotFoundError = require('./errors').createArgumentNotFoundError;
const ManagementClient = require('auth0').ManagementClient;
const AuthenticationClient = require('auth0').AuthenticationClient;

const dotenv = require('dotenv');
// Travis doesn't see the .env file; it has the token/domain as env variables already
const fs = require('fs');
if (fs.existsSync('./.env')) {
  dotenv.load();
}

const AUTH = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET
});

// SEE AS-273; there's got to be a better way to do this than grabbing a new access token each time
function getAccessToken() {
  return AUTH.clientCredentialsGrant({audience: 'https://asbadmin.auth0.com/api/v2/'})
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
      connection: 'Username-Password-Authentication',
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

module.exports = {
  getManagementClient, getAuth0ID, getAuth0User, createAuth0User, deleteAuth0User
};

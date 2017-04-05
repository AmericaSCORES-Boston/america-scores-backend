'use strict';

const Promise = require('bluebird');
const getSqlConnection = require('../config/connection').getSqlConnection;

function makeResponse(res, promise) {
  return promise.then(function(data) {
    res.send(data);
  }, function(err) {
      res.status(500).send(err);
  });
}

function isValidDate(date) {
  date = String(date);
  var dateRegEx = /^\d{4}-\d{2}-\d{2}$/;

  return date.match(dateRegEx) != null &&
    date.substring(5, 7) > 0 && date.substring(5, 7) < 13 &&
    date.substring(8) > 0 && date.substring(8) < 31;
}

function isPositiveInteger(str) {
  var intRegex = /^\d+$/;

  return String(str).match(intRegex) != null;
}

function Requirement(type, name) {
  this.type = type;
  this.name = name;
}

function PotentialQuery(requirements, queryString) {
  this.requirements = requirements;
  this.queryString = queryString;
}

function makeQueryArgs(obj, reqs) {
  var queryArgs = [];
  var req;
  for (var i = 0; i < reqs.length; i++) {
    req = reqs[i];
    queryArgs[i] = obj[req.type][req.name];
  }
  return queryArgs;
}

function reqHasRequirements(obj, reqs) {
  var keys = Object.keys(obj);
  var req;
  for (var i = 0; i < reqs.length; i++) {
    req = reqs[i];
    // Check that the request has the required key (e.g. 'params' or 'body')
    if (keys.indexOf(req.type) < 0) {
      return false;
    }
    // If the req name is null, all we cared about was the key's existence
    // If it's not null, we need to make sure it exists as a key within the object identified
    // by the requirement type.
    if (req.name !== null && Object.keys(obj[req.type]).indexOf(req.name) < 0) {
      return false;
    }
  }
  return true;
}

function findMissingRequirements(obj, reqs) {
  var keys = Object.keys(obj);
  return reqs.filter(function(req) {
    return !keys.includes(req.type) ||
      (req.name !== null && !Object.keys(obj[req.type]).includes(req.name));
  });
}

function findEmptyRequirements(obj, reqs) {
  return reqs.filter(function(req) {
    return obj[req.type][req.name].length == 0;
  });
}

function QueryError(name, status, message) {
  this.name = name;
  this.status = status;
  this.message = message;
  this.stack = (new Error()).stack;
}
QueryError.prototype = Object.create(Error.prototype);
QueryError.prototype.constructor = QueryError;

function query(queryString, args) {
  return Promise.using(getSqlConnection(), function(connection) {
    return connection.queryAsync(queryString, args);
  });
}

function defined(value) {
  return value !== undefined && value !== null;
}

function getAccountID(auth0_id) {
  return query('SELECT * FROM Acct WHERE auth0_id = ?', [auth0_id])
  .then(function(data) {
    if (data.length === 1) {
      return data[0].acct_id;
    } else {
      return Promise.reject({status: 403, message: 'Invalid Auth0 ID'});
    }
  });
}


module.exports = {
  makeResponse, query, QueryError,
  getAccountID,
  isValidDate, isPositiveInteger, defined,
  PotentialQuery, Requirement, makeQueryArgs, reqHasRequirements,
  findMissingRequirements, findEmptyRequirements
};

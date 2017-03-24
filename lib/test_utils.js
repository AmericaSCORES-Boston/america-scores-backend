'use strict';

const chai = require('chai');
const assert = chai.assert;

function assertEqualAuth0DBAcct(auth0, db) {
  assert.equal(auth0.email, db.email);
  assert.equal(auth0.user_metadata.first_name, db.first_name);
  assert.equal(auth0.user_metadata.last_name, db.last_name);
  assert.equal(auth0.app_metadata.acct_type, db.acct_type);
}

function assertEqualDBAcct(db1, db2) {
  assert.equal(db1.email, db2.email);
  assert.equal(db1.first_name, db2.first_name);
  assert.equal(db1.last_name, db2.last_name);
  assert.equal(db1.acct_type, db2.acct_type);
}

function assertEqualError(err, name, status, message) {
  assert.equal(err.name, name);
  assert.equal(err.status, status);
  assert.equal(err.message, message);
}

module.exports = {
  assertEqualAuth0DBAcct,
  assertEqualDBAcct,
  assertEqualError
};

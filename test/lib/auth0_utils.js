'use strict';

const chai = require('chai');
const assert = chai.assert;
const auth0 = require('../../lib/auth0_utils');

const ADMIN_AUTH0_ID = 'auth0|584377c428be27504a2bcf92';

describe('Auth0 Utils', function() {
  describe('getAuth0ID(acct_id)', function() {
    it('it should get the auth0 id for a given account id', function(done) {
      auth0.getAuth0ID('1').then(function(data) {
        assert.equal(data, ADMIN_AUTH0_ID);
        done();
      });
    });
    it('it should 404 when the account id doesn\'t exist', function(done) {
      auth0.getAuth0ID('999').catch(function(err) {
        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.status, 404);
        assert.equal(err.message, 'Invalid request: The given acct_id' +
          ' does not exist in the database');
        assert.equal(err.propertyName, 'acct_id');
        assert.equal(err.propertyValue, '999');
        done();
      });
    });
  });

  describe('getAuth0User(auth0_id)', function() {
    it('it should return the auth0 user for a given auth0 id', function(done) {
      auth0.getAuth0User(ADMIN_AUTH0_ID).then(function(data) {
        assert.equal(data.user_id, ADMIN_AUTH0_ID);
        assert.equal(data.email, 'ronlarge@americascores.org');
        assert.equal(data.user_metadata.first_name, 'Ron');
        assert.equal(data.user_metadata.last_name, 'Large');
        assert.equal(data.app_metadata.type, 'Coach');
        done();
      });
    });
    it('it should 404 when no auth0 user with the given id exists', function(done) {
      auth0.getAuth0User('999').catch(function(err) {
        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.status, 404);
        assert.equal(err.message, 'Invalid request: The given auth0_id' +
          ' does not exist in the database');
        assert.equal(err.propertyName, 'auth0_id');
        assert.equal(err.propertyValue, '999');
        done();
      });
    });
  });

  var createdAuth0Id;
  describe('createAuth0User(firstName, lastName, email, acctType, password)', function() {
    it('it should create an auth0 user for the given user data', function(done) {
      var first = 'TestFirst';
      var last = 'TestLast';
      var username = 'testusername';
      var email = 'test@email.com';
      var type = 'Admin';
      var password = 'TestPassword1';
      auth0.createAuth0User(first, last, username, email, type, password)
        .then(function(userId) {
          assert.isNotNull(userId);
          createdAuth0Id = userId;
          auth0.getAuth0User(userId).then(function(data) {
            assert.equal(data.email, email);
            assert.equal(data.user_metadata.first_name, first);
            assert.equal(data.user_metadata.last_name, last);
            assert.equal(data.app_metadata.type, type);
            done();
          });
        });
    });
      // TODO: user exists test, invalid password test, malformatted email test
  });

  describe('deleteAuth0User(auth0_id)', function() {
    it('it should delete an auth0 user with the given id', function(done) {
      // TODO: check that user exists
      auth0.deleteAuth0User(createdAuth0Id).then(function(data) {
        done();
      });
      // TODO: check that user doesn't exist
    });
    xit('it should 404 when trying to delete an auth0 user that doesn\'t exist', function(done) {
      // TODO: write this
    });
  });
});


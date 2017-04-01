'use strict';

const chai = require('chai');
const assert = chai.assert;

const errors = require('../../lib/errors');
const Requirement = require('../../lib/utils').Requirement;
const testUtils = require('../../lib/test_utils');
const assertEqualError = testUtils.assertEqualError;

describe('errors', function() {
  describe('createAccessDeniedError()', function() {
    it('creates an access denied error', function(done) {
      var promise = errors.createAccessDeniedError();

      promise.catch(function(err) {
        assertEqualError(err, 'AccessDenied', 403,
          'Access denied: this account does not have permission for this action');
        done();
      });
    });
  });

  describe('createInvalidArgumentError(id, field, message)', function() {
    it('creates an invalid argument error with the default error message', function(done) {
        var promise = errors.createInvalidArgumentError('id', 'field', undefined);

        promise.catch(function(err) {
          assertEqualError(err, 'InvalidArgumentError', 400,
            'Given field is of invalid format (e.g. not an integer or negative)');
          assert.equal(err.propertyName, 'field');
          assert.equal(err.propertyValue, 'id');
          done();
        });
    });
    it('creates an invalid argument error with a custom error message', function(done) {
        var promise = errors.createInvalidArgumentError('value', 'name', 'ERROR!');

        promise.catch(function(err) {
          assertEqualError(err, 'InvalidArgumentError', 400, 'ERROR!');
          assert.equal(err.propertyName, 'name');
          assert.equal(err.propertyValue, 'value');
          done();
        });
    });
  });

  describe('createUnsupportedRequestError()', function() {
    it('creates an unsupported request error', function(done) {
      var promise = errors.createUnsupportedRequestError();

      promise.catch(function(err) {
        assertEqualError(err, 'UnsupportedRequest', 501,
          'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
        done();
      });
    });
  });

  describe('createArgumentNotFoundError(id, field)', function() {
    it('creates an argument not found error', function(done) {
      var promise = errors.createArgumentNotFoundError('id', 'field');

      promise.catch(function(err) {
        assertEqualError(err, 'ArgumentNotFoundError', 404,
          'Invalid request: The given field does not exist in the database');
        assert.equal(err.propertyName, 'field');
        assert.equal(err.propertyValue, 'id');
        done();
      });
    });
  });

  describe('createMissingFieldError(missingFields)', function() {
    var req1 = new Requirement('query', 'last_name');
    var req2 = new Requirement('body', null);
    it('creates a missing field error for a single missing field', function(done) {
      errors.createMissingFieldError([req1]).catch(function(err) {
        assertEqualError(err, 'Missing Field', 400,
          'Request must have the following component(s): ' +
          'last_name (query)');
        done();
      });
    });

    it('creates a missing field error for multiple missing fields', function(done) {
      errors.createMissingFieldError([req1, req2]).catch(function(err) {
        assertEqualError(err, 'Missing Field', 400,
          'Request must have the following component(s): ' +
          'last_name (query), ' +
          'body');
        done();
      });
    });
  });

  describe('createEmptyFieldError(missingFields)', function() {
    var req1 = new Requirement('query', 'last_name');
    var req2 = new Requirement('body', 'first_name');
    it('creates an empty field error for a single empty field', function(done) {
      errors.createEmptyFieldError([req1]).catch(function(err) {
        assertEqualError(err, 'Empty Field', 400,
          'Request must have the following non-empty component(s): ' +
          'last_name (query)');
        done();
      });
    });

    it('creates an empty field error for multiple missing fields', function(done) {
      errors.createEmptyFieldError([req1, req2]).catch(function(err) {
        assertEqualError(err, 'Empty Field', 400,
          'Request must have the following non-empty component(s): ' +
          'last_name (query), ' +
          'first_name (body)');
        done();
      });
    });
  });

  describe('create500()', function() {
    it('creates a generic internal server error', function(done) {
      errors.create500().catch(function(err) {
        assertEqualError(err, 'Internal Server Error', 500,
          'The server encountered an unexpected condition which prevented it from fulfilling the request');
        done();
      });
    });

    it('creates an internal server error with a specific message', function(done) {
      var custom = 'There was an error';
      errors.create500({message: custom}).catch(function(err) {
        assertEqualError(err, 'Internal Server Error', 500, custom);
        done();
      });
    });
  });

  describe('create404(errorFields)', function() {
    it('creates a generic 404 error', function(done) {
      errors.create404().catch(function(err) {
        assertEqualError(err, 'Not Found', 404, 'The requested resource could not be found');
        done();
      });
    });

    it('creates a 404 error with a specific message', function(done) {
      var custom = 'There was an error';
      errors.create404({message: custom}).catch(function(err) {
        assertEqualError(err, 'Not Found', 404, custom);
        done();
      });
    });
  });

  describe('create400(errorFields)', function() {
    it('creates a generic 400 error', function(done) {
      errors.create400().catch(function(err) {
        assertEqualError(err, 'Bad Request', 400, 'The request cannot be fulfilled due to bad syntax');
        done();
      });
    });

    it('creates a 400 error with a specific message', function(done) {
      var custom = 'There was an error';
      errors.create400({message: custom}).catch(function(err) {
        assertEqualError(err, 'Bad Request', 400, custom);
        done();
      });
    });
  });
  describe('InvalidKeyError(key)', function() {
    it('creates an InvalidKeyError', function() {
      var invalidKeyError = new errors.InvalidKeyError('myKey');
      assert.equal(invalidKeyError.name, 'InvalidKeyError');
      assert.equal(invalidKeyError.message, 'Tried to access invalid key: myKey');
    });
  });
});

'use strict';

const chai = require('chai');
const assert = chai.assert;
const errors = require('../../lib/errors');

describe('errors', function() {
  describe('createAccessDeniedError()', function() {
    it('creates an access denied error', function(done) {
      var promise = errors.createAccessDeniedError();

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

        done();
      });
    });
  });

  describe('createInvalidArgumentError(id, field, message)', function() {
    it('creates an invalid argument error with the default error message', function(done) {
        var promise = errors.createInvalidArgumentError('id', 'field', undefined);

        promise.catch(function(err) {
          assert.equal(err.name, 'InvalidArgumentError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'Given field is of invalid format ' +
              '(e.g. not an integer or negative)');
          assert.equal(err.propertyName, 'field');
          assert.equal(err.propertyValue, 'id');
          done();
        });
    });
    it('creates an invalid argument error with a custom error message', function(done) {
        var promise = errors.createInvalidArgumentError('value', 'name', 'ERROR!');

        promise.catch(function(err) {
          assert.equal(err.name, 'InvalidArgumentError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'ERROR!');
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
        assert.equal(err.name, 'UnsupportedRequest');
        assert.equal(err.status, 501);
        assert.equal(err.message, 'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
        done();
      });
    });
  });
});

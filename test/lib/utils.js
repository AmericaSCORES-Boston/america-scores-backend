'use strict';

const Promise = require('bluebird');
const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;

const seed = require('../../lib/seed').testSeed;
const utils = require('../../lib/utils');
const q = require('../../lib/constants/queries');
const a = require('../../lib/constants/auth0');
const c = require('../../lib/constants/utils');

const AUTH0_ID = a.ACCT1_AUTH0_ID;

const assertEqualError = require('../../lib/test_utils').assertEqualError;

const res = {
  send: function(data) {},
  status: function(status) {}
};

describe('utils', function() {
  before(function(done) {
    /* eslint-disable no-invalid-this */
    this.timeout(20000);
    /* eslint-enable no-invalid-this */
    seed().then(function() {
      done();
    });
  });

  describe('makeResponse(res, promise)', function() {
    var resSendSpy;
    var resStatusSpy;

    before(function() {
      resSendSpy = sinon.spy(res, 'send');
      resStatusSpy = sinon.spy(res, 'status');
    });

    after(function() {
      res.send.restore();
      res.status.restore();
    });

    it('makes a 200 response', function(done) {
      var promise = Promise.resolve('data');

      utils.makeResponse(res, promise).then(function() {
        assert.isTrue(resSendSpy.calledWith('data'));
        done();
      });
    });

    it('makes all other responses', function(done) {
      var promise = Promise.reject({
        status: 500
      });

      utils.makeResponse(res, promise).catch(function() {
        assert.isTrue(resStatusSpy.calledWith(500));
        done();
      });
    });
  });
  describe('isValidDate(date)', function() {
    it('returns true because the date is valid', function() {
      assert.isTrue(utils.isValidDate('2017-01-01'));
    });

    it('returns false because the date is given as a single number', function() {
      assert.isFalse(utils.isValidDate(3));
    });

    it('returns false because the date has a negative month', function() {
      assert.isFalse(utils.isValidDate('2016--2-01'));
    });

    it('returns false because the date has a month over 12', function() {
      assert.isFalse(utils.isValidDate('2016-22-01'));
    });

    it('returns false because the date has a negative day', function() {
      assert.isFalse(utils.isValidDate('2016-10--1'));
    });

    it('returns false because the date has a day over 30', function() {
      assert.isFalse(utils.isValidDate('2016-10-31'));
    });
  });

  describe('isPositiveInteger(str)', function() {
    it('returns true because the input valid', function() {
      assert.isTrue(utils.isPositiveInteger('2'));
    });

    it('returns false because the input not an number', function() {
      assert.isFalse(utils.isPositiveInteger('a'));
    });

    it('returns false because the input not an integer', function() {
      assert.isFalse(utils.isPositiveInteger(2.23));
    });

    it('returns false because the input negeative', function() {
      assert.isFalse(utils.isPositiveInteger(-2));
    });
  });

  describe('QueryError(name, status, message)', function() {
    it('should create a query error using the given arguments', function() {
      var err = new utils.QueryError('InvalidArgumentError', 400, 'ID type error');
      assert.equal(err.name, 'InvalidArgumentError');
      assert.equal(err.status, 400);
      assert.equal(err.message, 'ID type error');
    });
  });

  describe('define(value)', function() {
    it('returns false because the value is undefined', function() {
      assert.isFalse(utils.defined(undefined));
    });

    it('returns false because the value is null', function() {
      assert.isFalse(utils.defined(null));
    });

    it('returns false because the object\'s field is not defined', function() {
      var testObject = {};
      assert.isFalse(utils.defined(testObject.value));
    });

    it('returns true because \'\' is defined', function() {
      assert.isTrue(utils.defined(''));
    });

    it('returns true because 0 is defined', function() {
      assert.isTrue(utils.defined(0));
    });

    it('returns true because the object is defined', function() {
      var testObject = {
        value: 4
      };
      assert.isTrue(utils.defined(testObject.value));
    });
  });

  describe('getAccountID()', function() {
    it('gets the account id for a auth0_id', function(done) {
      utils.getAccountID(AUTH0_ID).then(function(data) {
        assert.equal(data, 1);
        done();
      });
    });
    it('returns an error for an invalid auth0_id', function(done) {
      utils.getAccountID('invalid').catch(function(err) {
        assert.equal(err.status, 403);
        done();
      });
    });
  });

  describe('reqHasRequirements(requestObj, requirementsList)', function() {
    var obj = {
      'query': {
        'testReq': '1',
      },
      'body': {
      }
    };
    it('returns true when the request has no requirements',
      function() {
        assert.isTrue(utils.reqHasRequirements(obj, []));
    });
    it('returns true when the request has the specified requirements',
      function() {
        assert.isTrue(utils.reqHasRequirements(obj,
            [new utils.Requirement('query', 'testReq')]));
    });
    it('returns true when the request has the specified requirement type if given no name',
      function() {
        assert.isTrue(utils.reqHasRequirements(obj,
            [new utils.Requirement('body', null)]));
    });
    it('returns false when the request is missing specified requirements',
      function() {
        assert.isFalse(utils.reqHasRequirements(obj,
            [new utils.Requirement('query', 'testReq2')]));
    });
    it('returns false when the request is missing specified type of requirements',
      function() {
        assert.isFalse(utils.reqHasRequirements(obj,
            [new utils.Requirement('params', 'testReq3')]));
    });
  });

  describe('findMissingRequirements(requestObj, requirementsList)', function() {
    var obj = {
      'query': {
        'testReq': '1',
      },
      'body': {}
    };
    var req1 = new utils.Requirement('query', 'testReq2');
    var req2 = new utils.Requirement('params', 'testReq3');

    it('returns an empty list when the request has no requirements',
      function() {
        assert.lengthOf(utils.findMissingRequirements(obj, []), 0);
    });

    it('returns an empty list when the request has the specified requirements',
      function() {
        assert.lengthOf(utils.findMissingRequirements(obj, [new utils.Requirement('query', 'testReq')]), 0);
    });

    it('returns an empty list when the request has the specified requirement type if given no name',
      function() {
        assert.lengthOf(utils.findMissingRequirements(obj, [new utils.Requirement('body', null)]), 0);
    });

    it('returns the missing requirement when the request is missing specified requirements',
      function() {
        assert.deepEqual(utils.findMissingRequirements(obj, [req1]), [req1]);
    });

    it('returns the missing requirement when the request is missing specified type of requirements',
      function() {
        assert.deepEqual(utils.findMissingRequirements(obj, [req2]), [req2]);
    });

    it('returns all the missing requirements when the request is missing more than one',
      function() {
        assert.deepEqual(utils.findMissingRequirements(obj, [req1, req2]), [req1, req2]);
    });
  });

  describe('findEmptyRequirements(requestObj, nonEmptyRequirements)', function() {
    var obj = {
      'query': {
        'first_name': '',
        'last_name': 'NotEmpty',
        'title': ''
      }
    };
    var req1 = new utils.Requirement('query', 'last_name');
    var req2 = new utils.Requirement('query', 'first_name');
    var req3 = new utils.Requirement('query', 'title');

    it('returns an empty list when the request has no requirements', function() {
      assert.lengthOf(utils.findEmptyRequirements(obj, []), 0);
    });

    it('returns an empty list when the request has the specified non-empty requirements', function() {
      assert.lengthOf(utils.findEmptyRequirements(obj, [req1]), 0);
    });

    it('returns the empty requirement when the request has a specified empty value', function() {
      assert.deepEqual(utils.findEmptyRequirements(obj, [req2]), [req2]);
    });

    it('returns the empty requirements when the request has multiple specified empty values', function() {
      assert.deepEqual(utils.findEmptyRequirements(obj, [req1, req2, req3]), [req2, req3]);
    });
  });

  describe('getAccountType(auth0Id)', function() {
    it('retrieves the account type for the given auth0 id', function(done) {
      utils.getAccountType(a.ADMIN_AUTH0_ID).then(function(acct_type) {
        assert.equal(c.ADMIN, acct_type);
        done();
      });
    });
  });

  describe('makeQueryArgs(requestObj, requirementsList)', function() {
    var req1 = new utils.Requirement('query', 'testReq');
    var req2 = new utils.Requirement('query', 'testReq2');
    var req3 = new utils.Requirement('params', 'testReq3');
    var obj = {
      'query': {
        'testReq': '1',
        'testReq2': '2'
      },
      'params': {
        'testReq3': '3'
      }
    };
    it('creates a list of SQL query arguments from the requirements',
      function() {
        assert.deepEqual(utils.makeQueryArgs(obj, [req1, req2, req3]), ['1', '2', '3']);
    });
    it('preserves the requirements order in the query args it creates',
      function() {
        assert.deepEqual(utils.makeQueryArgs(obj, [req3, req1, req2]), ['3', '1', '2']);
    });
    it('returns no args when given an empty requirements list',
      function() {
        assert.deepEqual(utils.makeQueryArgs(obj, []), []);
    });
  });

  describe('getSqlDateString(date)', function() {
    it('makes a SQL date string from the given date', function() {
      assert.equal(utils.getSqlDateString(new Date(2017, 4, 8)), '2017-05-08');
    });
  });

  describe('getJSDate(dateString)', function() {
    it('makes a javascript date object from a sql date string', function() {
      var createdDate = utils.getJSDate('2017-02-01');
      assert.equal(createdDate.getFullYear(), 2017);
      assert.equal(createdDate.getMonth(), 1);
      assert.equal(createdDate.getDate(), 1);
    });
  });

  describe('getSeasonId(dateString)', function() {
    after(function(done) {
      utils.query(q.DELETE_SEASON_BY_ID, [4]).then(function() {
        done();
      });
    });

    it('returns a season id for a season that already exists in the database', function(done) {
      utils.getSeasonId('2016-12-12').then(function(seasonId) {
        assert.equal(seasonId, 2);
        utils.query(q.SELECT_SEASON).then(function(seasons) {
          assert.lengthOf(seasons, 3);
          done();
        });
      });
    });

    it('returns a season id after creating a season in the database', function(done) {
      utils.getSeasonId('2010-01-26').then(function(seasonId) {
        assert.equal(seasonId, 4);
        utils.query(q.SELECT_SEASON).then(function(seasons) {
          assert.lengthOf(seasons, 4);
          assert.equal(seasons[3].season, c.SPRING);
          assert.equal(seasons[3].year, 2010);
          done();
        });
      });
    });
  });

  describe('rollback(err, logMsg, rollbackFunction)', function() {
    it('performs the rollbackFunction and returns a 500 error', function(done) {
      var mutable = {foo: 'bar'};
      utils.rollback('error', 'log', function() {
        mutable.foo = 'baz';
        return Promise.resolve();
      }).catch(function(err) {
        assertEqualError(err, 'Internal Server Error', 500,
          'The server encountered an unexpected condition which prevented it from fulfilling the request');
        assert.equal(mutable.foo, 'baz');
        done();
      });
    });
  });
});

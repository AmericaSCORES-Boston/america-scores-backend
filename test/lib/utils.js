'use strict';

const Promise = require('bluebird');
const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const utils = require('../../lib/utils');

const res = {
  send: function(data) {},
  status: function(status) {}
};

describe('utils', function() {
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

    it('makes all other respones', function(done) {
      var promise = Promise.reject({
        status: 404
      });

      utils.makeResponse(res, promise).catch(function() {
        assert.isTrue(resStatusSpy.calledWith(404));
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

  describe('demoSeed()', function() {
    it('seeds the db with demo data', function(done) {
      utils.demoSeed().then(function() {
        return utils.query('SELECT * FROM Site');
      })
      .then(function(rows) {
        assert.equal(rows.length, 11);
        return utils.query('SELECT * FROM Program');
      })
      .then(function(rows) {
        assert.equal(rows.length, 4);
        return utils.query('SELECT * FROM Student');
      })
      .then(function(rows) {
        assert.equal(rows.length, 6);
        return utils.query('SELECT * FROM StudentToProgram');
      })
      .then(function(rows) {
        assert.equal(rows.length, 7);
        return utils.query('SELECT * FROM Acct');
      })
      .then(function(rows) {
        assert.equal(rows.length, 9);
        return utils.query('SELECT * FROM AcctToProgram');
      })
      .then(function(rows) {
        assert.equal(rows.length, 7);
        return utils.query('SELECT * FROM Event');
      })
      .then(function(rows) {
        assert.equal(rows.length, 6);
        done();
      });
    });
  });
});

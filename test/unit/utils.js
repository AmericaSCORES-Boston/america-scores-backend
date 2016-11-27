'use strict';

const chai = require('chai');
const assert = chai.assert;
const utils = require('../../lib/utils');

describe('utils', function() {
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

  describe('query(queryString, args)', function() {
    xit('should error if the query has an invalid argument',
    function(done) {
      var queryString = 'INSERT INTO Student (first_name, last_name, dob) ' +
      'VALUES (?, ?, DATE(?))';
      var args = ['Newt', 'Scamander', '087718/1993'];

      utils.query(queryString, args)
      .then(function(data) {
        utils.query('SELECT student_id FROM Student WHERE ' +
          'first_name = ? AND last_name = ? AND dob = ?', args)
        .then(function(data) {
          console.log(data);
          done(new Error('Query did not fail as expected'));
        });
      })
      .catch(function(err) {
        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.status, 400);
        assert.equal(err.message, 'ID type error');
        done();
      });
    });

    it('should error if the query references an id that does not exist',
    function(done) {
      var queryString = 'INSERT INTO StudentToProgram ' +
      '(student_id, program_id) VALUES (?, ?)';
      var args = [12213, 2333];

      utils.query(queryString, args)
      .then(function(data) {
        done(new Error('Query did not fail as expected'));
      })
      .catch(function(err) {
        assert.equal(err.name, 'ArgumentNotFound');
        assert.equal(err.status, 404);
        assert.equal(err.message, 'ID not found in DB');
        done();
      });
    });

    it('should error if the query has missing parts',
    function(done) {
      var queryString = 'INSERT INTO Student (first_name, last_name, dob) ' +
      'VALUES (?, ?, DATE(?))';
      var args = [undefined, undefined, undefined];

      utils.query(queryString, args)
      .then(function(data) {
        done(new Error('Query did not fail as expected'));
      })
      .catch(function(err) {
        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.status, 400);
        assert.equal(err.message, 'Body error');
        done();
      });
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
});

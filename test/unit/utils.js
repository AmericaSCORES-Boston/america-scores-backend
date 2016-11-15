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
});

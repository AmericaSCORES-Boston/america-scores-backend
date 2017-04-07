'use strict';

const chai = require('chai');
const assert = chai.assert;

const seed = require('../../lib/seed');
const utils = require('../../lib/utils');

describe('seed utils', function() {
  describe('demoSeed()', function() {
    it('seeds the db with demo data', function(done) {
      seed.dbDemoSeed().then(function() {
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

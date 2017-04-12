'use strict';

const chai = require('chai');
const assert = chai.assert;

const seed = require('../../lib/seed');
const utils = require('../../lib/utils');
const q = require('../../lib/constants/queries');

describe('seed utils', function() {
  describe('demoSeed()', function() {
    before(function(done) {
      seed.demoSeed().then(function() {
        done();
      });
    });

    function queryForLength(query, expectedLength, done) {
      utils.query(query).then(function(rows) {
        assert.lengthOf(rows, expectedLength);
        done();
      });
    }

    it('it inserts all the demo students in the db', function(done) {
      queryForLength(q.SELECT_STUDENT, 20, done);
    });

    it('it inserts all the demo sites in the db', function(done) {
      queryForLength(q.SELECT_SITE, 3, done);
    });

    it('it inserts all the demo programs in the db', function(done) {
      queryForLength(q.SELECT_PROGRAM, 4, done);
    });

    it('it inserts all the demo student/program associations in the db', function(done) {
      queryForLength(q.SELECT_STUDENT_TO_PROGRAM, 20, done);
    });

    it('it inserts all the demo accounts in the db', function(done) {
      queryForLength(q.SELECT_ACCT, 1, done);
    });

    it('it inserts all the demo account/program associations in the db', function(done) {
      queryForLength(q.SELECT_ACCT_TO_PROGRAM, 4, done);
    });

    it('it inserts all the demo seasons in the db', function(done) {
      queryForLength(q.SELECT_SEASON, 1, done);
    });

    it('it inserts all the demo events in the db', function(done) {
      queryForLength(q.SELECT_EVENT, 6, done);
    });

    it('it inserts all the demo stats in the db', function(done) {
      queryForLength(q.SELECT_STAT, 30, done);
    });
  });
});

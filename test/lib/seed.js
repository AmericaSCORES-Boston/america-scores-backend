'use strict';

const chai = require('chai');
const assert = chai.assert;

const seed = require('../../lib/seed');
const utils = require('../../lib/utils');
const auth0 = require('../../lib/auth0_utils');
const c = require('../../lib/constants/utils');
const q = require('../../lib/constants/queries');
const s = require('../../lib/constants/seed');

const query = utils.query;

describe('seed utils', function() {
  /* eslint-disable no-invalid-this */
  this.timeout(30000);
  /* eslint-enable no-invalid-this */
  const TEST_STUDENT_COUNT = 4;
  const TEST_SITE_COUNT = 11;
  const TEST_PROGRAM_COUNT = 4;
  const TEST_STUDENT_TO_PROGRAM_COUNT = 4;
  const TEST_ACCT_COUNT = 9;
  const TEST_ACCT_TO_PROGRAM_COUNT = 7;
  const TEST_SEASON_COUNT = 3;
  const TEST_EVENT_COUNT = 6;
  const TEST_STAT_COUNT = 6;

  const DEMO_STUDENT_COUNT = 20;
  const DEMO_SITE_COUNT = 3;
  const DEMO_PROGRAM_COUNT = 4;
  const DEMO_STUDENT_TO_PROGRAM_COUNT = 20;
  const DEMO_ACCT_COUNT = 1;
  const DEMO_ACCT_TO_PROGRAM_COUNT = 4;
  const DEMO_SEASON_COUNT = 1;
  const DEMO_EVENT_COUNT = 6;
  const DEMO_STAT_COUNT = 30;

  function queryForLength(query, expectedLength, done) {
    utils.query(query).then(function(rows) {
      assert.lengthOf(rows, expectedLength);
      done();
    });
  }

  describe('testSeed()', function() {
    before(function(done) {
      seed.testSeed().then(function() {
        done();
      });
    });

    it('it inserts all the test students in the db', function(done) {
      queryForLength(q.SELECT_STUDENT, TEST_STUDENT_COUNT, done);
    });

    it('it inserts all the test sites in the db', function(done) {
      queryForLength(q.SELECT_SITE, TEST_SITE_COUNT, done);
    });

    it('it inserts all the test programs in the db', function(done) {
      queryForLength(q.SELECT_PROGRAM, TEST_PROGRAM_COUNT, done);
    });

    it('it inserts all the test student/program associations in the db', function(done) {
      queryForLength(q.SELECT_STUDENT_TO_PROGRAM, TEST_STUDENT_TO_PROGRAM_COUNT, done);
    });

    it('it inserts all the test accounts in the db', function(done) {
      queryForLength(q.SELECT_ACCT, TEST_ACCT_COUNT, done);
    });

    it('it inserts all the test account/program associations in the db', function(done) {
      queryForLength(q.SELECT_ACCT_TO_PROGRAM, TEST_ACCT_TO_PROGRAM_COUNT, done);
    });

    it('it inserts all the test seasons in the db', function(done) {
      queryForLength(q.SELECT_SEASON, TEST_SEASON_COUNT, done);
    });

    it('it inserts all the test events in the db', function(done) {
      queryForLength(q.SELECT_EVENT, TEST_EVENT_COUNT, done);
    });

    it('it inserts all the test stats in the db', function(done) {
      queryForLength(q.SELECT_STAT, TEST_STAT_COUNT, done);
    });
  });

  describe('demoSeed()', function() {
    before(function(done) {
      seed.demoSeed().then(function() {
        done();
      });
    });

    it('it inserts all the demo students in the db', function(done) {
      queryForLength(q.SELECT_STUDENT, DEMO_STUDENT_COUNT, done);
    });

    it('it inserts all the demo sites in the db', function(done) {
      queryForLength(q.SELECT_SITE, DEMO_SITE_COUNT, done);
    });

    it('it inserts all the demo programs in the db', function(done) {
      queryForLength(q.SELECT_PROGRAM, DEMO_PROGRAM_COUNT, done);
    });

    it('it inserts all the demo student/program associations in the db', function(done) {
      queryForLength(q.SELECT_STUDENT_TO_PROGRAM, DEMO_STUDENT_TO_PROGRAM_COUNT, done);
    });

    it('it inserts all the demo accounts in the db', function(done) {
      queryForLength(q.SELECT_ACCT, DEMO_ACCT_COUNT, done);
    });

    it('it inserts all the demo account/program associations in the db', function(done) {
      queryForLength(q.SELECT_ACCT_TO_PROGRAM, DEMO_ACCT_TO_PROGRAM_COUNT, done);
    });

    it('it inserts all the demo seasons in the db', function(done) {
      queryForLength(q.SELECT_SEASON, DEMO_SEASON_COUNT, done);
    });

    it('it inserts all the demo events in the db', function(done) {
      queryForLength(q.SELECT_EVENT, DEMO_EVENT_COUNT, done);
    });

    it('it inserts all the demo stats in the db', function(done) {
      queryForLength(q.SELECT_STAT, DEMO_STAT_COUNT, done);
    });
  });

  describe('dbSeed(type, queries)', function(done) {
    it('it defaults to seeding the database with test data when no type/queries are specified', function(done) {
      seed.dbSeed().then(function() {
        query(q.SELECT_SITE).then(function(students) {
          assert.deepEqual(students, s.TEST_SITES);
          done();
        });
      });
    });

    it('it defaults to seeding the database with demo data when no queries are specified but the type is demo', function(done) {
      seed.dbSeed(c.DEMO).then(function() {
        query(q.SELECT_SITE).then(function(students) {
          assert.deepEqual(students, s.DEMO_SITES);
          done();
        });
      });
    });

    it('it seeds the database with the given queries regardless of the type', function(done) {
      // ensure some data is in the database
      seed.dbSeed(c.TEST).then(function() {
        // send a truncate student to program query
        seed.dbSeed(c.DEMO, [q.TRUNCATE_STUDENT_TO_PROGRAM]).then(function() {
          // ensure the table was truncated
          query(q.SELECT_STUDENT_TO_PROGRAM).then(function(students) {
            assert.lengthOf(students, 0);
            // ensure another table wasn't affected
            query(q.SELECT_SITE).then(function(sites) {
              assert.deepEqual(sites, s.TEST_SITES);
              done();
            });
          });
        });
      });
    });
  });

  describe('auth0Seed(type, accts)', function(done) {
    const TEST_AUTH0_FIRST = 'Foo';
    const DEMO_AUTH0_FIRST = 'Bar';
    const DEMO_ACCT_1 = s.DEMO_ACCTS[0];

    beforeEach(function(done) {
      setTimeout(function() {
        auth0.updateAuth0UserFromParams(s.ACCT_1.auth0_id, {first_name: TEST_AUTH0_FIRST}).then(function() {
          auth0.updateAuth0UserFromParams(DEMO_ACCT_1.auth0_id, {first_name: DEMO_AUTH0_FIRST}).then(function() {
            done();
          });
        });
      }, 10000);
    });

    after(function(done) {
      setTimeout(function() {
        auth0.updateAuth0UserFromParams(s.ACCT_1.auth0_id, {first_name: s.ACCT_1.first_name}).then(function() {
          var updates = {first_name: DEMO_ACCT_1.first_name};
          auth0.getAuth0User(DEMO_ACCT_1.auth0_id).then(function(acct) {
            if (acct.email != DEMO_ACCT_1.email) {
              updates['email'] = DEMO_ACCT_1.email;
            }
            auth0.updateAuth0UserFromParams(DEMO_ACCT_1.auth0_id, updates).then(function() {
             done();
           });
          });
        });
      }, 10000);
    });

    it('it defaults to seeding auth0 with the test acct data when no type/accts are specified', function(done) {
      seed.auth0Seed().then(function() {
        auth0.getAuth0User(s.ACCT_1.auth0_id).then(function(acct) {
          assert.equal(acct.user_metadata.first_name, s.ACCT_1.first_name);
          auth0.getAuth0User(DEMO_ACCT_1.auth0_id).then(function(acct) {
            assert.equal(acct.user_metadata.first_name, DEMO_AUTH0_FIRST);
            done();
          });
        });
      });
    });

    it('it defaults to seeding auth0 with the demo acct data when no accts are specified but the type is demo', function(done) {
      seed.auth0Seed(c.DEMO).then(function() {
        auth0.getAuth0User(DEMO_ACCT_1.auth0_id).then(function(acct) {
          assert.equal(acct.user_metadata.first_name, DEMO_ACCT_1.first_name);
          auth0.getAuth0User(s.ACCT_1.auth0_id).then(function(acct) {
            assert.equal(acct.user_metadata.first_name, TEST_AUTH0_FIRST);
            done();
          });
        });
      });
    });

    it('it seeds auth0 with the given accts regardless of the type', function(done) {
      var seedAcct = Object.assign(Object.assign({}, DEMO_ACCT_1), {
        first_name: 'Baz',
        email: 'foobarbaz@americascores.org',
      });

      seed.auth0Seed(c.TEST, [seedAcct]).then(function() {
        setTimeout(function() {
          auth0.getAuth0User(DEMO_ACCT_1.auth0_id).then(function(acct) {
            assert.equal(acct.user_metadata.first_name, 'Baz');
            assert.equal(acct.email, 'foobarbaz@americascores.org');
            auth0.getAuth0User(s.ACCT_1.auth0_id).then(function(acct) {
              assert.equal(acct.user_metadata.first_name, TEST_AUTH0_FIRST);
              done();
            });
          });
        }, 10000);
      });
    });
  });
});

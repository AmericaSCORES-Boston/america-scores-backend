// // Set the env to test
process.env.NODE_ENV = 'test';

// // Require the testing dependencies
 //var sinon = require('sinon') // how is sinon used? To check if things are called?
var chai = require('chai');
const sinon = require('sinon');
const assert = require('assert');
const Promise = require('bluebird');
const pool = require('../../config/config').pool;
const stats = require('../../routes/stats')

var fakeStat = {
  stat_id: 1,
  stat_student_id: 1,
  stat_event_id: 1,
  stat_weight: 300,
  stat_height: 65,
  state_pacer: 999,
};
var fakeStat2 = {
  stat_id: 2,
  stat_student_id: 2,
  stat_event_id: 1,
  stat_weight: 500,
  stat_height: 66,
  state_pacer: 888,
};
var fakeStat3 = {
  stat_id: 3,
  stat_student_id: 3,
  stat_event_id: 2,
  stat_weight: 350,
  stat_height: 67,
  state_pacer: 999,
};
var fakeStat4 = {
  stat_id: 4,
  stat_student_id: 1,
  stat_event_id: 1,
  stat_weight: 600,
  stat_height: 85,
  state_pacer: 777,
};
// StudentStats testing block
describe('utils', function() {

  describe('stats', function() {

    // Get all stats
    it('gets all stats of everyone', function(done) {
      var promise = stats.getStats({});

        promise.then(function(data) {
          assert.deepEqual(data, [fakeStat, fakeStat2]);
          assert.length(data, 4);
          done();
        });
      });

    // Get all stats at one site
    it('gets all stats of everyone at one site', function(done) {
      var promise = stats.getStatsFromSite({
        req: {
          query: {
            stat_event_id: 1
          }
        }
      });

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat, fakeStat2]);
        assert.length(data, 2);
        done();
      });
    });

    // Get all stats at one site error
    it('getStatsFromSite missing field error', function(done) {
      // Assert that an error is thrown when last name is missing
      assert.throw(function() {
        stats.getStatsFromSite(req);
      },
      Error);

      var promise = stats.getStatsFromSite({});

      promise.then(function(data) {
        assert.equal(data.message,
        'Unable to get stats, missing EventID');
        done();
      });
    });

    // Get all stats of one student
    it('gets all stats of one student', function(done) {

      var promise = stats.getStatsOfStudent({
        req: {
          query: {
            stat_student_id: 1
          }
        }
      });

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat1, fakeStat4]);
        assert.length(data, 2);
        done();
      });
    });

    // Get all stats of one student error
    it('getStatsOfStudent missing field error', function(done) {
      // Assert that an error is thrown when last name is missing
      assert.throw(function() {
        stats.getStatsOfStudent(req);
      },
      Error);

      var promise = stats.getStatsOfStudent({});

      promise.then(function(data) {
        assert.equal(data.message,
        'Unable to get stats, missing StudentID');
        done();
      });
    });

    // Get one set of stats for one student
    it('gets one stats of one student', function(done) {
      var promise = stats.getOneStatOfStudent({
        req: {
          query: {
            stat_id: 1
          }
        }
      });

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat]);
        assert.length(data, 1);
        done();
      });
    });

    // Get one set of stats for one student error
    it('getOneStatOfStudent missing field error', function(done) {
      // Assert that an error is thrown when last name is missing
      assert.throw(function() {
        stats.getOneStatOfStudent(req);
      },
      Error);

      var promise = stats.getOneStatOfStudent({});

      promise.then(function(data) {
        assert.equal(data.message,
        'Unable to get stats, missing StatID');
        done();
      });
    });


    //Post a new row of stats into stats database
    it('puts a new stats of a student', function(done) {
      var promise = stats.getStats({});

      promise.then(function(data) {
        assert.length(data, 4);
      })
      .then(function(data) {
        stats.postStats({
          req: {
            stat_student_id: 2,
            stat_event_id: 2,
            stat_weight: 320,
            stat_height: 54,
            state_pacer: 382,
          }
        })
      })
      .then(function(data) {
        assert.length(data, 5);
        done();
      });
    });

    // Post a new row of stats into stats database error
    it('postStats missing field error', function(done) {
      // Assert that an error is thrown when last name is missing
      assert.throw(function() {
        stats.postStats(req);
      },
      Error);

      var promise = stats.postStats({});

      promise.then(function(data) {
        assert.equal(data.message,
        'Unable to post stats, missing field(s)');
        done();
      });
    });

    // Update existing stats of a student
    it('Updates a stat of a student currently in the database', function(done) {
      var unChanged = stats.getStats();
      var promise = stats.updateStats({
        req: {
          stat_id:1,
          stat_weight:999,
          stat_height:99,
        }
      });
      promise.then(function(data) {
        var changed = stats.getStats();
        assert.notDeepEqual(unChanged, changed);
      })
      .then(function(data) {
        var newStats = getOneStatOfStudent({
          req: {
            stat_id: 1,
          }
        })
      })
      .then(function(data) {
        assert.deepEqual(newStats.stat_weight, 999);
        assert.deepEqual(newStats.stat_height, 99);
        done();
      });
    });

    // Update existing stats of a student
    it('updateStats missing field error', function(done) {
      // Assert that an error is thrown when last name is missing
      assert.throw(function() {
        stats.updateStats(req);
      },
      Error);

      var promise = stats.updateStats({});

      promise.then(function(data) {
        assert.equal(data.message,
        'Unable to update stats, missing statID');
        done();
      });
    });

    // Remove stat
    it('removes a stat of a student currently in the database', function(done) {
      var unChanged = stats.getStats({});
      var promise = stats.deleteStats({
        req: {
          stat_id: 2,
        }
      });

      promise.then(function(data) {
        var changed = stats.getStats({});
        assert.notDeepEqual(changed, unChanged);
        assert.length(changed.length(), unChanged.length()-1)
        done();
      });
    });

    // Update existing stats of a student error
    it('deleteStats missing field error', function(done) {
      // Assert that an error is thrown when last name is missing
      assert.throw(function() {
        stats.deleteStats(req);
      },
      Error);

      var promise = stats.deleteStats({});

      promise.then(function(data) {
        assert.equal(data.message,
        'Unable to delete stats, missing statID');
        done();
      });
    });
  });
});

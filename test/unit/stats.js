// TODO Add before each that reseeds the DB
// Set the env to development
process.env.NODE_ENV = 'development';

// Require the testing dependencies
var chai = require('chai');
var assert = chai.assert;

// The file to be tested
const stats = require('../../routes/stats');

// Create fake stats
var fakeStat = {
  stat_id: 1,
  student_id: 1,
  event_id: 1,
  height: 5,
  weight: 5,
  pacer: 5
};

var fakeStat2 = {
  stat_id: 2,
  student_id: 1,
  event_id: 2,
  height: 7,
  weight: 7,
  pacer: 7
};

var fakeStat3 = {
  stat_id: 3,
  student_id: 2,
  event_id: 6,
  height: 71,
  weight: 17,
  pacer: 57
};

var fakeStat4 = {
  stat_id: 4,
  student_id: 2,
  event_id: 4,
  height: 40,
  weight: 12,
  pacer: 500
};

var fakeStat5 = {
  stat_id: 5,
  student_id: 2,
  event_id: 2,
  height: 44,
  weight: 16,
  pacer: 500
};

var fakeStat6 = {
  stat_id: 6,
  student_id: 4,
  event_id: 2,
  height: 4,
  weight: 12,
  pacer: 421
};

var fakeStat7 = {
  stat_id: 7,
  student_id: 2,
  event_id: 2,
  height: 320,
  weight: 54,
  pacer: 382,
};

describe('stats', function() {
  describe('getStats(req)', function() {
    xit('should get all the stats in the database', function(done) {
      // GET all doesn't need anything from the request, so pass in empty
      var promise = stats.getStats({});

      // When the promised data is returned, check it against the expected data
      promise.then(function(data) {
        assert.deepEqual([fakeStat, fakeStat2, fakeStat3,
           fakeStat4, fakeStat5, fakeStat6], data);
        done();
      });
    });

    // Get all stats at one site
    xit('should get all stats for one site', function(done) {
      var req = {
        params: {
          site_id: 1
        }
      };

      var promise = stats.getStats(req);

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat, fakeStat4]);
        done();
      });
    });

    xit('should give an error if the site_id is negative',
    function(done) {
      var req = {
        params: {
          site_id: -4
        }
      };

      var promise = stats.getStats(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given site_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        // TODO Uncomment these if you're making comlex errors, Jonah.
        // assert.equal(err.name, 'InvalidArgumentError');
        // assert.equal(err.propertyName, 'site_id');
        // assert.equal(err.propertyValue, req.params.site_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    // TODO write test for error if site_id not an integer
    // TODO write test for site_id not in database: what should it do?

    // Get all stats of one student
    xit('should get all stats for one student', function(done) {
      var req = {
        params: {
          student_id: 1
        }
      };

      var promise = stats.getStats(req);

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat, fakeStat2]);
        done();
      });
    });

    xit('should give an error if the student_id is negative',
    function(done) {
      var req = {
        params: {
          site_id: -12
        }
      };

      var promise = stats.getStats(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given student_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        // assert.equal(err.name, 'InvalidArgumentError');
        // assert.equal(err.propertyName, 'student_id');
        // assert.equal(err.propertyValue, req.params.student_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    // TODO write test for error if student_id not an integer
    // TODO write test for student_id not in database: what should it do?
  });

  describe('getStat(req)', function() {
    xit('should get a specific stat', function(done) {
      var req = {
        params: {
          // The student_id is contained in the request
          stat_id: 4
        }
      };

      var promise = stats.getStat(req);

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat4]);
        assert.length(data, 1);
        done();
      });
    });

    xit('should give an error if the stat_id is negative',
    function(done) {
      var req = {
        params: {
          site_id: -5
        }
      };

      var promise = stats.getStats(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given stat_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        // assert.equal(err.name, 'InvalidArgumentError');
        // assert.equal(err.propertyName, 'stat_id');
        // assert.equal(err.propertyValue, req.params.stat_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    // TODO write test for error if stat_id not an integer
    // TODO write test for stat_id not in database: what should it do?
  });

  describe('createStat(req)', function() {
    // Post a new row of stats into stats database
    xit('should add new stats to the database', function(done) {
      var req = {
        body: {
          student_id: 2,
          event_id: 2,
          height: 320,
          weight: 54,
          pacer: 382,
        }
      };

      var promise = stats.getStats({});

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
           fakeStat4, fakeStat5, fakeStat6]);

        return stats.postStats(req);
      })
      .then(function() {
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount + 1);
        assert.deepEqual([fakeStat, fakeStat2, fakeStat3,
           fakeStat4, fakeStat5, fakeStat6, fakeStat7]);
        done();
      });
    });

    // TODO: MISSING TEST CASES BELOW
    // TODO Insert test for trying to post if stat already exists
    // (should do nothing. Make sure of that.)

    // TODO check error is thrown if POST request is missing a body

    // TODO check error is thrown if required field is missing in request

    // TODO check that POST doesn't happen if field is repeated
    //  (e.g. 2 student_id are provided)
  });

  describe('updateStat(req)', function() {

  });

  describe('deleteStat(req)', function() {

  });

  //
  //   // Post a new row of stats into stats database error
  //   it('postStats missing field error', function(done) {
  //     // Assert that an error is thrown when last name is missing
  //     assert.throw(function() {
  //       stats.postStats(req);
  //     },
  //     Error);
  //
  //     var promise = stats.postStats({});
  //
  //     promise.then(function(data) {
  //       assert.equal(data.message,
  //       'Unable to post stats, missing field(s)');
  //       done();
  //     });
  //   });
  //
  //   // Update existing stats of a student
  //   it('Updates a stat of a student currently in the database', function(done) {
  //     var unChanged = stats.getStats();
  //     var promise = stats.updateStats({
  //       req: {
  //         stat_id: 1,
  //         stat_weight: 999,
  //         stat_height: 99,
  //       }
  //     });
  //     promise.then(function(data) {
  //       var changed = stats.getStats();
  //       assert.notDeepEqual(unChanged, changed);
  //     })
  //     .then(function(data) {
  //       var newStats = getOneStatOfStudent({
  //         req: {
  //           stat_id: 1,
  //         }
  //       })
  //       return newStats;
  //     })
  //     .then(function(data) {
  //       assert.deepEqual(newStats.stat_weight, 999);
  //       assert.deepEqual(newStats.stat_height, 99);
  //       done();
  //     });
  //   });
  //
  //   // Update existing stats of a student
  //   it('updateStats missing field error', function(done) {
  //     // Assert that an error is thrown when last name is missing
  //     assert.throw(function() {
  //       stats.updateStats(req);
  //     },
  //     Error);
  //
  //     var promise = stats.updateStats({});
  //
  //     promise.then(function(data) {
  //       assert.equal(data.message,
  //       'Unable to update stats, missing statID');
  //       done();
  //     });
  //   });
  //
  //   // Remove stat
  //   it('removes a stat of a student currently in the database', function(done) {
  //     var unChanged = stats.getStats({});
  //     var promise = stats.deleteStats({
  //       req: {
  //         stat_id: 2,
  //       }
  //     });
  //
  //     promise.then(function(data) {
  //       var changed = stats.getStats({});
  //       assert.notDeepEqual(changed, unChanged);
  //       assert.length(changed.length(), unChanged.length() - 1);
  //       done();
  //     });
  //   });
  //
  //   // Update existing stats of a student error
  //   it('deleteStats missing field error', function(done) {
  //     // Assert that an error is thrown when last name is missing
  //     assert.throw(function() {
  //       stats.deleteStats(req);
  //     },
  //     Error);
  //
  //     var promise = stats.deleteStats({});
  //
  //     promise.then(function(data) {
  //       assert.equal(data.message,
  //       'Unable to delete stats, missing statID');
  //       done();
  //     });
  //   });
});

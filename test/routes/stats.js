// Require the testing dependencies
var chai = require('chai');
var assert = chai.assert;

// Require seed to reset database before each test
const seed = require('../../lib/utils').seed;

// The file to be tested
const stats = require('../../routes/stats');

// Create fake stats
var fakeStat = {
  measurement_id: 1,
  student_id: 1,
  event_id: 1,
  height: 5,
  weight: 5,
  pacer: 5
};

var fakeStat2 = {
  measurement_id: 2,
  student_id: 1,
  event_id: 2,
  height: 7,
  weight: 7,
  pacer: null
};

var fakeStat3 = {
  measurement_id: 3,
  student_id: 2,
  event_id: 6,
  height: 71,
  weight: 17,
  pacer: 57
};

var fakeStat4 = {
  measurement_id: 4,
  student_id: 2,
  event_id: 4,
  height: 40,
  weight: 12,
  pacer: 500
};

var fakeStat5 = {
  measurement_id: 5,
  student_id: 2,
  event_id: 2,
  height: 44,
  weight: 16,
  pacer: null
};

var fakeStat6 = {
  measurement_id: 6,
  student_id: 4,
  event_id: 2,
  height: 4,
  weight: 12,
  pacer: null
};

// This stat is added later
// TODO delete this comment
// var fakeStat7 = {
//   measurement_id: 7,
//   student_id: 2,
//   event_id: 2,
//   height: 320,
//   weight: 54,
//   pacer: 382,
// };

// Update Checking
var fakeStat8 = {
  measurement_id: 1,
  student_id: 1,
  event_id: 1,
  height: 6,
  weight: 6,
  pacer: 6
};

var pacerNewBatch = [{
  student_id: 1,
  event_id: 3,
  height: null,
  weight: null,
  pacer: 28
},
{
  student_id: 2,
  event_id: 3,
  height: null,
  weight: null,
  pacer: 35
},
{
  student_id: 4,
  event_id: 3,
  height: null,
  weight: null,
  pacer: 18
}];

var pacerUpdateBatch = [{
  student_id: 1,
  event_id: 3,
  height: 71,
  weight: 168,
  pacer: 28
},
{
  student_id: 2,
  event_id: 3,
  height: 68,
  weight: 140,
  pacer: 35
},
{
  student_id: 4,
  event_id: 3,
  height: 62,
  weight: 110,
  pacer: 18
}];

// Add before each to reset database between tests
beforeEach(function() {
  return seed();
});

describe('stats', function() {
  describe('getStats(req)', function() {
    it('should get all the stats in the database', function(done) {
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
    it('should get all stats at one site', function(done) {
      var req = {
        params: {
          site_id: 1
        }
      };

      var promise = stats.getStatsBySite(req);

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat, fakeStat4]);
        done();
      });
    });

    // test for site_id not in database
    it('should return empty array if the site_id is not in database',
    function(done) {
      var req = {
        params: {
          site_id: 44555555
        }
      };

      var promise = stats.getStatsBySite(req);
      promise.then(function(data) {
        assert.deepEqual(data, []);
        done();
      });
    });

    // Get all stats of one student
    it('should get all stats for one student', function(done) {
      var req = {
        params: {
          student_id: 1
        }
      };

      var promise = stats.getStatsByStudent(req);

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat, fakeStat2]);
        done();
      });
    });

    // test for student_id not in database
    it('should return empty array if the student_id is not in the database',
    function(done) {
      var req = {
        params: {
          student_id: 48394234
        }
      };

      var promise = stats.getStatsByStudent(req);
      promise.then(function(data) {
        assert.deepEqual(data, []);
        done();
      });
    });
  });

  describe('getStat(req)', function() {
    it('should get a specific stat', function(done) {
      var req = {
        params: {
          // The student_id is contained in the request
          stat_id: 4
        }
      };

      var promise = stats.getStat(req);

      promise.then(function(data) {
        assert.deepEqual(data, [fakeStat4]);
        done();
      });
    });

    it('should return empty array if the stat_id is not in the database',
    function(done) {
      var req = {
        params: {
          stat_id: 9999999
        }
      };

      var promise = stats.getStat(req);
      promise.then(function(data) {
        assert.deepEqual(data, []);
        done();
      });
    });
  });

  describe('uploadPacerStats(req)', function() {
    // Create a brand new set of stats w/ PACER data
    it('should create stats with PACER data for multiple students',
    function(done) {
      req = {
        params: {
          event_id: 3
        },
        body: {
          stats: [{
            student_id: 1,
            pacer: 28
          },
          {
            student_id: 2,
            pacer: 35
          },
          {
            student_id: 4,
            pacer: 18
          }]
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
           fakeStat4, fakeStat5, fakeStat6]);

        return stats.uploadPacerStats(req);
      })
      .then(function() {
        return stats.getStats({});
      })
      .then(function(data) {
        for (var i = statCount; i < data.length; i++) {
          delete data[i].measurement_id;
          assert.include(pacerNewBatch, data[i]);
        }
        assert.lengthOf(data, statCount + pacerNewBatch.length);
        done();
      });
    });

    it('should add PACER data to existing set of stats',
    function(done) {
      req = {
        params: {
          event_id: 2
        },
        body: {
          stats: [{
            student_id: 1,
            pacer: 28
          },
          {
            student_id: 2,
            pacer: 35
          },
          {
            student_id: 4,
            pacer: 18
          }]
        }
      };

      var promise = stats.getStats({});
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
           fakeStat4, fakeStat5, fakeStat6]);

        return stats.uploadPacerStats(req);
      })
      .then(function() {
        return stats.getStats({});
      })
      .then(function(data) {
        for (var i = statCount; i < data.length; i++) {
          delete data[i].measurement_id;
          assert.include(pacerUpdateBatch, data[i]);
        }
        assert.lengthOf(data, statCount);
        done();
      });
    });

    // Some mixture of create and updates (maybe some students did BMI before and some after PACER)

    // Fail if event_id is negative
    it('should give an error if event_id is negative', function(done) {
      req = {
        params: {
          event_id: -3
        },
        body: {
          stats: [{
            student_id: 1,
            pacer: 28
          },
          {
            student_id: 2,
            pacer: 35
          },
          {
            student_id: 4,
            pacer: 18
          }]
        }
      };

      stats.uploadPacerStats(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Given event_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'event_id');
        assert.equal(err.propertyValue, req.params.event_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if event_id is not an integer',
    function(done) {
      req = {
        params: {
          event_id: 2.3
        },
        body: {
          stats: [{
            student_id: 1,
            pacer: 28
          },
          {
            student_id: 2,
            pacer: 35
          },
          {
            student_id: 4,
            pacer: 18
          }]
        }
      };

      stats.uploadPacerStats(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Given event_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'event_id');
        assert.equal(err.propertyValue, req.params.event_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if event_id is not in the database',
    function(done) {
      req = {
        params: {
          event_id: 39328
        },
        body: {
          stats: [{
            student_id: 1,
            pacer: 28
          },
          {
            student_id: 2,
            pacer: 35
          },
          {
            student_id: 4,
            pacer: 18
          }]
        }
      };

      var promise = stats.uploadPacerStats(req);

      promise.catch(function(err) {
        assert.equal(err.message,
        'Invalid request: The given event_id does not exist in the' +
        ' database');

        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.propertyName, 'event_id');
        assert.equal(err.propertyValue, req.params.event_id);
        assert.equal(err.status, 404);
        done();
      });
    });

    it('should give an error if body is missing stats field',
    function(done) {
      req = {
        params: {
          event_id: 3
        },
        body: {}
      };

      var promise = stats.uploadPacerStats(req);

      promise.catch(function(err) {
        assert.equal(err.message,
          'Request must have a stats section in the body' +
          ' which contains a list of objects. Objects must have student_id ' +
          'and either height and weight fields, pacer field, or all three');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);
        done();
      });
    });

    // What to do if at least one student_id is not valid? Fail entire batch? Fail just that one?
    // Should it make note and continue to the next one?

    // ^^^ Same question if student_id is not in the db

    // Pacer data is invalid

    //
  });

  describe('uploadBMIStats(req)', function() {
  });
  // $$$ may not be needed anymore
  // describe('createStat(req)', function() {
  //   // Post a new row of stats into stats database
  //   it('should add new stats to the database', function(done) {
  //     var req = {
  //       params: {
  //         student_id: 2,
  //         event_id: 2,
  //       },
  //       body: {
  //         height: 320,
  //         weight: 54,
  //         pacer: 382,
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //          fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .then(function() {
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount + 1);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //          fakeStat4, fakeStat5, fakeStat6, fakeStat7]);
  //       done();
  //     });
  //   });
  //
  //   // Attempt to post existing stat
  //   it('adding an existing set of stat should do nothing', function(done) {
  //     var req = {
  //       params: {
  //         student_id: 1,
  //         event_id: 1,
  //       },
  //       body: {
  //         height: 5,
  //         weight: 5,
  //         pacer: 5
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //          fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Unable to add student because this set of stats already exists');
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  //
  //   // check error is thrown if required component 'param' is missing in request
  //   it('attempting to post stats with missing param will result in an error',
  //    function(done) {
  //     var req = {
  //       body: {
  //         height: 44,
  //         weight: 16,
  //         pacer: 500
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Could not post due to missing fields');
  //       assert.equal(err.status, 400);
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  //
  //   // check error is thrown if required component 'param' is missing in request
  //   it('attempting to post stats with missing body will result in an error',
  //   function(done) {
  //     var req = {
  //       params: {
  //         student_id: 2,
  //         event_id: 2,
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Could not post due to missing fields');
  //       assert.equal(err.status, 400);
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  //
  //   // check error is thrown if required field 'student_id' is missing in request
  //   it('attempting to post stats with missing params "student_id" will ' +
  //   'result in an error', function(done) {
  //     var req = {
  //       params: {
  //         event_id: 2,
  //       },
  //       body: {
  //         height: 44,
  //         weight: 16,
  //         pacer: 500
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Could not post due to missing fields');
  //       assert.equal(err.status, 400);
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  //
  //   // check error is thrown if required field 'event_id' is missing in request
  //   it('attempting to post stats with missing params "event_id" will ' +
  //   'result in an error', function(done) {
  //     var req = {
  //       params: {
  //         student_id: 2,
  //       },
  //       body: {
  //         height: 44,
  //         weight: 16,
  //         pacer: 500
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Could not post due to missing fields');
  //       assert.equal(err.status, 400);
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  //
  //   // check error is thrown if required field 'pacer' is missing in request
  //   it('attempting to post stats with missing field "pacer" will ' +
  //   'result in an error', function(done) {
  //     var req = {
  //       params: {
  //         student_id: 1,
  //         event_id: 1,
  //       },
  //       body: {
  //         height: 5,
  //         weight: 5,
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Could not post due to missing fields');
  //       assert.equal(err.status, 400);
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  //
  //   // check error is thrown if required field 'weight' is missing in request
  //   it('attempting to post stats with missing field "weight" will ' +
  //   'result in an error', function(done) {
  //     var req = {
  //       params: {
  //         student_id: 1,
  //         event_id: 1,
  //       },
  //       body: {
  //         height: 5,
  //         pacer: 5,
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Could not post due to missing fields');
  //       assert.equal(err.status, 400);
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  //
  //   // check error is thrown if required field 'height' is missing in request
  //   it('attempting to post stats with missing field "height" will ' +
  //   'result in an error', function(done) {
  //     var req = {
  //       params: {
  //         student_id: 1,
  //         event_id: 1,
  //       },
  //       body: {
  //         weight: 5,
  //         pacer: 5,
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Could not post due to missing fields');
  //       assert.equal(err.status, 400);
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  //
  //   // check error is thrown if required field 'event_id' is missing in request
  //   it('attempting to post stats with missing field event_id will ' +
  //   'result in an error', function(done) {
  //     var req = {
  //       params: {
  //         student_id: 1,
  //       },
  //       body: {
  //         pacer: 5,
  //         height: 5,
  //         weight: 5,
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Could not post due to missing fields');
  //       assert.equal(err.status, 400);
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  //
  //   it('attempting to post stats with missing field student_id will ' +
  //   'result in an error', function(done) {
  //     var req = {
  //       params: {
  //         event_id: 1,
  //       },
  //       body: {
  //         pacer: 5,
  //         height: 5,
  //         weight: 5,
  //       }
  //     };
  //
  //     var promise = stats.getStats({});
  //     var statCount;
  //
  //     promise.then(function(data) {
  //       statCount = data.length;
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //
  //       return stats.createStat(req);
  //     })
  //     .catch(function(err) {
  //       assert.equal(err.message,
  //       'Could not post due to missing fields');
  //       assert.equal(err.status, 400);
  //       return stats.getStats({});
  //     })
  //     .then(function(data) {
  //       assert.lengthOf(data, statCount);
  //       assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
  //         fakeStat4, fakeStat5, fakeStat6]);
  //       done();
  //     });
  //   });
  // });

  describe('updateStat(req)', function() {
    // update existing stats
    xit('should update stats in the database', function(done) {
      var req = {
        params: {
          stat_id: 1,
        },
        body: {
          height: 6,
          weight: 6,
          pacer: 6,
        }
      };

      var promise = stats.getStats({});
      var oldDB;
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        oldDB = data;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.updateStat(req);
      })
      .then(function() {
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.notDeepEqual(data, oldDB);
        assert.deepEqual(data, [fakeStat8, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // update non existing stats should error
    xit('should error updating non-existing stats', function(done) {
      var req = {
        params: {
          stat_id: 99999,
        },
        body: {
          height: 6,
          weight: 6,
          pacer: 6,
        }
      };

      var promise = stats.getStats({});
      var oldDB;
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        oldDB = data;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.updateStat(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Can not update non-existing stats.');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, oldDB);
        done();
      });
    });
  });

  describe('deleteStat(req)', function() {
    // delete existing stats
    xit('should delete stats in the database', function(done) {
      var req = {
        params: {
          stat_id: 1
        }
      };

      var promise = stats.getStats({});
      var oldDB;
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        oldDB = data;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.deleteStat(req);
      })
      .then(function() {
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount - 1);
        assert.notDeepEqual(data, oldDB);
        assert.deepEqual(data, [fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);
        done();
      });
    });

    // delete non existing stats should error
    xit('should error delete non-existing stats', function(done) {
      var req = {
        params: {
          stat_id: 99999,
        }
      };

      var promise = stats.getStats({});
      var oldDB;
      var statCount;

      promise.then(function(data) {
        statCount = data.length;
        oldDB = data;
        assert.deepEqual(data, [fakeStat, fakeStat2, fakeStat3,
          fakeStat4, fakeStat5, fakeStat6]);

        return stats.deleteStat(req);
      })
      .catch(function(err) {
        assert.equal(err.message,
        'Can not delete non-existing stats.');
        assert.equal(err.status, 400);
        return stats.getStats({});
      })
      .then(function(data) {
        assert.lengthOf(data, statCount);
        assert.deepEqual(data, oldDB);
        done();
      });
    });

    xit('should give an error if the stat_id is negative',
    function(done) {
      var req = {
        params: {
          stat_id: -4
        }
      };

      var promise = stats.deleteStat(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given stat_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'stat_id');
        assert.equal(err.propertyValue, req.params.stat_id);
        assert.equal(err.status, 400);
        done();
      });
    });
  });
});

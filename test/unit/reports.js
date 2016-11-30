// Require the testing dependencies
var chai = require('chai');
var assert = chai.assert;

// Require query function for getAllStudents check
const query = require('../../lib/utils').query;

// Require seed to reset database before each test
const seed = require('../../lib/utils').seed;

// The file to be tested
var reports = require('../../routes/reports');


// ADD BEFORE EACH TO reseed
beforeEach(function() {
  return seed();
});

// Reports testing block
describe('Reports', function() {
  describe('getReports(req)', function() {
    it('should successfully generate a CSV report of students and their stats', function(done) {
      var req = {
        params: {
          program_id: 1
        }
      };

      var promise = reports.getReports(req);

      promise.then(function(data) {
        assert.deepEqual();
        done();
      });
    });

    it('should return error if given program_id is not an int', function(done) {
      var req = {
        params: {
          program_id: 'hi'
        }
      };

      var promise = reports.getReports(req);

      promise.catch(function(err) {
        assert.equal(err.message, 'Given program_id is not a valid input');
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should return empty if given program_id is not in the database', function(done) {
      var req = {
        params: {
          program_id: 3921893
        }
      };

      var promise = reports.getReports();

      promise.then(function(data) {
        assert.deepEqual(data, []);
        done();
      });
    });

  });
});
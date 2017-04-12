// Require the testing dependencies
var chai = require('chai');
var assert = chai.assert;

// Require seed to reset database before each test
const seed = require('../../lib/seed').demoSeed;

// The file to be tested
var reports = require('../../routes/reports');


// Reports testing block
describe('Reports', function() {
  before(function(done) {
    seed().then(function() {
      done();
    });
  });

  describe('getReport(req)', function() {
    xit('should successfully generate a CSV report of all students and their stats', function(done) {
      done();
    });
  });

  describe('getReportByProgram(req)', function() {
    xit('should successfully generate a CSV report of students and their stats', function(done) {
      done();
    });

    xit('should return error if given program_id is not an int', function(done) {
      var req = {
        params: {
          program_id: 'hi'
        }
      };

      var promise = reports.getReportByProgram(req);

      promise.catch(function(err) {
        assert.equal(err.message, 'Given program_id is not a valid input');
        assert.equal(err.status, 400);
        done();
      });
    });

    xit('should return empty if given program_id is not in the database', function(done) {
      var req = {
        params: {
          program_id: 3921893
        }
      };

      var promise = reports.getReportByProgram(req);

      promise.then(function(data) {
        assert.deepEqual(data, []);
        done();
      });
    });
  });
});

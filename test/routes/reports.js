// Require the testing dependencies
var chai = require('chai');
var assert = chai.assert;

var csv = require('fast-csv');

// Require seed to reset database before each test
const seed = require('../../lib/seed').demoSeed;

// The file to be tested
var reports = require('../../routes/reports');

var TestRow = function(student_id, first_name, last_name, site_name, program_name,
  pre_date, pre_height, pre_weight, pre_pacer,
  post_date, post_height, post_weight, post_pacer) {
  this.student_id = student_id;
  this.first_name = first_name;
  this.last_name = last_name;
  this.site_name = site_name;
  this.program_name = program_name;
  this.pre_date = pre_date;
  this.pre_height = pre_height;
  this.pre_weight = pre_weight;
  this.pre_pacer = pre_pacer;
  this.post_date = post_date;
  this.post_height = post_height;
  this.post_weight = post_weight;
  this.post_pacer = post_pacer;
};

// Reports testing block
describe.only('Reports', function() {
  var results = [];
  before(function(done) {
    seed().then(function() {
      csv
        .fromPath('test/test_report.csv')
        .on('data', function(data) {
          results.push(new TestRow(data[0], data[1], data[2], data[3], data[4], data[5],
            data[6], data[7], data[8], data[9],
            data[10], data[11], data[12], data[13]));
        }).on('end', function() {
          done();
        });
    });
  });

  describe('getReport(req)', function() {
    xit('should return all of the pre/post season stats for the given season', function(done) {
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

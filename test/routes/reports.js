'use strict';

var chai = require('chai');
var assert = chai.assert;
var csv = require('fast-csv');

const reports = require('../../routes/reports');
const seed = require('../../lib/seed').demoSeed;
const c = require('../../lib/constants/utils');
const ReportRowFromCSV = require('../../lib/models/report_row').ReportRowFromCSV;
const assertEqualError = require('../../lib/test_utils').assertEqualError;

function assertEqualReportRows(rows, expected) {
  assert.lengthOf(rows, expected.length);
  rows.forEach(function(row, i) {
    assertEqualReportRow(row, expected[i]);
  });
}

function assertEqualReportRow(row, expected) {
  assert.equal(row.student_id, expected.student_id);
  assert.equal(row.first_name, expected.first_name);
  assert.equal(row.last_name, expected.last_name);
  assert.equal(row.site_name, expected.site_name);
  assert.equal(row.program_name, expected.program_name);
  if (row.pre_date === null) {
    assert.isNull(expected.pre_date);
  } else {
    assert.equal(row.pre_date.getFullYear(), expected.pre_date.getFullYear());
    assert.equal(row.pre_date.getMonth(), expected.pre_date.getMonth());
    assert.equal(row.pre_date.getDate(), expected.pre_date.getDate());
  }
  assert.equal(row.pre_height, expected.pre_height);
  assert.equal(row.pre_weight, expected.pre_weight);
  assert.equal(row.pre_pacer, expected.pre_pacer);
  if (row.post_date === null) {
    assert.isNull(expected.post_date);
  } else {
    assert.equal(row.post_date.getFullYear(), expected.post_date.getFullYear());
    assert.equal(row.post_date.getMonth(), expected.post_date.getMonth());
    assert.equal(row.post_date.getDate(), expected.post_date.getDate());
  }
  assert.equal(row.post_height, expected.post_height);
  assert.equal(row.post_weight, expected.post_weight);
  assert.equal(row.post_pacer, expected.post_pacer);
}

describe('Reports', function() {
  var results = [];
  before(function(done) {
    seed().then(function() {
      csv
        .fromPath('test/test_report.csv', {headers: true})
        .on('data', function(data) {
          results.push(new ReportRowFromCSV(
            data.student_id,
            data.first_name,
            data.last_name,
            data.site_name,
            data.program_name,
            data.pre_date,
            data.pre_height,
            data.pre_weight,
            data.pre_pacer,
            data.post_date,
            data.post_height,
            data.post_weight,
            data.post_pacer
          ));
        }).on('end', function() {
          done();
        });
    });
  });

  describe('getReport(req)', function() {
    it('it should return all of the pre/post season stats for the given season', function(done) {
      reports.getReport({
        query: {
          season: c.SPRING,
          year: 2017
        }
      }).then(function(rows) {
        assertEqualReportRows(rows, results);
        done();
      });
    });

    it('it should 404 when the requested season is not found in the database', function(done) {
      reports.getReport({
        query: {
          season: c.FALL,
          year: 2015
        }
      }).catch(function(err) {
        assertEqualError(err, 'Season Not Found', 404,
          'The requested season (' + c.FALL + ' 2015) does not exist in the database');
        done();
      });
    });

    it('it should 400 when the required query components are not included in the request', function(done) {
      reports.getReport({
        query: {
          season: c.SPRING
        }
      }).catch(function(err) {
        assertEqualError(err, 'Missing Field', 400,
          'Request must have the following component(s): ' +
          'year (query)');
        done();
      });
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

'use strict';

const utils = require('../lib/utils');
// const query = utils.query;

// Get all stats for a season
function getReport(req) {
}


const GEN_CSV_REQS = [
  new utils.Requirement('params', 'season_id'),
];

function generateSeasonCSV(req) {
  // Check that request has all necessary fields
  var missingReqs = utils.findMissingRequirements(req, GEN_CSV_REQS);
  if (missingReqs.length !== 0) {
    return errors.createMissingFieldError(missingReqs);
  }
}

function getReportByProgram(req) {
}

module.exports = {
  getReport,
  generateSeasonCSV,
  getReportByProgram,
};

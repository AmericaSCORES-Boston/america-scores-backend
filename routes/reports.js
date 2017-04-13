'use strict';

const utils = require('../lib/utils');
const errors = require('../lib/errors');
const q = require('../lib/constants/queries');

const Requirement = utils.Requirement;
const query = utils.query;

const GET_REPORT_REQS = [
  new Requirement('query', 'season'),
  new Requirement('query', 'year'),
];

// Get all stats for a season
function getReport(req) {
  var missingReqs = utils.findMissingRequirements(req, GET_REPORT_REQS);
  if (missingReqs.length !== 0) {
    return errors.createMissingFieldError(missingReqs);
  }

  var season = req.query.season;
  var year = req.query.year;
  var inserts = [season, year];

  return query(q.SELECT_SEASON_BY_SEASON_YEAR, inserts).then(function(seasons) {
    if (seasons.length < 1) {
      return errors.create404({
        name: 'Season Not Found',
        message: 'The requested season (' + season + ' ' + String(year) + ') does not exist in the database'
      });
    }
    var seasonId = seasons[0].season_id;
    return query(q.SELECT_SEASON_REPORT, [seasonId, seasonId, seasonId, seasonId]);
  });
}

function generateSeasonCSV(req) {
}

function getReportByProgram(req) {
}

module.exports = {
  getReport,
  generateSeasonCSV,
  getReportByProgram,
};

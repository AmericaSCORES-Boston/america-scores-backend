'use strict';

const format = require('string-format');
format.extend(String.prototype);

const SITE = 'Site';
const STUDENT = 'Student';
const PROGRAM = 'Program';
const STUDENT_TO_PROGRAM = 'StudentToProgram';
const ACCT = 'Acct';
const ACCT_TO_PROGRAM = 'AcctToProgram';
const EVENT = 'Event';
const MEASUREMENT = 'Measurement';
const SEASON = 'Season';

// INSERTS
function insertStatement(table, columns) {
  var cols = columns.join(', ');
  var vals = '?'.repeat(columns.length).split('').join(', ');

  return 'INSERT INTO {0} ({1}) VALUES ({2})'.format(table, cols, vals);
}

const INSERT_SITE = insertStatement(SITE, ['site_name', 'site_address']);
const INSERT_STUDENT = insertStatement(STUDENT, ['first_name', 'last_name', 'dob']);
const INSERT_PROGRAM = insertStatement(PROGRAM, ['site_id', 'program_name']);
const INSERT_STUDENT_TO_PROGRAM = insertStatement(STUDENT_TO_PROGRAM, ['student_id', 'program_id']);
const INSERT_ACCT = insertStatement(ACCT, ['first_name', 'last_name', 'email', 'acct_type', 'auth0_id']);
const INSERT_ACCT_TO_PROGRAM = insertStatement(ACCT_TO_PROGRAM, ['acct_id', 'program_id']);
const INSERT_EVENT = insertStatement(EVENT, ['program_id', 'season_id', 'event_date', 'pre_season']);
const INSERT_MEASUREMENT = insertStatement(MEASUREMENT, ['student_id', 'event_id', 'height', 'weight', 'pacer']);
const INSERT_SEASON = insertStatement(SEASON, ['season', 'year']);

// SELECT
const SELECT = 'SELECT * FROM {0}';
const SELECT_WHERE = 'SELECT * FROM {0} WHERE {1}';

// DELETE
const DELETE = 'DELETE FROM {0} WHERE {1}';

// SEASONS
const SELECT_SEASON = SELECT.format(SEASON);
const SELECT_SEASON_BY_ID = SELECT_WHERE.format(SEASON, 'season_id = ?');
const SELECT_SEASON_BY_SEASON_YEAR = SELECT_WHERE.format(SEASON, 'season = ? AND year = ?');

const DELETE_SEASON_BY_ID = DELETE.format(SEASON, 'season_id = ?');

module.exports = {
  INSERT_SITE,
  INSERT_STUDENT,
  INSERT_PROGRAM,
  INSERT_STUDENT_TO_PROGRAM,
  INSERT_ACCT,
  INSERT_ACCT_TO_PROGRAM,
  INSERT_EVENT,
  INSERT_MEASUREMENT,
  INSERT_SEASON,

  SELECT_SEASON,
  SELECT_SEASON_BY_ID,
  SELECT_SEASON_BY_SEASON_YEAR,
  DELETE_SEASON_BY_ID,
};

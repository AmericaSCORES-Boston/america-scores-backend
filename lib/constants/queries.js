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
// TODO: Refactor to consistently call this 'Stat' not 'Measurment'
const STAT = 'Measurement';
const SEASON = 'Season';

// FOREIGN_KEYS
const FOREIGN_KEY_OFF = 'SET FOREIGN_KEY_CHECKS = 0';
const FOREIGN_KEY_ON = 'SET FOREIGN_KEY_CHECKS = 1';

// TRUNCATE
const TRUNCATE = 'TRUNCATE {0}';
const TRUNCATE_SITE = TRUNCATE.format(SITE);
const TRUNCATE_STUDENT = TRUNCATE.format(STUDENT);
const TRUNCATE_PROGRAM = TRUNCATE.format(PROGRAM);
const TRUNCATE_STUDENT_TO_PROGRAM = TRUNCATE.format(STUDENT_TO_PROGRAM);
const TRUNCATE_ACCT = TRUNCATE.format(ACCT);
const TRUNCATE_ACCT_TO_PROGRAM = TRUNCATE.format(ACCT_TO_PROGRAM);
const TRUNCATE_EVENT = TRUNCATE.format(EVENT);
const TRUNCATE_STAT = TRUNCATE.format(STAT);
const TRUNCATE_SEASON = TRUNCATE.format(SEASON);


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
const INSERT_STAT = insertStatement(STAT, ['student_id', 'event_id', 'height', 'weight', 'pacer']);
const INSERT_SEASON = insertStatement(SEASON, ['season', 'year']);

// SELECT
const SELECT = 'SELECT * FROM {0}';
const SELECT_WHERE = 'SELECT * FROM {0} WHERE {1}';

// DELETE
const DELETE = 'DELETE FROM {0} WHERE {1}';

// STUDENT
const SELECT_STUDENT = SELECT.format(STUDENT);

// SITE
const SELECT_SITE = SELECT.format(SITE);

// PROGRAM
const SELECT_PROGRAM = SELECT.format(PROGRAM);

// STUDENT_TO_PROGRAM
const SELECT_STUDENT_TO_PROGRAM = SELECT.format(STUDENT_TO_PROGRAM);

// ACCT
const SELECT_ACCT = SELECT.format(ACCT);

// ACCT_TO_PROGRAM
const SELECT_ACCT_TO_PROGRAM = SELECT.format(ACCT_TO_PROGRAM);

// EVENT
const SELECT_EVENT = SELECT.format(EVENT);

// MEASUREMENT
const SELECT_STAT = SELECT.format(STAT);

// SEASON
const SELECT_SEASON = SELECT.format(SEASON);
const SELECT_SEASON_BY_ID = SELECT_WHERE.format(SEASON, 'season_id = ?');
const SELECT_SEASON_BY_SEASON_YEAR = SELECT_WHERE.format(SEASON, 'season = ? AND year = ?');

const DELETE_SEASON_BY_ID = DELETE.format(SEASON, 'season_id = ?');

// CSV
const PRE = 'pre';
const POST = 'post';

const SEASON_RESULTS_SUBQUERY = '(SELECT s.student_id {0}_1, s.first_name {0}_2, s.last_name {0}_3, s.dob {0}_4, st.site_name {0}_5, p.program_name {0}_6, ' +
  'e.event_date {0}_date, m.height {0}_height, m.weight {0}_weight, m.pacer {0}_pacer ' +
  'FROM ' + STUDENT + ' s NATURAL JOIN ' + STUDENT_TO_PROGRAM + ' stp NATURAL JOIN ' + PROGRAM + ' p NATURAL JOIN ' + SITE + ' st NATURAL JOIN ' + EVENT + ' e NATURAL JOIN ' + STAT + ' m ' +
  'WHERE e.season_id = ? AND {1}e.pre_season)';


const PRE_SEASON_SUBQUERY = SEASON_RESULTS_SUBQUERY.format(PRE, '');
const POST_SEASON_SUBQUERY = SEASON_RESULTS_SUBQUERY.format(POST, '!');



const SELECT_SEASON_REPORT = ('SELECT ' +
  'COALESCE(season.' + PRE + '_1, season.' + POST + '_1) student_id, ' +
  'COALESCE(season.' + PRE + '_2, season.' + POST + '_2) first_name, ' +
  'COALESCE(season.' + PRE + '_3, season.' + POST + '_3) last_name, ' +
  'COALESCE(season.' + PRE + '_4, season.' + POST + '_4) dob, ' +
  'COALESCE(season.' + PRE + '_5, season.' + POST + '_5) site_name, ' +
  'COALESCE(season.' + PRE + '_6, season.' + POST + '_6) program_name, ' +
  'pre_date, pre_height, pre_weight, pre_pacer, ' +
  'post_date, post_height, post_weight, post_pacer ' +
  'FROM ' +
  '(SELECT * FROM {0} t1 LEFT JOIN {1} t2 ON t1.' + PRE + '_1 = t2.' + POST + '_1 ' +
  'UNION ' +
  'SELECT * FROM {0} t1 RIGHT JOIN {1} t2 ON t1.' + PRE + '_1 = t2.' + POST + '_1) ' +
  'season ' +
  'ORDER BY student_id').format(PRE_SEASON_SUBQUERY, POST_SEASON_SUBQUERY);

module.exports = {
  FOREIGN_KEY_OFF,
  FOREIGN_KEY_ON,

  TRUNCATE_SITE,
  TRUNCATE_STUDENT,
  TRUNCATE_PROGRAM,
  TRUNCATE_STUDENT_TO_PROGRAM,
  TRUNCATE_ACCT,
  TRUNCATE_ACCT_TO_PROGRAM,
  TRUNCATE_EVENT,
  TRUNCATE_STAT,
  TRUNCATE_SEASON,

  INSERT_SITE,
  INSERT_STUDENT,
  INSERT_PROGRAM,
  INSERT_STUDENT_TO_PROGRAM,
  INSERT_ACCT,
  INSERT_ACCT_TO_PROGRAM,
  INSERT_EVENT,
  INSERT_STAT,
  INSERT_SEASON,

  SELECT_SITE,
  SELECT_STUDENT,
  SELECT_PROGRAM,
  SELECT_STUDENT_TO_PROGRAM,
  SELECT_ACCT,
  SELECT_ACCT_TO_PROGRAM,
  SELECT_EVENT,
  SELECT_STAT,
  SELECT_SEASON,
  SELECT_SEASON_BY_ID,
  SELECT_SEASON_BY_SEASON_YEAR,
  DELETE_SEASON_BY_ID,

  SELECT_SEASON_REPORT,
};

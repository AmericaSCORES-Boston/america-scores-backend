'use strict';

const Promise = require('bluebird');
const getSqlConnection = require('../config/connection').getSqlConnection;
const format = require('mysql').format;

const c = require('./constants/utils');
const s = require('./constants/seed');
const q = require('./constants/queries');
const auth0 = require('./auth0_utils');
const getSqlDateString = require('./utils').getSqlDateString;

const PREP_DB_QUERIES = [
  q.FOREIGN_KEY_OFF,
  q.TRUNCATE_STUDENT,
  q.TRUNCATE_SITE,
  q.TRUNCATE_PROGRAM,
  q.TRUNCATE_STUDENT_TO_PROGRAM,
  q.TRUNCATE_ACCT,
  q.TRUNCATE_ACCT_TO_PROGRAM,
  q.TRUNCATE_SEASON,
  q.TRUNCATE_EVENT,
  q.TRUNCATE_STAT,
  q.FOREIGN_KEY_ON,
];

function createInsertQueries(students, sites, programs, studentToPrograms, accts, acctToPrograms, seasons, events, stats) {
  return PREP_DB_QUERIES.concat(students.map(function(student) {
    return insertStudentQuery(student);
  })).concat(sites.map(function(site) {
    return insertSiteQuery(site);
  })).concat(programs.map(function(program) {
    return insertProgramQuery(program);
  })).concat(studentToPrograms.map(function(s2p) {
    return insertStudentToProgramQuery(s2p);
  })).concat(accts.map(function(acct) {
    return insertAcctQuery(acct);
  })).concat(acctToPrograms.map(function(a2p) {
    return insertAcctToProgramQuery(a2p);
  })).concat(seasons.map(function(season) {
    return insertSeasonQuery(season);
  })).concat(events.map(function(event) {
    return insertEventQuery(event);
  })).concat(stats.map(function(stat) {
    return insertStatQuery(stat);
  }));
}

const TEST_DB_QUERIES = createInsertQueries(
  s.TEST_STUDENTS,
  s.TEST_SITES,
  s.TEST_PROGRAMS,
  s.TEST_STUDENT_TO_PROGRAMS,
  s.TEST_ACCTS,
  s.TEST_ACCT_TO_PROGRAMS,
  s.TEST_SEASONS,
  s.TEST_EVENTS,
  s.TEST_STATS
);

const DEMO_DB_QUERIES = createInsertQueries(
  s.DEMO_STUDENTS,
  s.DEMO_SITES,
  s.DEMO_PROGRAMS,
  s.DEMO_STUDENT_TO_PROGRAMS,
  s.DEMO_ACCTS,
  s.DEMO_ACCT_TO_PROGRAMS,
  s.DEMO_SEASONS,
  s.DEMO_EVENTS,
  s.DEMO_STATS
);

function insertSiteQuery(site) {
  var inserts = [site.site_name, site.site_address];
  return format(q.INSERT_SITE, inserts);
}

function insertStudentQuery(student) {
  var inserts = [student.first_name, student.last_name, student.dob];
  return format(q.INSERT_STUDENT, inserts);
}

function insertProgramQuery(program) {
  var inserts = [program.site_id, program.program_name];
  return format(q.INSERT_PROGRAM, inserts);
}

function insertStudentToProgramQuery(studentToProgram) {
  var inserts = [studentToProgram.student_id, studentToProgram.program_id];
  return format(q.INSERT_STUDENT_TO_PROGRAM, inserts);
}

function insertAcctQuery(acct) {
  var inserts = [acct.first_name, acct.last_name, acct.email, acct.acct_type, acct.auth0_id];
  return format(q.INSERT_ACCT, inserts);
}

function insertAcctToProgramQuery(acctToProgram) {
  var inserts = [acctToProgram.acct_id, acctToProgram.program_id];
  return format(q.INSERT_ACCT_TO_PROGRAM, inserts);
}

function insertEventQuery(event) {
  var inserts = [event.program_id, event.season_id, getSqlDateString(event.event_date), event.pre_season];
  return format(q.INSERT_EVENT, inserts);
}

function insertStatQuery(stat) {
  var inserts = [stat.student_id, stat.event_id, stat.height, stat.weight, stat.pacer];
  return format(q.INSERT_STAT, inserts);
}

function insertSeasonQuery(season) {
  var inserts = [season.season, season.year];
  return format(q.INSERT_SEASON, inserts);
}

function dbSeed(type, queries) {
  var type = type === undefined ? c.TEST : type;
  var queries = queries === undefined ? (type === c.DEMO ? DEMO_DB_QUERIES : TEST_DB_QUERIES) : queries;

  console.log('    Seeding database with ' + type + ' data');

  return Promise.using(getSqlConnection(), (connection) => {
    return Promise.map(queries, (query) => {
      // TODO: implement logging and log this
      // console.log('    ' + query);
      return connection.queryAsync(query);
    })
    .then(function() {
      connection.destroy();
    });
  });
}

function auth0Seed(type, accts) {
  var type = type === undefined ? c.TEST : type;
  var accts = accts === undefined ? (type === c.DEMO ? s.DEMO_ACCTS : s.TEST_ACCTS) : accts;

  console.log('  Seeding Auth0 ' + type + ' accounts');
  return Promise.each(accts, function(acct) {
    return auth0.getAuth0User(acct.auth0_id).then(function(auth0Acct) {
      var updates = {
        first_name: acct.first_name,
        last_name: acct.last_name,
        acct_type: acct.acct_type
      };

      if (auth0Acct.email !== acct.email) {
        updates['email'] = acct.email;
      }

      console.log('    Seeding ' + acct.first_name + ' ' + acct.last_name +
          ' (' + acct.email + ') - ' + acct.acct_type);
      return auth0.updateAuth0UserFromParams(acct.auth0_id, updates);
    });
  });
}


function seed(type, dbQueries, accts) {
  return dbSeed(type, dbQueries).then(function() {
    return auth0Seed(type, accts);
  });
}

function testSeed() {
  return seed(c.TEST, TEST_DB_QUERIES, s.TEST_ACCTS);
}

function demoSeed() {
  return seed(c.DEMO, DEMO_DB_QUERIES, s.DEMO_ACCTS);
}

module.exports = {
  demoSeed,
  testSeed,
  auth0Seed,
  dbSeed,
};

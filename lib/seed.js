'use strict';

const Promise = require('bluebird');
const getSqlConnection = require('../config/connection').getSqlConnection;
const format = require('mysql').format;

const s = require('./constants/seed');
const q = require('./constants/queries');
const auth0 = require('./auth0_utils');
const getSqlDateString = require('./utils').getSqlDateString;

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

function insertMeasurementQuery(measurement) {
  var inserts = [measurement.student_id, measurement.event_id, measurement.height, measurement.weight, measurement.pacer];
  return format(q.INSERT_MEASUREMENT, inserts);
}

function insertSeasonQuery(season) {
  var inserts = [season.season, season.year];
  return format(q.INSERT_SEASON, inserts);
}

function auth0Seed() {
  console.log('  Seeding Auth0 accounts');
  return Promise.each(s.ACCTS, function(acct) {
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

function dbSeed() {
  console.log('  Seeding database');
  return Promise.using(getSqlConnection(), (connection) => {
    const querys = [
      'SET FOREIGN_KEY_CHECKS = 0',
      'TRUNCATE Acct',
      'TRUNCATE AcctToProgram',
      'TRUNCATE Event',
      'TRUNCATE Measurement',
      'TRUNCATE Program',
      'TRUNCATE Season',
      'TRUNCATE Site',
      'TRUNCATE Student',
      'TRUNCATE StudentToProgram',
      'SET FOREIGN_KEY_CHECKS = 1',

      insertSiteQuery(s.SITE_1),
      insertSiteQuery(s.SITE_2),
      insertSiteQuery(s.SITE_3),
      insertSiteQuery(s.SITE_4),
      insertSiteQuery(s.SITE_5),
      insertSiteQuery(s.SITE_6),
      insertSiteQuery(s.SITE_7),
      insertSiteQuery(s.SITE_8),
      insertSiteQuery(s.SITE_9),
      insertSiteQuery(s.SITE_10),
      insertSiteQuery(s.SITE_11),

      insertStudentQuery(s.STUDENT_1),
      insertStudentQuery(s.STUDENT_2),
      insertStudentQuery(s.STUDENT_3),
      insertStudentQuery(s.STUDENT_4),

      insertProgramQuery(s.PROGRAM_1),
      insertProgramQuery(s.PROGRAM_2),
      insertProgramQuery(s.PROGRAM_3),
      insertProgramQuery(s.PROGRAM_4),

      // Percy, Annabeth, and Pam are in program 1
      // Brian is in program 2
      insertStudentToProgramQuery(s.STUDENT_TO_PROGRAM_1),
      insertStudentToProgramQuery(s.STUDENT_TO_PROGRAM_2),
      insertStudentToProgramQuery(s.STUDENT_TO_PROGRAM_3),
      insertStudentToProgramQuery(s.STUDENT_TO_PROGRAM_4),

      insertAcctQuery(s.ACCT_1),
      insertAcctQuery(s.ACCT_2),
      insertAcctQuery(s.ACCT_3),
      insertAcctQuery(s.ACCT_4),
      insertAcctQuery(s.ACCT_5),
      insertAcctQuery(s.ACCT_6),
      insertAcctQuery(s.ACCT_7),
      insertAcctQuery(s.ACCT_8),
      insertAcctQuery(s.ACCT_9),

      insertAcctToProgramQuery(s.ACCT_TO_PROGRAM_1),
      insertAcctToProgramQuery(s.ACCT_TO_PROGRAM_2),
      insertAcctToProgramQuery(s.ACCT_TO_PROGRAM_3),
      insertAcctToProgramQuery(s.ACCT_TO_PROGRAM_4),
      insertAcctToProgramQuery(s.ACCT_TO_PROGRAM_5),
      insertAcctToProgramQuery(s.ACCT_TO_PROGRAM_6),
      insertAcctToProgramQuery(s.ACCT_TO_PROGRAM_7),

      insertSeasonQuery(s.SEASON_1),
      insertSeasonQuery(s.SEASON_2),
      insertSeasonQuery(s.SEASON_3),

      insertEventQuery(s.EVENT_1),
      insertEventQuery(s.EVENT_2),
      insertEventQuery(s.EVENT_3),
      insertEventQuery(s.EVENT_4),
      insertEventQuery(s.EVENT_5),
      insertEventQuery(s.EVENT_6),

      insertMeasurementQuery(s.MEASUREMENT_1),
      insertMeasurementQuery(s.MEASUREMENT_2),
      insertMeasurementQuery(s.MEASUREMENT_3),
      insertMeasurementQuery(s.MEASUREMENT_4),
      insertMeasurementQuery(s.MEASUREMENT_5),
      insertMeasurementQuery(s.MEASUREMENT_6),
    ];

    return Promise.map(querys, (query) => {
      // TODO: implement logging and log this
      // console.log('    ' + query);
      return connection.queryAsync(query);
    })
    .then(function() {
      connection.destroy();
    });
  });
}

function seed() {
  return dbSeed().then(function() {
    return auth0Seed();
  });
}

function dbDemoSeed() {
  return dbSeed().then(() => {
    return Promise.using(getSqlConnection(), (connection) => {
      const querys = [
        insertStudentQuery(s.DEMO_STUDENT_1),
        insertStudentQuery(s.DEMO_STUDENT_2),

        insertStudentToProgramQuery(s.DEMO_STUDENT_TO_PROGRAM_1),
        insertStudentToProgramQuery(s.DEMO_STUDENT_TO_PROGRAM_2),
        insertStudentToProgramQuery(s.DEMO_STUDENT_TO_PROGRAM_3),
      ];

      return Promise.map(querys, (query) => {
        return connection.queryAsync(query);
      })
      .then(function() {
        connection.destroy();
      });
    });
  });
}

function dbReportSeed() {
  return dbSeed().then(() => {
    return Promise.using(getSqlConnection(), (connection) => {
      const querys = [
        insertEventQuery(s.REPORT_EVENT_1),

        insertMeasurementQuery(s.REPORT_MEASUREMENT_1),
        insertMeasurementQuery(s.REPORT_MEASUREMENT_2),
        insertMeasurementQuery(s.REPORT_MEASUREMENT_3),
      ];

      return Promise.map(querys, (query) => {
        return connection.queryAsync(query);
      })
      .then(function() {
        connection.destroy();
      });
    });
  });
}

module.exports = {
  dbSeed,
  dbDemoSeed,
  dbReportSeed,
  auth0Seed,
  seed,
};

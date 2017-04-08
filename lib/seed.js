'use strict';

const Promise = require('bluebird');
const getSqlConnection = require('../config/connection').getSqlConnection;
const format = require('string-format');
format.extend(String.prototype);

const SC = require('./constants/seed');
const QC = require('./constants/queries');
const auth0 = require('./auth0_utils');

function insertSiteQuery(site) {
  return QC.INSERT_SITE.format(site.site_name, site.site_address);
}

function insertStudentQuery(student) {
  return QC.INSERT_STUDENT.format(student.first_name, student.last_name, student.dob);
}

function insertProgramQuery(program) {
  return QC.INSERT_PROGRAM.format(program.site_id, program.program_name);
}

function insertStudentToProgramQuery(studentToProgram) {
  return QC.INSERT_STUDENT_TO_PROGRAM.format(studentToProgram.student_id, studentToProgram.program_id);
}

function insertAcctQuery(acct) {
  return QC.INSERT_ACCT.format(acct.first_name, acct.last_name, acct.email, acct.acct_type, acct.auth0_id);
}

function insertAcctToProgramQuery(acctToProgram) {
  return QC.INSERT_ACCT_TO_PROGRAM.format(acctToProgram.acct_id, acctToProgram.program_id);
}

function insertEventQuery(event) {
  return QC.INSERT_EVENT.format(event.program_id, event.event_date);
}

function insertMeasurementQuery(measurement) {
  return QC.INSERT_MEASUREMENT.format(measurement.student_id, measurement.event_id, measurement.height, measurement.weight, measurement.pacer);
}

function auth0Seed() {
  console.log('  Seeding Auth0 accounts');
  return Promise.each(SC.ACCTS, function(acct) {
    return auth0.getAuth0Id(acct.acct_id).then(function(auth0Id) {
      return auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
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
        return auth0.updateAuth0UserFromParams(auth0Id, updates);
      });
    });
  });
}

function dbSeed() {
  return Promise.using(getSqlConnection(), (connection) => {
    const querys = [
      'SET FOREIGN_KEY_CHECKS = 0',
      'TRUNCATE Acct',
      'TRUNCATE AcctToProgram',
      'TRUNCATE Event',
      'TRUNCATE Measurement',
      'TRUNCATE Program',
      'TRUNCATE Site',
      'TRUNCATE Student',
      'TRUNCATE StudentToProgram',
      'SET FOREIGN_KEY_CHECKS = 1',

      insertSiteQuery(SC.SITE_1),
      insertSiteQuery(SC.SITE_2),
      insertSiteQuery(SC.SITE_3),
      insertSiteQuery(SC.SITE_4),
      insertSiteQuery(SC.SITE_5),
      insertSiteQuery(SC.SITE_6),
      insertSiteQuery(SC.SITE_7),
      insertSiteQuery(SC.SITE_8),
      insertSiteQuery(SC.SITE_9),
      insertSiteQuery(SC.SITE_10),
      insertSiteQuery(SC.SITE_11),

      insertStudentQuery(SC.STUDENT_1),
      insertStudentQuery(SC.STUDENT_2),
      insertStudentQuery(SC.STUDENT_3),
      insertStudentQuery(SC.STUDENT_4),

      insertProgramQuery(SC.PROGRAM_1),
      insertProgramQuery(SC.PROGRAM_2),
      insertProgramQuery(SC.PROGRAM_3),
      insertProgramQuery(SC.PROGRAM_4),

      // Percy, Annabeth, and Pam are in program 1
      // Brian is in program 2
      insertStudentToProgramQuery(SC.STUDENT_TO_PROGRAM_1),
      insertStudentToProgramQuery(SC.STUDENT_TO_PROGRAM_2),
      insertStudentToProgramQuery(SC.STUDENT_TO_PROGRAM_3),
      insertStudentToProgramQuery(SC.STUDENT_TO_PROGRAM_4),

      insertAcctQuery(SC.ACCT_1),
      insertAcctQuery(SC.ACCT_2),
      insertAcctQuery(SC.ACCT_3),
      insertAcctQuery(SC.ACCT_4),
      insertAcctQuery(SC.ACCT_5),
      insertAcctQuery(SC.ACCT_6),
      insertAcctQuery(SC.ACCT_7),
      insertAcctQuery(SC.ACCT_8),
      insertAcctQuery(SC.ACCT_9),

      insertAcctToProgramQuery(SC.ACCT_TO_PROGRAM_1),
      insertAcctToProgramQuery(SC.ACCT_TO_PROGRAM_2),
      insertAcctToProgramQuery(SC.ACCT_TO_PROGRAM_3),
      insertAcctToProgramQuery(SC.ACCT_TO_PROGRAM_4),
      insertAcctToProgramQuery(SC.ACCT_TO_PROGRAM_5),
      insertAcctToProgramQuery(SC.ACCT_TO_PROGRAM_6),
      insertAcctToProgramQuery(SC.ACCT_TO_PROGRAM_7),

      insertEventQuery(SC.EVENT_1),
      insertEventQuery(SC.EVENT_2),
      insertEventQuery(SC.EVENT_3),
      insertEventQuery(SC.EVENT_4),
      insertEventQuery(SC.EVENT_5),
      insertEventQuery(SC.EVENT_6),

      insertMeasurementQuery(SC.MEASUREMENT_1),
      insertMeasurementQuery(SC.MEASUREMENT_2),
      insertMeasurementQuery(SC.MEASUREMENT_3),
      insertMeasurementQuery(SC.MEASUREMENT_4),
      insertMeasurementQuery(SC.MEASUREMENT_5),
      insertMeasurementQuery(SC.MEASUREMENT_6),
    ];

    return Promise.map(querys, (query) => {
      return connection.queryAsync(query);
    })
    .then(function() {
      connection.destroy();
    });
  });
}

function dbDemoSeed() {
  return dbSeed().then(() => {
    return Promise.using(getSqlConnection(), (connection) => {
      const querys = [
        insertStudentQuery(SC.DEMO_STUDENT_1),
        insertStudentQuery(SC.DEMO_STUDENT_2),

        insertStudentToProgramQuery(SC.DEMO_STUDENT_TO_PROGRAM_1),
        insertStudentToProgramQuery(SC.DEMO_STUDENT_TO_PROGRAM_2),
        insertStudentToProgramQuery(SC.DEMO_STUDENT_TO_PROGRAM_3),
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
        insertEventQuery(SC.REPORT_EVENT_1),

        insertMeasurementQuery(SC.REPORT_MEASUREMENT_1),
        insertMeasurementQuery(SC.REPORT_MEASUREMENT_2),
        insertMeasurementQuery(SC.REPORT_MEASUREMENT_3),
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
  dbSeed, dbDemoSeed, dbReportSeed,
  auth0Seed,
};

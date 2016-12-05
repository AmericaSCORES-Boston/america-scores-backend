'use strict';

const Promise = require('bluebird');
const getSqlConnection = require('../config/connection').getSqlConnection;

function makeResponse(res, promise) {
  return promise.then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    var statusCode = err.status;

    if (statusCode >= 100 && statusCode < 600) {
      res.status(statusCode).send(err);
    } else {
      res.status(500).send(err);
    }
  });
}

function isValidDate(date) {
  date = String(date);
  var dateRegEx = /^\d{4}-\d{2}-\d{2}$/;

  return date.match(dateRegEx) != null &&
    date.substring(5, 7) > 0 && date.substring(5, 7) < 13 &&
    date.substring(8) > 0 && date.substring(8) < 31;
}

function isPositiveInteger(str) {
  var intRegex = /^\d+$/;

  return String(str).match(intRegex) != null;
}

function QueryError(name, status, message) {
  this.name = name;
  this.status = status;
  this.message = message;
  this.stack = (new Error()).stack;
}
QueryError.prototype = Object.create(Error.prototype);
QueryError.prototype.constructor = QueryError;

function query(queryString, args) {
  return Promise.using(getSqlConnection(), function(connection) {
    return connection.queryAsync(queryString, args);
  });
}

function defined(value) {
  return value !== undefined && value !== null;
}

function getAccountID(auth0_id) {
 return query('SELECT * FROM Acct WHERE auth0_id = ?', [auth0_id])
 .then(function(data) {
   if (data.length === 1) {
     return data[0].acct_id;
   }
   else {
     return Promise.reject({status: 403, message: "Invalid Auth0 ID"})
   }
 });
}

function seed() {
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

      'INSERT INTO Site (site_name, site_address) VALUES("Lin-Manuel Elementary", "1155 Tremont Street, Roxbury Crossing, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("Yawkey Boys and Girls Club", "115 Warren St, Roxbury, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("Hamilton Elementary", "625 Columbus Avenue, Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("Lafayette Middle School", "111 Huntington Avenue, Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("Washington Intermediate School", "1776 Beacon Street, Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("Schuyler High School", "232 Boylston Street, Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("Jefferson Elementary", "72 Kneeland Street, Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("Clear Brook High School", "451 Charles Street, Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("Amelia Earheart Elementary", "371 Clarendon Street, Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("Philip Elementary", "843 Massachusetts Avenue, Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("YMCA", "230 Huntington Avenue, Boston, MA")',

      'INSERT INTO Student (first_name, last_name, dob) VALUES ("Percy", "Jackson", DATE("1993-08-18"))',
      'INSERT INTO Student (first_name, last_name, dob) VALUES ("Annabeth", "Chase", DATE("1993-07-12"))',
      'INSERT INTO Student (first_name, last_name, dob) VALUES ("Brian", "Smith", DATE("1993-04-12"))',
      'INSERT INTO Student (first_name, last_name, dob) VALUES ("Pam", "Ho", DATE("1993-04-12"))',

      'INSERT INTO Program (site_id, program_name) VALUES(1, "LMElementaryBoys")',
      'INSERT INTO Program (site_id, program_name) VALUES(2, "YawkeyGirls")',
      'INSERT INTO Program (site_id, program_name) VALUES(10, "PHElementaryBoys")',
      'INSERT INTO Program (site_id, program_name) VALUES(11, "YMCAGirls")',

      // Percy, Annabeth, and Pam are in program 1
      // Brian is in program 2
      'INSERT INTO StudentToProgram (student_id, program_id) VALUES (1, 1)',
      'INSERT INTO StudentToProgram (student_id, program_id) VALUES (2, 1)',
      'INSERT INTO StudentToProgram (student_id, program_id) VALUES (4, 1)',
      'INSERT INTO StudentToProgram (student_id, program_id) VALUES (3, 2)',

      'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("Ron", "Large", "ronlarge@americascores.org", "Coach", "auth0|584377c428be27504a2bcf92")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("Marcel", "Yogg", "myogg@americascores.org", "Coach", "auth0|58437854a26376e37529be0d")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("Maggie", "Pam", "mp@americascores.org", "Volunteer", "auth0|5843788eda0529cd293da8e3")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("Jeff", "Nguyen", "jnguyen@americascores.org", "Volunteer", "auth0|584378b528be27504a2bcf98")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("Larry", "Mulligan", "lmulligan@americascores.org", "Staff", "auth0|584378dda26376e37529be0f")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("Jake", "Sky", "blue@americascores.org", "Staff", "auth0|5843790aa7972b6f752e07d9")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("Mark", "Pam", "redsoxfan@americascores.org", "Admin", "auth0|5843792b28be27504a2bcfa0")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("Amanda", "Diggs", "adiggs@americascores.org", "Admin", "auth0|58437948dff6306470568bd5")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("Tom", "Lerner", "tlerner@americascores.org", "Coach", "auth0|5843796a28be27504a2bcfa1")',

      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (7, 1)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (8, 2)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (1, 1)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (1, 2)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (5, 2)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (6, 1)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (3, 2)',

      'INSERT INTO Event (program_id, event_date) VALUES (1, DATE("2016-05-19"))',
      'INSERT INTO Event (program_id, event_date) VALUES (2, DATE("2016-05-18"))',
      'INSERT INTO Event (program_id, event_date) VALUES (1, DATE("2016-05-19"))',
      'INSERT INTO Event (program_id, event_date) VALUES (1, DATE("2016-12-02"))',
      'INSERT INTO Event (program_id, event_date) VALUES (3, DATE("2016-05-19"))',
      'INSERT INTO Event (program_id, event_date) VALUES (4, DATE("2016-05-19"))',

      'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (1, 1, 5, 5, 5)',
      'INSERT INTO Measurement (student_id, event_id, height, weight) VALUES (1, 2, 7, 7)',
      'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (2, 6, 71, 17, 57)',
      'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (2, 4, 40, 12, 500)',
      'INSERT INTO Measurement (student_id, event_id, height, weight) VALUES (2, 2, 44, 16)',
      'INSERT INTO Measurement (student_id, event_id, height, weight) VALUES (4, 2, 4, 12)'
    ];

    return Promise.map(querys, (query) => {
      return connection.queryAsync(query);
    })
    .then(function() {
      connection.destroy();
    });
  });
}

function demoSeed() {
  return seed().then(() => {
    return Promise.using(getSqlConnection(), (connection) => {
      const querys = [
        'INSERT INTO Student (first_name, last_name, dob) VALUES ("Newt", "Scamanader", DATE("2001-11-09"))',
        'INSERT INTO Student (first_name, last_name, dob) VALUES ("Jacob", "Kowalski", DATE("1999-03-31"))',

        'INSERT INTO StudentToProgram (student_id, program_id) VALUES (4, 2)',
        'INSERT INTO StudentToProgram (student_id, program_id) VALUES (5, 1)',
        'INSERT INTO StudentToProgram (student_id, program_id) VALUES (6, 1)'
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

function getAuth0ID(acc_id) {
  // returns the auth0_id field associated with the acct_id found in the 'Acct' table
  return query('SELECT auth0_id FROM Acct WHERE acct_id = ?', [acc_id]);
}

module.exports = {
  makeResponse, QueryError, isValidDate, isPositiveInteger, query, defined, seed, demoSeed, getAuth0ID, getAccountID
};

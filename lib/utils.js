'use strict';

const Promise = require('bluebird');
const getSqlConnection = require('../config/connection').getSqlConnection;

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

      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Ron", "Large", "ronlarge@gmail.com", "Coach")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Marcel", "Yogg", "myogg@gmail.com", "Coach")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Maggie", "Pam", "mp@gmail.com", "Volunteer")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Jeff", "Nguyen", "jnguyen@gmail.com", "Volunteer")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Larry", "Mulligan", "lmulligan@gmail.com", "Staff")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Jake", "Sky", "blue@gmail.com", "Staff")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Mark", "Pam", "redsoxfan@gmail.com", "Admin")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Amanda", "Diggs", "adiggs@gmail.com", "Admin")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Tom", "Lerner", "tlerner@gmail.com", "Coach")',

      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (7, 1)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (8, 2)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (1, 1)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (1, 2)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (5, 2)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (6, 1)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (3, 2)',

      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (1, 1, DATE("2016-05-19"))',
      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (2, 1, DATE("2016-05-18"))',
      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (1, 2, DATE("2016-05-19"))',
      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (1, 1, DATE("2016-12-02"))',
      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (3, 1, DATE("2016-05-19"))',
      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (4, 1, DATE("2016-05-19"))',

      'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (1, 1, 5, 5, 5)',
      'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (1, 2, 7, 7, 7)',
      'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (2, 6, 71, 17, 57)',
      'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (2, 4, 40, 12, 500)',
      'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (2, 2, 44, 16, 500)',
      'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (4, 2, 4, 12, 421)'
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

module.exports = {
  QueryError, isValidDate, isPositiveInteger, query, defined, seed, demoSeed
};

'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const Promise = require('bluebird');
const yargs = require('yargs');
const mocha = require('gulp-mocha');
const createConnection = require('./config/connection').createConnection;

gulp.task('eslint', () => {
  var stream = gulp.src(['**/*.js', '!node_modules/**', '!coverage/**'])
  .pipe(eslint({
    quiet: true,
    globals: [
      'describe',
      'it',
      'beforeEach',
      'afterEach'
    ]
    }))
  .pipe(eslint.format());

  if (yargs.argv.failTaskOnError) {
    stream = stream.pipe(eslint.failAfterError());
  }
  return stream;
});

gulp.task('test', () => {
  var stream = gulp.src('test/**/*.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));

  if (yargs.argv.failTaskOnError) {
    stream = stream.on('error', process.exit.bind(process, 1));
  } else {
    stream = stream.on('error', process.exit.bind(process, 0));
  }
  return stream;
});

gulp.task('seed', () => {
  Promise.using(createConnection(), (connection) => {
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

      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("for the coach", "123 Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("also for the coach", "123 Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("singe", "single Boston, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("old name", "old address")',
      'INSERT INTO Site (site_name, site_address) VALUES("site a", "370 Marsh Rd, MA")',
      'INSERT INTO Site (site_name, site_address) VALUES("site b", "144 Atwater St, CA")',

      'INSERT INTO Student (first_name, last_name, dob) VALUES ("Percy", "Jackson", DATE("1993-07-18"))',
      'INSERT INTO Student (first_name, last_name, dob) VALUES ("Annabeth", "Chase", DATE("1993-06-12"))',
      'INSERT INTO Student (first_name, last_name, dob) VALUES ("Brian", "Smith", DATE("1993-04-12"))',
      'INSERT INTO Student (first_name, last_name, dob) VALUES ("Pam", "Ho", DATE("1993-04-12"))',

      'INSERT INTO Program (site_id, program_name) VALUES(1, "test program")',
      'INSERT INTO Program (site_id, program_name) VALUES(2, "test program 2")',
      'INSERT INTO Program (site_id, program_name) VALUES(10, "test program 3")',
      'INSERT INTO Program (site_id, program_name) VALUES(11, "test program 4")',

      'INSERT INTO StudentToProgram (student_id, program_id) VALUES (2, 1)',
      'INSERT INTO StudentToProgram (student_id, program_id) VALUES (3, 2)',

      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Ron", "Large", "ronlarge@gmail.com", "Coach")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Marcel", "Yogg", "myogg@gmail.com", "Coach")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Maggie", "Pam", "mp@gmail.com", "Volunteer")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Jeff", "Leg", "leggy@gmail.com", "Volunteer")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Lary", "Arm", "arms@gmail.com", "Staff")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Jakie", "Sky", "blue@gmail.com", "Staff")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Mark", "Pam", "yahoo@gmail.com", "Admin")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Amanda", "Dirt", "dirt@gmail.com", "Admin")',
      'INSERT INTO Acct (first_name, last_name, email, acct_type) VALUES ("Tom", "Lard", "fat@gmail.com", "Coach")',

      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (7, 1)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (8, 2)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (1, 1)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (5, 2)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (6, 1)',
      'INSERT INTO AcctToProgram (acct_id, program_id) VALUES (3, 2)',

      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (1, 1, DATE("2016-05-19"))',
      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (2, 1, DATE("2016-05-18"))',
      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (1, 2, DATE("2016-05-19"))',
      'INSERT INTO Event (program_id, acct_id, event_date) VALUES (1, 1, DATE("2016-05-19"))',
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
    });
  });
});

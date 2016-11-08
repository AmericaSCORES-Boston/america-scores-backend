'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const Promise = require('bluebird');
const yargs = require('yargs');
const mocha = require('gulp-mocha');
const createConnection = require('./config/config').createConnection;

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
    const commands = [
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
      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")', // 1
      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")', // 2
      'INSERT INTO Site (site_name, site_address) VALUES("for the coach", "123 Boston, MA")', // 3
      'INSERT INTO Site (site_name, site_address) VALUES("also for the coach", "123 Boston, MA")', // 4
      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")', // 5
      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")', // 6
      'INSERT INTO Site (site_name, site_address) VALUES("fakeSiteName", "123 Boston, MA")', // 7
      'INSERT INTO Site (site_name, site_address) VALUES("singe", "single Boston, MA")', // 8
      'INSERT INTO Site (site_name, site_address) VALUES("old name", "old address")' // 9
    ];

    return Promise.map(commands, function(command) {
      return connection.queryAsync(command);
    });
  });
});

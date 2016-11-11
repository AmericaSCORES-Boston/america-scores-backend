'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const yargs = require('yargs');
const mocha = require('gulp-mocha');
const utils = require('./lib/utils');

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
  utils.seed();
});

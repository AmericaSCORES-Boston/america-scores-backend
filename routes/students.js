'use strict';

const Promise = require('bluebird');
const query = require('../lib/utils').query;

function getStudents(req) {
  // Get student by first name, last name, and date of birth
  if (req.query && req.query.first_name && req.query.last_name &&
    req.query.dob) {
      var birthday = req.query.dob;
      if (isValidDate(birthday)) {
        // If the date is in yyyy-mm-dd format, get the student
        return query('SELECT * FROM Student WHERE first_name=\'' +
        req.query.first_name +
        '\' AND last_name=\''+ req.query.last_name +
        '\' AND dob BETWEEN \'' + birthday + ' 00:00:00\''
        + ' AND \'' + birthday + ' 23:59:59\'');
      } else {
        return Promise.reject({
          name: 'InvalidArgumentError',
          status: 400,
          message: 'Failed to get student due to invalid birthdate.' +
          ' Try yyyy-mm-dd.',
          propertyName: 'dob',
          propertyValue: req.query.dob
        });
      }
  }

  return query('SELECT * FROM Student');
}

function getStudent(req) {

}

function createStudent(req) {

}

function updateStudent(req) {

}

function deleteStudent(req) {

}

function isValidDate(date) {
  var dateRegEx = /^\d{4}-\d{2}-\d{2}$/;

  return date.match(dateRegEx) != null &&
  date.substring(5,7) > 0  && date.substring(5,7) < 13 &&
  date.substring(8) > 0 && date.substring(8) < 31
}

// export Student functions
module.exports = {getStudents, getStudent, createStudent, updateStudent,
  deleteStudent};

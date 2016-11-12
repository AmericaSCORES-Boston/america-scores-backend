'use strict';

const Promise = require('bluebird');
const query = require('../lib/utils').query;

function getStudents(req) {
  // Get student by first name, last name, and date of birth
  if (req.query && req.query.first_name && req.query.last_name &&
    req.query.dob) {
      var birthday = req.query.dob;
      if (isValidDate(String(birthday))) {
        // If the date is in yyyy-mm-dd format, get the student
        return query('SELECT * FROM Student WHERE first_name=\'' +
        req.query.first_name +
        '\' AND last_name=\''+ req.query.last_name +
        '\' AND dob BETWEEN \'' + birthday + ' 00:00:00\''
        + ' AND \'' + birthday + ' 23:59:59\'');
      } else {
        // Date of birth format is incorrect, send error
        var message = 'Failed to get student due to invalid birthdate.' +
        ' Try yyyy-mm-dd.';
        return createInvalidArgumentError(birthday, 'dob', message);
      }
  } else if (req.params && (req.params.program_id || req.params.site_id)) {
    if (req.params.program_id) {
      var id = req.params.program_id;
      var table = 'Program';
      var field = 'program_id';
      var queryString = 'SELECT * FROM Student WHERE student_id IN ' +
      '(SELECT student_id FROM StudentToProgram ' +
      'WHERE program_id=' + id + ')';
    } else if (req.params.site_id) {
      var id = req.params.site_id;
      var table = 'Site';
      var field = 'site_id';
      var queryString = 'SELECT * FROM Student WHERE student_id IN ' +
      '(SELECT student_id FROM StudentToProgram WHERE program_id IN ' +
      '(SELECT program_id FROM Program WHERE site_id=' + id + '))';
    }

    // Check if the id is an integer > 0
    if (isPositiveInteger(id)) {
      // Check if the id is in the related table
      return countInDB(id, table, field)
      .then(function(count) {
        if (count > 0) {
          return query(queryString);
        } else {
          // Given id does not exist, give error.
          return createArgumentNotFoundError(id, field);
        }
      }).then(function(data) {
        return data;
      });
    } else {
      // id is not a number or is negative (invalid)
      return createInvalidArgumentError(id, field);
    }
  } else {
    return query('SELECT * FROM Student');
  }
}

function getStudent(req) {
  var id = req.params.student_id;
  var field = 'student_id';

  // Check if student is a positive integer
  if (isPositiveInteger(id)) {
    // Check if the student is in the database
    return countInDB(id, 'Student', field)
    .then(function(count) {
      if (count > 0) {
        // The id is in the database. Fetch the student
        return query('SELECT * FROM Student WHERE student_id=' + id);
      } else {
        return createArgumentNotFoundError(id, field);
      }
    })
  } else {
    // Error for invalid id format
    // id is not a number or is negative (invalid)
    return createInvalidArgumentError(id, field);
  }



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
  date.substring(5, 7) > 0 && date.substring(5, 7) < 13 &&
  date.substring(8) > 0 && date.substring(8) < 31;
}

function isPositiveInteger(str) {
  var intRegex = /^\d+$/;

  return String(str).match(intRegex) != null;
}

function countInDB(id, table, field) {
  return query('SELECT COUNT(*) FROM ' + table + ' WHERE ' + field + '=' + id)
  .then(function(data) {
    return data[0]['COUNT(*)'];
  });
}

function createInvalidArgumentError(id, field, message) {
  var defaultIdError = 'Given ' + field + ' is of invalid format (e.g. not' +
  ' an integer or negative)';
  message = (typeof message === 'undefined') ? defaultIdError : message;
  return Promise.reject({
    name: 'InvalidArgumentError',
    status: 400,
    message: message,
    propertyName: field,
    propertyValue: id
  });
}

function createArgumentNotFoundError(id, field) {
  // Given id does not exist, give error.
  return Promise.reject({
    name: 'ArgumentNotFoundError',
    status: 404,
    message: 'Could not fetch students: The given ' + field +
    ' does not exist in the database',
    propertyName: field,
    propertyValue: id
  });
}

// export Student functions
module.exports = {getStudents, getStudent, createStudent, updateStudent,
  deleteStudent};

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
        // Date of birth format is incorrect, send error
        var message = 'Failed to get student due to invalid birthdate.' +
        ' Try yyyy-mm-dd.';
        return createInvalidArgumentError(birthday, 'dob', message);
      }
  } else if (req.params && (req.params.program_id || req.params.site_id ||
    req.params.event_id)) {
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
    } else if (req.params.event_id) {
      var id = req.params.event_id;
      var table = 'Event';
      var field = 'event_id';
      var queryString = 'SELECT * FROM Student WHERE student_id IN ' +
      '(SELECT student_id FROM StudentToProgram WHERE program_id IN ' +
      '(SELECT program_id FROM Event WHERE event_id=' + id + '))';
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
    });
  } else {
    // Error for invalid id format
    // id is not a number or is negative (invalid)
    return createInvalidArgumentError(id, field);
  }
}

function createStudent(req) {
  // Check that request has all necessary fields
  if (req.body && req.body.first_name && req.body.last_name &&
    req.body.dob && req.params && req.params.program_id) {
      // Ensure that the given birthdate is valid
      if (!isValidDate(req.body.dob)) {
        return createInvalidArgumentError(req.body.dob, 'dob',
        'Failed to get student due to invalid birthdate. Try yyyy-mm-dd.');
      }

      // Ensure that the program_id is the valid type (positive integer)
      if (!isPositiveInteger(req.params.program_id)) {
        return createInvalidArgumentError(req.params.program_id, 'program_id');
      }

      // Check if the given program_id exists in the database
      return countInDB(req.params.program_id, 'Program', 'program_id')
      .then(function(count) {
        if (count > 0) {
          // The program_id is valid, add the student to the database
          var promise = getStudents({
            query: {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              dob: req.body.dob
            }
          });

          return promise.then(function(data) {
            if (data.length == 0) {
              // Student does not exist in DB yet, so add them to Student table
              return query('INSERT INTO Student (first_name, last_name, dob)' +
              ' VALUES ("' + req.body.first_name + '", "' + req.body.last_name +
              '", DATE("' + req.body.dob + '"))')
              .then(function() {
                return getStudents({
                  query: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    dob: req.body.dob
                  }
                });
              })
              .then(function(data) {
                // Then, link student to the program in StudentToProgram table
                return query('INSERT INTO StudentToProgram ' +
                '(student_id, program_id) VALUES (' +
                data[0].student_id + ', ' + req.params.program_id + ')');
              });
            } else {
              // Student already exists
              return Promise.reject({
                name: 'DatabaseConflictError',
                status: 409,
                message: 'Unable to create student: the student is already in ' +
                'the database',
              });
            }
          });
        } else {
          // Given program_id does not exist, give error.
          return createArgumentNotFoundError(req.params.program_id,
            'program_id');
        }
      }).then(function(data) {
        return data;
      });
  } else {
    // Missing necessary fields, throw error
    return Promise.reject({
      name: 'MissingFieldError',
      status: 400,
      message: 'Request must have body and params sections. Within params, a ' +
      'valid program_id must be given. Within body, a valid first_name, ' +
      'last_name, and birthdate (dob) must be given.'
    });
  }
}

function updateStudent(req) {

}

function deleteStudent(req) {

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
    message: 'Invalid request: The given ' + field +
    ' does not exist in the database',
    propertyName: field,
    propertyValue: id
  });
}

// export Student functions
module.exports = {getStudents, getStudent, createStudent, updateStudent,
  deleteStudent};

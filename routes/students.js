'use strict';

const Promise = require('bluebird');
const utils = require('../lib/utils');
const query = utils.query;
const defined = utils.defined;

// Require other routes called
var sites = require('../routes/sites');
var programs = require('../routes/programs');
var events = require('../routes/events');

// Require isPositiveInteger for argument checking
const isPositiveInteger = require('../lib/utils').isPositiveInteger;

// Require isValidDate for argument checking
const isValidDate = require('../lib/utils').isValidDate;

function getStudents(req) {
  // Get student by first name, last name, and date of birth
  if (defined(req.query.first_name) && defined(req.query.last_name) && defined(req.query.dob)) {
      var birthday = req.query.dob;
      if (isValidDate(birthday)) {
        // If the date is in yyyy-mm-dd format, get the student
        return query('SELECT * FROM Student WHERE first_name = ? ' +
        'AND last_name = ? AND dob = DATE(?)',
        [req.query.first_name, req.query.last_name, birthday]);
      } else {
        // Date of birth format is incorrect, send error
        var message = 'Failed to get student due to invalid birthdate.' +
        ' Try yyyy-mm-dd.';
        return createInvalidArgumentError(birthday, 'dob', message);
      }
  } else if (!req.query.hasOwnProperty('first_name') &&
  !req.query.hasOwnProperty('last_name') && !req.query.hasOwnProperty('dob')) {
    if (req.user.authorization == 'Admin' || req.user.authorization == 'Staff') {
      return query('SELECT * FROM Student');
    } else {
      return createAccessDeniedError();
    }
  } else {
    return Promise.reject({
      name: 'UnsupportedRequest',
      status: 501,
      message: 'The API does not support a request of this format. ' +
      ' See the documentation for a list of options.'
    });
  }
}

function getStudentsByProgram(req) {
    var id = req.params.program_id;
    var field = 'program_id';
    var queryString = 'SELECT * FROM Student WHERE student_id IN ' +
    '(SELECT student_id FROM StudentToProgram ' +
    'WHERE program_id = ?)';

  // Check if the id is an integer > 0
  if (isPositiveInteger(id)) {
    // Check if the id is in the related table
    return programs.getProgram(req)
    .then(function(data) {
      if (data.length > 0) {
        return query(queryString, [id]);
      } else {
        // Given id does not exist, give error.
        return createArgumentNotFoundError(id, field);
      }
    })
    .then(function(data) {
      return data;
    });
  } else {
    // id is not a number or is negative (invalid)
    return createInvalidArgumentError(id, field);
  }
}

function getStudentsByEvent(req) {
  var id = req.params.event_id;
  var field = 'event_id';
  var queryString = 'SELECT * FROM Student WHERE student_id IN ' +
  '(SELECT student_id FROM StudentToProgram WHERE program_id IN ' +
  '(SELECT program_id FROM Event WHERE event_id = ?))';
  // $$$ this is wrong, you should be linking from event, to measurement, to student.
  // TODO: fix this query + results in tests

  // Check if the id is an integer > 0
  if (isPositiveInteger(id)) {
    // Check if the id is in the related table
    return events.getEvent(req)
    .then(function(data) {
      if (data.length > 0) {
        return query(queryString, [id]);
      } else {
        // Given id does not exist, give error.
        return createArgumentNotFoundError(id, field);
      }
    })
    .then(function(data) {
      return data;
    });
  } else {
    // id is not a number or is negative (invalid)
    return createInvalidArgumentError(id, field);
  }
}

function getStudentsBySite(req) {
  var id = req.params.site_id;
  var field = 'site_id';
  var queryString = 'SELECT * FROM Student WHERE student_id IN ' +
  '(SELECT student_id FROM StudentToProgram WHERE program_id IN ' +
  '(SELECT program_id FROM Program WHERE site_id = ?))';

  // Check if the id is an integer > 0
  if (isPositiveInteger(id)) {
    // Check if the id is in the related table
    return sites.getSite(req)
    .then(function(data) {
      if (data.length > 0) {
        return query(queryString, [id]);
      } else {
        // Given id does not exist, give error.
        return createArgumentNotFoundError(id, field);
      }
    })
    .then(function(data) {
      return data;
    });
  } else {
    // id is not a number or is negative (invalid)
    return createInvalidArgumentError(id, field);
  }
}

function getStudent(req) {
  if (!defined(req.params) || !defined(req.params.student_id)) {
    // Missing necessary fields, throw error
    return Promise.reject({
      name: 'MissingFieldError',
      status: 400,
      message: 'Request must have a params section with a valid student_id'
    });
  }

  var id = req.params.student_id;
  var field = 'student_id';

  // Check if student is a positive integer
  if (isPositiveInteger(id)) {
    return query('SELECT * FROM Student WHERE student_id=?', [id]);
  } else {
    // Error for invalid id format
    // id is not a number or is negative (invalid)
    return createInvalidArgumentError(id, field);
  }
}

function createStudent(req) {
  // Check that request has all necessary fields
  if (defined(req.body) && defined(req.body.first_name) && defined(req.body.last_name) &&
    defined(req.body.dob) && defined(req.params) && defined(req.params.program_id)) {
      // Ensure that the given birthdate is valid
      if (!isValidDate(req.body.dob)) {
        return createInvalidArgumentError(req.body.dob, 'dob',
        'Failed due to invalid birthdate. Try yyyy-mm-dd.');
      }

      // Ensure that the program_id is the valid type (positive integer)
      if (!isPositiveInteger(req.params.program_id)) {
        return createInvalidArgumentError(req.params.program_id, 'program_id');
      }

      // Check if the given program_id exists in the database
      return programs.getProgram(req)
      .then(function(data) {
        if (data.length > 0) {
          var student_id;

          // The program_id is valid, add the student to the database
          var promise = getStudents({
            query: {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              dob: req.body.dob
            }
          });

          return promise.then(function(data) {
            if (data.length === 0) {
              // Student does not exist in DB yet, so add them to Student table
              return query('INSERT INTO Student (first_name, last_name, dob) ' +
              'VALUES (?, ?, DATE(?))',
                [req.body.first_name, req.body.last_name, req.body.dob])
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
                student_id = data[0].student_id;
                // Then, link student to the program in StudentToProgram table
                return query('INSERT INTO StudentToProgram ' +
                '(student_id, program_id) VALUES (?, ?)',
                  [student_id, req.params.program_id]);
              })
              .then(function() {
                return getStudent({
                  params: {
                    student_id: student_id
                  }
                });
              });
            } else {
              // Student already exists
              return Promise.reject({
                name: 'DatabaseConflictError',
                status: 409,
                message: 'Unable to create student: the student ' +
                'is already in the database',
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
  // Check that request has all necessary fields
  if (defined(req.params) && defined(req.params.student_id) && defined(req.body)) {
    // All required fields are present. Check that student_id is valid
    if (!isPositiveInteger(req.params.student_id)) {
      return createInvalidArgumentError(req.params.student_id, 'student_id');
    }

    // Check that date of birth, if present, is valid
    if (defined(req.body.dob) && !isValidDate(req.body.dob)) {
      return createInvalidArgumentError(req.body.dob, 'dob',
      'Failed due to invalid birthdate. Try yyyy-mm-dd.');
    }

    // Check that program_id, if present, is valid
    if (defined(req.params.program_id) && !isPositiveInteger(req.params.program_id)) {
      return createInvalidArgumentError(req.params.program_id, 'program_id');
    }

    // Check if the given student_id exists in the database
    return getStudent(req)
    .then(function(data) {
      if (data.length > 0) {
        // The student exists. Next, check if a program update was requested
        if (!defined(req.params.program_id)) {
          // No program update requested. Update students table.
          var queryComponents = createUpdateQuery(req.body);
          queryComponents[1].push(req.params.student_id);
          return query(queryComponents[0], queryComponents[1])
          .then(function() {
            return getStudent(req);
          });
        } else {
          // Program update requested. Check if the new program exists.
          return programs.getProgram(req)
          .then(function(data) {
            if (data.length > 0) {
              // The program exists. Update the student's program
              return query('UPDATE StudentToProgram SET program_id = ? ' +
              'WHERE student_id = ?', [req.params.program_id,
                req.params.student_id])
                // $$$ TODO: This replaces the current student to program relationship.
                // Should we replace or just add a new one? When should the old relationship be cleared?
              .then(function() {
                // Check if any other fields need to be updated.
                if (defined(req.body.first_name) || defined(req.body.last_name) || defined(req.body.dob)) {
                  // Note: Line is repeated b/c partial updates aren't allowed
                  var queryComponents = createUpdateQuery(req.body);
                  queryComponents[1].push(req.params.student_id);
                  return query(queryComponents[0], queryComponents[1]);
                }
              })
              .then(function() {
                return getStudent(req);
              });
            } else {
              // The program does not exist
              return createArgumentNotFoundError(req.params.program_id,
                'program_id');
            }
          });
        }
      } else {
        return createArgumentNotFoundError(req.params.student_id, 'student_id');
      }
    });
  } else {
    // Missing necessary fields, throw error
    return Promise.reject({
      name: 'MissingFieldError',
      status: 400,
      message: 'Request must have body and params sections. Within params, a ' +
      'valid student_id must be given. Body should contain updated ' +
      'values for fields to be updated.'
    });
  }
}

function deleteStudent(req) {
  if (req.user.authorization == 'Admin') {
    if (defined(req.params) && defined(req.params.student_id)) {
      if (isPositiveInteger(req.params.student_id)) {
        return getStudent(req)
        .then(function(data) {
          var student = data;
          if (data.length > 0) {
            return query('DELETE FROM Measurement WHERE student_id=?',
             [req.params.student_id])
            .then(function() {
              return query('DELETE FROM StudentToProgram WHERE student_id=?',
               [req.params.student_id]);
            })
            .then(function() {
              return query('DELETE FROM Student WHERE student_id=?',
               [req.params.student_id]);
            })
            .then(function() {
              return student;
            });
          } else {
            return createArgumentNotFoundError(req.params.student_id,
              'student_id');
          }
        });
      } else {
        return createInvalidArgumentError(req.params.student_id, 'student_id');
      }
    } else {
      // Missing necessary fields, throw error
      return Promise.reject({
        name: 'MissingFieldError',
        status: 400,
        message: 'Request must have a params section with a valid student_id'
      });
    }
  } else {
    return createAccessDeniedError();
  }
}

function createUpdateQuery(body) {
  var changes = '';
  var fieldValues = [];

  // Create a string of changes based on what is in the body
  for (var field in body) {
    if (field === 'dob') {
      changes = changes + field + ' = DATE(?), ';
    } else {
      changes = changes + field + ' = ?, ';
    }

    // Add to ordered list of field arguments
    fieldValues.push(body[field]);
  }

  // Drop the extra comma
  changes = changes.substring(0, changes.length - 2);

  // Construct and return the final update query string
  return ['UPDATE Student SET ' + changes + ' WHERE student_id = ?',
   fieldValues];
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

function createAccessDeniedError() {
  return Promise.reject({
    name: 'AccessDenied',
    status: 403,
    message: 'Access denied: this account does not have permission ' +
    'for this action'
  });
}

// export Student functions
module.exports = {
  getStudents, getStudentsByProgram, getStudentsByEvent, getStudentsBySite,
  getStudent, createStudent, updateStudent, deleteStudent
};

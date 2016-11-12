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

  else if (req.params && req.params.program_id) {
    var program_id = req.params.program_id;
    // Check if the program_id is an integer > 0
    if (isPositiveInteger(String(program_id))) {
      // Check if the program_id is in the Program table
      //return isInDatabase(program_id, 'Program', 'program_id');
      //
      // console.log('----------');
      isInDatabase(program_id, 'Program', 'program_id')
      .then(function(count) {
        if (count > 0) {
          return query('SELECT * FROM Student WHERE student_id IN ' +
          '(SELECT student_id FROM StudentToProgram ' +
          'WHERE program_id=' + program_id + ')');
        } else {
          console.log('WOOF');
          // Given program does not exist, give error.
          return Promise.reject({
            name: 'ArgumentNotFoundError',
            status: 404,
            message: 'Could not fetch students: The given program does not' +
            ' exist in the database',
            propertyName: 'program_id',
            propertyValue: program_id
          });
        }
      }).then(function(data) {
        console.log("WHY WHY ");
        console.log(data);
        return data;
      });
      console.log('----------');

      // if (0 > 0) {
      //   console.log(program_id + " YO YO YO");
      //   // The given program exists, so fetch students in that program
      //   return query('SELECT * FROM Student WHERE student_id IN ' +
      //   '(SELECT student_id FROM StudentToProgram ' +
      //   'WHERE program_id=' + program_id + ')');
      //
      //   console.log(program_id + " YO YO YOskfod");
      // } else {
      //   console.log('WOOF');
      //   // Given program does not exist, give error.
      //   return Promise.reject({
      //     name: 'ArgumentNotFoundError',
      //     status: 404,
      //     message: 'Could not fetch students: The given program does not' +
      //     ' exist in the database',
      //     propertyName: 'program_id',
      //     propertyValue: program_id
      //   });
      // }

      // if (idExists > 0) {
      //   console.log('YEEEHA');
      //   // The given program exists, so fetch students in that program
      //   return query('SELECT * FROM Student WHERE student_id IN ' +
      //   '(SELECT student_id FROM StudentToProgram ' +
      //   'WHERE program_id=' + program_id + ')');
      // } else {
      //   // Given program does not exist, give error.
      //   return Promise.reject({
      //     name: 'ArgumentNotFoundError',
      //     status: 404,
      //     message: 'Could not fetch students: The given program does not' +
      //     ' exist in the database',
      //     propertyName: 'program_id',
      //     propertyValue: program_id
      //   });
      // }
    } else {
      // Program id is not a number or is negative (invalid)
      return Promise.reject({
        name: 'InvalidArgumentError',
        status: 400,
        message: 'Given program_id is of invalid format (e.g. not an integer' +
        ' or negative)',
        propertyName: 'program_id',
        propertyValue: program_id
      });
    }
  } else {
    return query('SELECT * FROM Student');
  }
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
  date.substring(5, 7) > 0 && date.substring(5, 7) < 13 &&
  date.substring(8) > 0 && date.substring(8) < 31;
}

function isPositiveInteger(str) {
  var intRegex = /^\d+$/;

  return str.match(intRegex) != null;
}

function isInDatabase(id, table, field) {
  return query('SELECT COUNT(*) FROM ' + table + ' WHERE ' + field + '=' + id)
  .then(function(data) {
    return data[0]['COUNT(*)'];
  });
}

// export Student functions
module.exports = {getStudents, getStudent, createStudent, updateStudent,
  deleteStudent};

'use strict';

const Promise = require('bluebird');
const utils = require('../lib/utils');
const defined = utils.defined;
const query = utils.query;
const getAccountID = utils.getAccountID;

// Require isPositiveInteger for argument checking
const isPositiveInteger = require('../lib/utils').isPositiveInteger;

// Require other routes called
var events = require('../routes/events');
var students = require('../routes/students');

/**
 * Get all stats.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStats(req) {
  if (req.user.authorization === 'Admin' || req.user.authorization === 'Staff') {
    return query('SELECT * FROM Measurement');
  }

  return getAccountID(req.user.auth0_id)
    .then(function(data) {
      return query('SELECT measurement_id, student_id, event_id, height, weight, pacer FROM Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN AcctToProgram WHERE acct_id = ?', [data]);
    });
}

/**
 * Get all stats for a site.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStatsBySite(req) {
  if (req.user.authorization === 'Admin' || req.user.authorization === 'Staff') {
    return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN Site WHERE site_id = ?', [req.params.site_id]);
  }

  return getAccountID(req.user.auth0_id)
    .then(function(data) {
      return query('SELECT measurement_id, student_id, event_id, height, weight, pacer FROM Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN AcctToProgram WHERE acct_id = ? AND site_id = ?', [data, req.params.site_id]);
    });
}

/**
 * Get all stats for a program.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStatsByProgram(req) {
  if (req.user.authorization === 'Admin' || req.user.authorization === 'Staff') {
    return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Event NATURAL JOIN Program WHERE program_id = ?', [req.params.program_id]);
  }

  return getAccountID(req.user.auth0_id)
    .then(function(data) {
      return query('SELECT measurement_id, student_id, event_id, height, weight, pacer FROM Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN AcctToProgram WHERE acct_id = ? AND program_id = ?', [data, req.params.program_id]);
    });
}

/**
 * Get all stats for an event.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStatsByEvent(req) {
  if (req.user.authorization === 'Admin' || req.user.authorization === 'Staff') {
    return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Event WHERE event_id = ?', [req.params.event_id]);
  }

  return getAccountID(req.user.auth0_id)
    .then(function(data) {
      return query('SELECT measurement_id, student_id, event_id, height, weight, pacer FROM Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN AcctToProgram WHERE acct_id = ? AND event_id = ?', [data, req.params.event_id]);
    });
}

/**
 * Get all stats for a student.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStatsByStudent(req) {
  if (req.user.authorization === 'Admin' || req.user.authorization === 'Staff') {
    return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Student WHERE student_id = ?', [req.params.student_id]);
  }

  return getAccountID(req.user.auth0_id)
    .then(function(data) {
      return query('SELECT measurement_id, student_id, event_id, height, weight, pacer FROM Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN AcctToProgram WHERE acct_id = ? AND student_id = ?', [data, req.params.student_id]);
    });
}

/**
 * Get a stat.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStat(req) {
  if (req.user.authorization === 'Admin' || req.user.authorization === 'Staff') {
    return query('SELECT * FROM Measurement WHERE measurement_id = ?', [req.params.stat_id]);
  }

  return getAccountID(req.user.auth0_id)
    .then(function(data) {
      return query('SELECT measurement_id, student_id, event_id, height, weight, pacer FROM Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN AcctToProgram WHERE acct_id = ? AND measurement_id = ?', [data, req.params.student_id]);
    });
}

/**
 * Upload pacers stats.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function uploadPacerStats(req) {
  var event_id = req.params.event_id;
  var field = 'event_id';
  if (req.user.authorization == 'Coach' || req.user.authorization == 'Volunteer') {
    return getAccountID(req.user.auth0_id)
      .then(function(data) {
          return query('SELECT measurement_id, student_id, event_id, height, weight, pacer FROM Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN AcctToProgram WHERE acct_id = ? AND event_id = ?', [data, req.params.event_id]);
      })
      .then(function(data) {
        if (data.length === 0) {
          return Promise.reject({
            status: 403,
            message: 'Forbidden to laod stats or event does not exist'
          });
        }
    });
  }

  if (!isPositiveInteger(event_id)) {
    return createInvalidArgumentError(event_id, field);
  }

  return events.getEvent(req).then(function(data) {
    if (data.length === 0) {
      return createArgumentNotFoundError(event_id, field);
    }

    if(!defined(req.body.stats)) {
      return Promise.reject({
        name: 'MissingFieldError',
        status: 400,
        message: 'Request must have a stats section in the body' +
        ' which contains a list of objects. Objects must have student_id ' +
        'and either height and weight fields, pacer field, or all three'
      });
    }

    var statsList = req.body.stats;

    return Promise.map(statsList, (measurement) => {
      if(!defined(measurement.student_id)) {
        // TODO: Missing student_id for this stat, can't insert
      }
      if(!isPositiveInteger(measurement.student_id)) {
        // TODO: Invalid student_id, can't insert.
      }
      return students.getStudent({
        params: {
          student_id: measurement.student_id
        }
      })
      .then(function(data) {
        if (data.length === 0) {
          // TODO: Student_id doesn't exist. Can't add due to referential integrity
        }
        // Check if stat already exists (search by student_id + event_id)
        return query('SELECT * FROM Measurement WHERE student_id=? AND event_id=?', [measurement.student_id, event_id])
          .then(function(data) {
            if (!defined(measurement.pacer) || !isPositiveInteger(measurement.pacer)) {
              // TODO: PACER data is invalid. Can't insert.
            }
            if (data.length === 0) {
              return query('INSERT INTO Measurement (student_id, event_id, pacer) VALUES (?, ?, ?)', [measurement.student_id, event_id, measurement.pacer]);
            }
            return query('UPDATE Measurement SET pacer = ? WHERE student_id = ? AND event_id = ?', [measurement.pacer, measurement.student_id, event_id]);
          });
      });
    });
  });
}

/**
 * Upload BMI stats.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function uploadBMIStats(req) {
  var event_id = req.params.event_id;
  var field = 'event_id';
  if (req.user.authorization == 'Coach' || req.user.authorization == 'Volunteer') {
    return getAccountID(req.user.auth0_id)
      .then(function(data) {
          return query('SELECT measurement_id, student_id, event_id, height, weight, pacer FROM Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN AcctToProgram WHERE acct_id = ? AND event_id = ?', [data, req.params.event_id]);
      })
      .then(function(data) {
        if (data.length === 0) {
          return Promise.reject({
            status: 403,
            message: 'Forbidden to laod stats or event does not exist'
          });
        }
    });
  }

  if (!isPositiveInteger(event_id)) {
    return createInvalidArgumentError(event_id, field);
  }

  return events.getEvent(req).then(function(data) {
    if (data.length === 0) {
      return createArgumentNotFoundError(event_id, field);
    }

    if(!defined(req.body.stats)) {
      return Promise.reject({
        name: 'MissingFieldError',
        status: 400,
        message: 'Request must have a stats section in the body' +
        ' which contains a list of objects. Objects must have student_id ' +
        'and either height and weight fields, pacer field, or all three'
      });
    }

    var statsList = req.body.stats;

    return Promise.map(statsList, (measurement) => {
      if(!defined(measurement.student_id)) {
        // TODO: Missing student_id for this stat, can't insert
      }
      if(isPositiveInteger(measurement.student_id)) {
        // TODO: Invalid student_id, can't insert.
      }
      return students.getStudent({
        params: {
          student_id: measurement.student_id
        }
      })
      .then(function(data) {
        if (data.length === 0) {
          // TODO: Student_id doesn't exist. Can't add due to referential integrity
        }
        // Check if stat already exists (search by student_id + event_id)
        return query('SELECT * FROM Measurement WHERE student_id=? AND event_id=?', [measurement.student_id, event_id])
          .then(function(data) {
            if (!defined(measurement.height) || !isPositiveInteger(measurement.height) || !defined(measurement.weight) || !isPositiveInteger(measurement.weight)) {
              // TODO: Height/Weight data is invalid. Can't insert.
            }
            if (data.length === 0) {
              return query('INSERT INTO Measurement (student_id, event_id, height, weight) VALUES (?, ?, ?, ?)', [measurement.student_id, event_id, measurement.height, measurement.weight]);
            }
            return query('UPDATE Measurement SET height = ?, weight = ? WHERE student_id = ? AND event_id = ?', [measurement.height, measurement.weight, measurement.student_id, event_id]);
          });
        });
    });
  });
}

/**
 * PUT
 * /stats/id : Update stat with given id
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function updateStat(req) {
  if (req.user.authorization == 'Coach' || req.user.authorization == 'Volunteer') {
    return getAccountID(req.user.auth0_id)
      .then(function(data) {
          return query('SELECT measurement_id, student_id, event_id, height, weight, pacer FROM Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN AcctToProgram WHERE acct_id = ? AND measurement_id = ?', [data, req.params.stat_id]);
      })
      .then(function(data) {
        if (data.length === 0) {
          return Promise.reject({
            status: 403,
            message: 'Forbidden to update this stat'
          });
        }
    });
  }

  if (!defined(req.body) || !defined(req.body.height) && !defined(req.body.weight) && !defined(req.body.pacer)) {
    return Promise.reject({
      status: 406,
      message: 'Must provide height, weight or pacer values'
    });
  }

   var queryComponents = createUpdateQuery(req.body);
   queryComponents[1].push(req.params.stat_id);
   return query(queryComponents[0], queryComponents[1])
   .then(function() {
     return getStat(req);
   });
 }

/**
 * DELETE
 * /stats/id : Delete stat with given id
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function deleteStat(req) {
  if (req.user.authorization !== 'Admin') {
    return Promise.reject({status: 403, message: 'Access denied'});
  }

  return query('DELETE FROM Measurement WHERE measurement_id = ?', [req.params.stat_id]);
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

function createUpdateQuery(body) {
  var changes = '';
  var fieldValues = [];

  // Create a string of changes based on what is in the body
  for (var field in body) {
    if (field === 'pacer' || field === 'height' || field === 'weight') {
      changes = changes + field + '= ?, ';
      // Add to ordered list of field arguments
      fieldValues.push(body[field]);
    }
  }

  // Drop the extra comma
  changes = changes.substring(0, changes.length - 2);

  // Construct and return the final update query string
  return ['UPDATE Measurement SET ' + changes + ' WHERE measurement_id = ?',
    fieldValues];
}

module.exports = {
  getStats,
  getStatsBySite,
  getStatsByProgram,
  getStatsByEvent,
  getStatsByStudent,
  getStat,
  uploadPacerStats,
  uploadBMIStats,
  updateStat,
  deleteStat
};

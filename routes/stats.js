'use strict';

const Promise = require('bluebird');
const utils = require('../lib/utils');
const defined = utils.defined;
const query = utils.query;

// Require isPositiveInteger for argument checking
const isPositiveInteger = require('../lib/utils').isPositiveInteger;

// Require other routes called
var events = require('../routes/events');
var students = require('../routes/students');

/**
 * GET
 * /stats : Gets all stats.
 * /sites/id/stats : Get all stats for a site
 * /programs/id/stats : Get all stats for a program
 * /events/id/stats : Get all stats for an event
 * /students/id/stats : Get all stats for a student
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
 function getStats(req) {
   if (defined(req.params)) {
     if (req.params.site_id) {
       if (!isPositiveInteger(req.params.site_id)) {
         return Promise.reject({
           status: 400,
           name: 'InvalidArgumentError',
           propertyName: 'site_id',
           propertyValue: req.params.site_id,
           message: 'Given site_id is of invalid format (e.g. not an integer or negative)'
         });
       }
       return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN Site WHERE site_id = ' + req.params.site_id);
     }
     if (defined(req.params.program_id)) {
       if (!isPositiveInteger(req.params.program_id)) {
         return Promise.reject({
           status: 400,
           name: 'InvalidArgumentError',
           propertyName: 'program_id',
           propertyValue: req.params.program_id,
           message: 'Given program_id is of invalid format (e.g. not an integer or negative)'
         });
       }
       return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Event NATURAL JOIN Program WHERE program_id = ' + req.params.program_id);
     }
     if (defined(req.params.event_id)) {
       if (!isPositiveInteger(req.params.event_id)) {
         return Promise.reject({
           status: 400,
           name: 'InvalidArgumentError',
           propertyName: 'event_id',
           propertyValue: req.params.event_id,
           message: 'Given event_id is of invalid format (e.g. not an integer or negative)'
         });
       }
       return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Event WHERE event_id = ' + req.params.event_id);
     }
     if (defined(req.params.student_id)) {
       if (!isPositiveInteger(req.params.student_id)) {
         return Promise.reject({
           status: 400,
           name: 'InvalidArgumentError',
           propertyName: 'student_id',
           propertyValue: req.params.student_id,
           message: 'Given student_id is of invalid format (e.g. not an integer or negative)'
         });
       }
       return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Student WHERE student_id = ' + req.params.student_id);
     }
   }
   return query('SELECT * FROM Measurement');
 }

 /**
 * GET
 * /stats/id : Get stat for an id
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
 function getStat(req) {
   if (!isPositiveInteger(req.params.stat_id)) {
     return Promise.reject({
     status: 400,
     name: 'InvalidArgumentError',
     propertyName: 'stat_id',
     propertyValue: req.params.stat_id,
     message: 'Given stat_id is of invalid format (e.g. not an integer or negative)'
   });
   }
   return query('SELECT * FROM Measurement WHERE measurement_id = ' + req.params.stat_id);
}

// Upload batch of PACER stats. Update existing stats objects or create new ones
function uploadPacerStats(req) {
  var event_id = req.params.event_id;
  var field = 'event_id';

  if (isPositiveInteger(event_id)) {
    return events.getEvent(req)
    .then(function(data) {
      if (data.length > 0) {
        // Start looping through
        if(defined(req.body.stats)) {
          var statsList = req.body.stats;

          return Promise.map(statsList, (measurement) => {
            if(defined(measurement.student_id)) {
              if(isPositiveInteger(measurement.student_id)) {
                return students.getStudent({
                  params: {
                    student_id: measurement.student_id
                  }
                })
                .then(function(data) {
                  if (data.length > 0) {
                    // Check if stat already exists (search by student_id + event_id)
                    return query('SELECT * FROM Measurement WHERE student_id=? ' +
                    'AND event_id=?', [measurement.student_id, event_id])
                    .then(function(data) {
                      if (data.length > 0) {
                        // TODO: If it does, do an update
                        if (defined(measurement.pacer) &&
                        isPositiveInteger(measurement.pacer)) {
                          // Update existing stat
                          return query('UPDATE Measurement SET pacer = ? WHERE '
                          + 'student_id = ? AND event_id = ?',
                          [measurement.pacer,
                            measurement.student_id,
                            event_id]);
                        } else {
                          // TODO: PACER data is invalid can't insert
                        }
                      } else {
                        if (defined(measurement.pacer) &&
                        isPositiveInteger(measurement.pacer)) {
                          // Otherwise, create a new stat
                          return query('INSERT INTO Measurement (student_id, ' +
                          'event_id, pacer) VALUES (?, ?, ?)',
                          [measurement.student_id,
                            event_id,
                            measurement.pacer]);
                        } else {
                          // TODO: PACER data is invalid. Can't insert.
                        }
                      }
                    });
                  } else {
                    // TODO: Student_id doesn't exist. Can't add due to referential integrity
                  }
                });
              } else {
                // TODO: Invalid student_id, can't insert.

              }
            } else {
              // TODO: Missing student_id for this stat, can't insert
            }
          });
        } else {
          // Missing necessary fields, throw error
          return Promise.reject({
            name: 'MissingFieldError',
            status: 400,
            message: 'Request must have a stats section in the body' +
            ' which contains a list of objects. Objects must have student_id ' +
            'and either height and weight fields, pacer field, or all three'
          });
        }
      } else {
        return createArgumentNotFoundError(event_id, field);
      }
    });
  } else {
    return createInvalidArgumentError(event_id, field);
  }
}

  /**
 * POST
 * /events/id/students/id/stats : Create a new stat associated with a student in an event
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
 function createStat(req) {
   if (!req.params || !req.params.event_id || !req.params.student_id) {
         return Promise.reject({
         status: 400,
         message: 'Could not post due to missing fields'
       });
   }
   if (!req.body || !req.body.height || !req.body.weight || !req.body.pacer) {
       return Promise.reject({
         status: 400,
         message: 'Could not post due to missing fields'
       });
   }

   return query('INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES ('
          + req.params.student_id + ', ' + req.params.event_id + ', ' + req.body.height + ', '
          + req.body.weight + ', ' + req.body.pacer + ')');
 }

 /**
 * PUT
 * /stats/id : Update stat with given id
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
 function updateStat(req) {
   if (!req.body || !(req.body.height || req.body.weight || req.body.pacer)) {
        return Promise.reject({
         status: 406,
         message: 'Must provide height, weight and pacer values'
       });
   }
   if (!req.params.stat_id) {
        return Promise.reject({
         status: 406,
         message: 'Must provide height, weight and pacer values'
       });
   }

   return Promise.resolve()
    .then(function() {
     if (req.body.measurement_height) {
       return query('UPDATE Measurement SET height = ' + req.body.height + '" WHERE measurement_id = ' + req.params.stat_id);
     }
     })
  .then(function() {
     if (req.body.measurement_weight) {
       return query('UPDATE Measurement SET weight = ' + req.body.weight + '" WHERE measurement_id = ' + req.params.stat_id);
     }
     })
    .then(function() {
     if (req.body.measurement_pacer) {
       return query('UPDATE Measurement SET pacer = ' + req.body.pacer + '" WHERE measurement_id = ' + req.params.stat_id);
     }
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
   if (Number(req.params.stat_id) < 0 || !Number.isInteger(Number(req.params.stat_id))) {
     return Promise.reject({
     status: 400,
     name: 'InvalidArgumentError',
     propertyName: 'stat_id',
     propertyValue: req.params.stat_id,
     message: 'Given stat_id is of invalid format (e.g. not an integer or negative)'
   });
   }

   return query('DELETE FROM Measurement WHERE measurement_id = ' + req.params.stat_id);
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

module.exports = {
  getStats,
  getStat,
  uploadPacerStats,
  createStat,
  updateStat,
  deleteStat,
};

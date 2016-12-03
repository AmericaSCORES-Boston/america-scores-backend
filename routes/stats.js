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
 * Get all stats.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStats(req) {
  return query('SELECT * FROM Measurement');
}

/**
 * Get all stats for a site.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStatsBySite(req) {
  return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN Site WHERE site_id = ' + req.params.site_id);
}

/**
 * Get all stats for a program.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStatsByProgram(req) {
  return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Event NATURAL JOIN Program WHERE program_id = ' + req.params.program_id);
}

/**
 * Get all stats for an event.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStatsByEvent(req) {
  return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Event WHERE event_id = ' + req.params.event_id);
}

/**
 * Get all stats for a student.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStatsByStudent(req) {
  return query('SELECT measurement_id, student_id, event_id, height, weight, pacer from Measurement NATURAL JOIN Student WHERE student_id = ' + req.params.student_id);
}

/**
 * GET
 * /stats/id : Get stat for an id
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getStat(req) {
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

          for (var i = 0; i < statsList.length; i++) {
            var measurement = statsList[i];

            // What if the id is negative or undefined? $$$
            if(defined(measurement.student_id)) {
              // Check if stat already exists (search by student_id + event_id)
              return query('SELECT * FROM Measurement WHERE student_id=? ' +
              'AND event_id=?', [measurement.student_id, event_id])
              .then(function(data) {
                if (data.length > 0) {
                  // If it does, do an update
                  console.log('mew');
                  console.log(measurement);
                } else {
                  console.log('woof');
                  if (defined(measurement.pacer))
                  // Otherwise, create a new stat
                  return query('INSERT INTO Measurement (student_id, ' +
                  'event_id, pacer) VALUES (?, ?, ?)',
                  [measurement.student_id,
                    event_id,
                    measurement.pacer]);
                }
              });
            } else {
              // Missing necessary fields, throw error
              // return Promise.reject({
              //   name: 'MissingFieldError',
              //   status: 400,
              //   message: 'Request must have a stats section in the body' +
              //   ' which contains a list of objects. Objects must have student_id ' +
              //   'and either height and weight fields, pacer field, or all three'
              // });
              //Should this error? Or just give a warning and add other stats?
            }
          }
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
   return idChecking(req.params.stat_id, 'stat_id')
   .then(function(data) {
     return query('DELETE FROM Measurement WHERE measurement_id = ' + req.params.stat_id);
   })
   .catch(function(err) {
     return err;
   });

  //  if (Number(req.params.stat_id) < 0 || !Number.isInteger(Number(req.params.stat_id))) {
  //    return Promise.reject({
  //    status: 400,
  //    name: 'InvalidArgumentError',
  //    propertyName: 'stat_id',
  //    propertyValue: req.params.stat_id,
  //    message: 'Given stat_id is of invalid format (e.g. not an integer or negative)'
  //  });
  //  }

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

 // function bulkStatsUpload(statsList) {
 //   var deferred = Promise.defer();
 //
 //   if (statsList.length > 1) {
 //     var measurement = statsList[1];
 //
 //     // What if the id is not a positive integer?
 //     if(defined(measurement.student_id)) {
 //       // Check if stat already exists (search by student_id + event_id)
 //       query('SELECT * FROM Measurement WHERE student_id=? ' +
 //       'AND event_id=?', [measurement.student_id, event_id])
 //       .then(function(data) {
 //         if (data.length > 0) {
 //           // If it does, do an update
 //           console.log('mew');
 //           console.log(measurement);
 //         } else {
 //           console.log('woof');
 //           if (defined(measurement.pacer))
 //           // Otherwise, create a new stat
 //           query('INSERT INTO Measurement (student_id, ' +
 //           'event_id, pacer) VALUES (?, ?, ?)',
 //           [measurement.student_id,
 //             event_id,
 //             measurement.pacer]);
 //         }
 //       });
 //     } else {
 //       // student_id is missing
 //     }
 //   } else if (statsList.length == 1) {
 //
 //   } else {
 //     // You don't insert if you get an empty list... do you just return?
 //   }
 // }

module.exports = {
  getStats,
  getStatsBySite,
  getStatsByProgram,
  getStatsByEvent,
  getStatsByStudent,
  getStat,
  uploadPacerStats,
  createStat,
  updateStat,
  deleteStat,
};

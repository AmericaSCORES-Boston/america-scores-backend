'use strict';

const Promise = require('bluebird');
const query = require('../lib/utils').query;

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
	 if (req.query){
		 if (req.query.site_id) {
			 return query('SELECT measurement_id, measurement_height, measurement_weight, measurement_pacer from Measurement NATURAL JOIN Event NATURAL JOIN Program NATURAL JOIN Site WHERE site_id = ' + req.query.site_id);
		 }
		 if (req.query.program_id) {
			 return query('SELECT measurement_id, measurement_height, measurement_weight, measurement_pacer from Measurement NATURAL JOIN Event NATURAL JOIN Program WHERE program_id = ' + req.query.program_id);
		 }
		 if (req.query.event_id) {
			 return query('SELECT measurement_id, measurement_height, measurement_weight, measurement_pacer from Measurement NATURAL JOIN Event WHERE event_id = ' + req.query.event_id);
		 }
		 if (req.query.student_id) {
			 return query('SELECT measurement_id, measurement_height, measurement_weight, measurement_pacer from Measurement NATURAL JOIN Student WHERE student_id = ' + req.query.student_id);
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
	 return query('SELECT * FROM Measurement WHERE measurement_id = ' + req.params.measurement_id);
}

  /**
 * POST
 * /events/id/students/id/stats : Create a new stat associated with a student in an event
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
 function createStat(req) {
	 if (!req.body || !req.body.event_id || !req.body.student_id) {
		     return Promise.reject({
				 status: 406,
				 message: 'Must provide associated event and student'
			 });
	 }
	 if (!req.body.measurement_height || !req.body.measurement_weight || !req.body.measurement_pacer) {
			 return Promise.reject({
				 status: 406,
				 message: 'Must provide height, weight and pacer values'
			 });
	 }
	 
	 return query('INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES (' 
					+ req.body.student_id + ', ' + req.body.event_id + ', ' + req.body.measurement_height + ', ' 
					+ req.body.measurement_weight + ', ' + req.body.measurement_pacer + ')');
 }
 
 /**
 * PUT
 * /stats/id : Update stat with given id
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
 function updateStat(req) {
	 if (!req.body || !(req.body.measurement_height || req.body.measurement_weight || req.body.measurement_pacer)) {
		 	 return Promise.reject({
				 status: 406,
				 message: 'Must provide height, weight and pacer values'
			 });
	 }
	 if (!req.params.measurement_id) {
		 	 return Promise.reject({
				 status: 406,
				 message: 'Must provide height, weight and pacer values'
			 });
	 }
	 
	 return Promise.resolve()
    .then(function() {
		 if (req.body.measurement_height) {
			 return query('UPDATE Measurement SET height = ' + req.body.measurement_height + '" WHERE measurement_id = ' + req.params.measurement_id);
		 }
     })
	.then(function() {
		 if (req.body.measurement_weight) {
			 return query('UPDATE Measurement SET weight = ' + req.body.measurement_weight + '" WHERE measurement_id = ' + req.params.measurement_id);
		 }
     })
    .then(function() {
		 if (req.body.measurement_pacer) {
			 return query('UPDATE Measurement SET pacer = ' + req.body.measurement_pacer + '" WHERE measurement_id = ' + req.params.measurement_id);
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
	 return query('DELETE FROM Measurement WHERE measurement_id = ' + req.params.measurement_id);
 }

module.exports = {
  getStats,
  getStat,
  createStat,
  updateStat,
  deleteStat,
};

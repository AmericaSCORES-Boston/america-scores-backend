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
	 if (req.params){
		 if (req.params.site_id) {
			 if (Number(req.params.site_id) < 0 || !Number.isInteger(Number(req.params.site_id))) {
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
		 if (req.params.program_id) {
			 if (Number(req.params.program_id) < 0 || !Number.isInteger(Number(req.params.program_id))) {
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
		 if (req.params.event_id) {
			 if (Number(req.params.event_id) < 0 || !Number.isInteger(Number(req.params.event_id))) {
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
		 if (req.params.student_id) {
			 if (Number(req.params.student_id) < 0 || !Number.isInteger(Number(req.params.student_id))) {
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
	 if (Number(req.params.stat_id) < 0 || !Number.isInteger(Number(req.params.stat_id))) {
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

module.exports = {
  getStats,
  getStat,
  createStat,
  updateStat,
  deleteStat,
};

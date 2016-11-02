const pool = require('../config/config').pool;

// Get all stats ever
function getStats(req) {
  return pool.query('SELECT * FROM stats')
    .then(function(rows) {
      return rows;
    });
};

// Get all stats of every student from one site
function getStatsFromSite(req) {
	return getStats(req);
};

// Get all the stats of one given student
function getStatsOfStudent(req) {
	return getStats(req);
};

// Get one set of stats for one given student
function getOneStatOfStudent(req) {
	return getStats(req);
};

// Post a new set of stats
function postStats(req) {
	return getStats(req);
};

// Update stats for a given stat id
function updateStats(req) {
	return getStats(req);
};

// Remove a set of stats from the database
function deleteStats(req) {
	return getStats(req);
};

module.exports = {
  getStats,
  getStatsFromSite,
  getStatsOfStudent,
  getOneStatOfStudent,
  postStats,
  updateStats,
  deleteStats,
};

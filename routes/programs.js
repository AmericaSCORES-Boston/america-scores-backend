const utils = require('../lib/utils');
const query = utils.query;
const defined = utils.defined;

function getPrograms(req) {
  return query('SELECT * FROM Program');
}

function getProgram(req) {
  var id = req.params.program_id;
  return query('SELECT * FROM Program WHERE program_id = ?', [id]);
}

function getProgramsBySite(req) {
  var id = req.params.site_id;
  return query('SELECT * FROM Program WHERE site_id = ?', [id]);
}

function getProgramsByStudent(req) {
  var id = req.params.student_id;
  return query('SELECT * FROM Program WHERE program_id IN (Select program_id FROM StudentToProgram WHERE student_id = ?)', [id]);
}

function getProgramsByAccount(req) {
  var id = req.params.account_id;
  return query('SELECT * FROM Program WHERE program_id IN (Select program_id FROM AcctToProgram WHERE acct_id = ?)', [id]);
}

function createProgram(req) {
  var site_id = req.params.site_id;
  var program_name = req.body.program_name;
  if(!defined(program_name)) {
    return Promise.reject({status: 400, message: 'Missing progam_name'});
  }
  return query('SELECT * FROM Site WHERE site_id = ?', [site_id])
  .then(function(data) {
    if (data.length == 1 && data[0].site_id == site_id) {
      return query('INSERT INTO Program (site_id, program_name) VALUES(?, ?)', [site_id, program_name])
      .then(function(data) {
        return query('SELECT * FROM Program WHERE program_id = ?', [data.insertId]);
      });
    }
    return Promise.resolve([]);
  });
}

function updateProgram(req) {
  var program_id = req.params.program_id;
  var program_name = req.body.program_name;
  if(!defined(program_name)) {
    return Promise.reject({status: 400, message: 'Missing program_name'});
  }
  return query('SELECT * FROM Program WHERE program_id = ?', [program_id])
  .then(function(data) {
    if (data.length == 1 && data[0].program_id == program_id) {
      return query('UPDATE Program SET program_name = ? WHERE program_id = ?', [req.body.program_name, program_id])
      .then(function() {
        return query('SELECT * FROM Program WHERE program_id = ?', program_id);
      });
    }
    return Promise.resolve([]);
  });
}

function deleteProgram(req) {
  var program_id = req.params.program_id;
  return query('SELECT * FROM Program WHERE program_id = ?', [program_id])
  .then(function(data) {
    if (data.length == 1 && data[0].program_id == program_id) {
      return query('DELETE FROM AcctToProgram WHERE program_id = ?', [program_id])
      .then(function() {
        return query('DELETE FROM StudentToProgram WHERE program_id = ?', [program_id]);
      })
      .then(function() {
        return query('DELETE FROM Measurement WHERE event_id IN (Select event_id FROM Event WHERE program_id = ?)', [program_id]);
      })
      .then(function() {
        return query('DELETE FROM Event WHERE program_id = ?', [program_id]);
      })
      .then(function() {
        return query('DELETE FROM Program WHERE program_id = ?', [program_id]);
      })
      .then(function() {
        return data;
      });
    }
    return Promise.resolve([]);
  });
};

module.exports = {
  getPrograms,
  getProgram,
  getProgramsBySite,
  getProgramsByStudent,
  getProgramsByAccount,
  createProgram,
  updateProgram,
  deleteProgram
};

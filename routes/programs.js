const query = require('../lib/utils').query;

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
  return query('INSERT INTO Program (site_id, program_name) VALUES(?, ?)', [site_id, program_name]).then(function(data) {
    return getProgram({params: {program_id: data.insertId}});
  });
}

function updateProgram(req) {
  var program_id = req.params.program_id;
  if (req.body.program_name) {
    return query('UPDATE Program SET program_name = ? WHERE program_id = ?', [req.body.program_name, program_id]).then(function(data) {
      return getProgram({params: {program_id: program_id}});
    });
  }
  return Promise.resolve([]);
}

function deleteProgram(req) {
  var program_id = req.params.program_id;
  var deletedProgram = getProgram({params: {program_id: program_id}});
  return deletedProgram.then(function(data) {
    return query('DELETE FROM AcctToProgram WHERE program_id = ?', [program_id]).then(function() {
      return query('DELETE FROM StudentToProgram WHERE program_id = ?', [program_id]).then(function() {
        return query('DELETE FROM Measurement WHERE event_id IN (Select event_id FROM Event WHERE program_id = ?)', [program_id]).then(function() {
          return query('DELETE FROM Event WHERE program_id = ?', [program_id]).then(function() {
            return query('DELETE FROM Program WHERE program_id = ?', [program_id]).then(function() {
              return data;
            });
          });
        });
      });
    });
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

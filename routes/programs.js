const query = require('../lib/utils').query;

function getPrograms(req) {
  if (Object.keys(req.params).length == 0) {
    return query('SELECT * FROM Program');
  }
  if (req.params.site_id && Object.keys(req.params).length == 1) {
    return query('SELECT * FROM Program WHERE site_id = ' + req.params.site_id);
  }
  // if (req.params.student.id && Object.keys(req.params).length == 1) {
  //   return query('');
  // }
}

function getProgram(req) {
    var id = req.params.program_id;
    return query('SELECT * FROM Program WHERE program_id = ?', [id]);
}

function getProgramsBySite(req) {
  return query('SELECT * FROM Program WHERE program_id = ' + req.params.program_id);
}

function getProgramsByStudent(req) {
  return query('SELECT * FROM Program WHERE program_id = ' + req.params.program_id);

}

function getProgramsByAccount(req) {
  return query('SELECT * FROM Program WHERE program_id = ' + req.params.program_id);
}

function createProgram(req) {
  // return query('INSERT INTO Program (site_id, program_name) VALUES(' + req.params.program_id + ', ' + req.body.program_name + ')');
}

function updateProgram(req) {

}

function deleteProgram(req) {
  // query('DELETE FROM AcctToProgram WHERE program_id = ' + req.params.program_id);
  // return query('DELETE FROM Program WHERE program_id = ' + req.params.program_id);
}

module.exports = {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
};

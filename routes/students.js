var connection = require('../config/config').createConnection;

function getStudents(req) {
  connection.then()
  return(connection.query('SELECT * FROM Students'));
}

function getStudent(req) {

}

function createStudent(req) {

}

function updateStudent(req) {

}

function deleteStudent(req) {

}

// export Student functions
module.exports = {getStudents, getStudent, createStudent, updateStudent,
  deleteStudent};

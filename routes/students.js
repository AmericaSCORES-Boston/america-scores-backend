const Promise = require('bluebird');
const createConnection = require('../config/config').createConnection;


function getStudents(req) {
  return Promise.using(createConnection(), (connection) => {
    return connection.queryAsync('SELECT * FROM Student')
    .then(function(rows) {
      return rows;
    });
  });
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

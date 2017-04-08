'use strict';

function StudentToProgram(student_id, program_id, id) {
  this.student_id = student_id;
  this.program_id = program_id;
  this.id = id === undefined ? null : id;
}

module.exports = {
  StudentToProgram
};

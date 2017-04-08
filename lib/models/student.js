'use strict';

function Student(first_name, last_name, dob, student_id) {
  this.first_name = first_name;
  this.last_name = last_name;
  this.dob = dob;
  this.student_id = student_id === undefined ? null : student_id;
}

module.exports = {
  Student
};

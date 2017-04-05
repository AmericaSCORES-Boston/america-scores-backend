'use strict';

function Site(site_name, site_address, site_id) {
  this.site_name = site_name;
  this.site_address = site_address;
  this.site_id = site_id === undefined ? null : site_id;
}

function Student(first_name, last_name, dob, student_id) {
  this.first_name = first_name;
  this.last_name = last_name;
  this.dob = dob;
  this.student_id = student_id === undefined ? null : student_id;
}

function Program(site_id, program_name, program_id) {
  this.site_id = site_id;
  this.program_name = program_name;
  this.program_id = program_id === undefined ? null : program_id;
}

function StudentToProgram(student_id, program_id, id) {
  this.student_id = student_id;
  this.program_id = program_id;
  this.id = id === undefined ? null : id;
}

function Acct(first_name, last_name, email, acct_type, auth0_id, acct_id) {
  this.first_name = first_name;
  this.last_name = last_name;
  this.email = email;
  this.acct_type = acct_type;
  this.auth0_id = auth0_id;
  this.acct_id = acct_id === undefined ? null : acct_id;
}

function AcctToProgram(acct_id, program_id, id) {
  this.acct_id = acct_id;
  this.program_id = program_id;
  this.id = id === undefined ? null : id;
}

function Event(program_id, event_date, event_id) {
  this.program_id = program_id;
  this.event_date = event_date;
  this.event_id = event_id === undefined ? null : event_id;
}

function Measurement(student_id, event_id, height, weight, pacer, measurement_id) {
  this.student_id = student_id;
  this.event_id = event_id;
  this.height = height;
  this.weight = weight;
  this.pacer = pacer;
  this.measurement_id = measurement_id === undefined ? null : measurement_id;
}

module.exports = {
  Site,
  Student,
  Program,
  StudentToProgram,
  Acct,
  AcctToProgram,
  Event,
  Measurement
};

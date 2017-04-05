'use strict';

const INSERT_SITE = 'INSERT INTO Site (site_name, site_address) VALUES("{0}", "{1}")';
const INSERT_STUDENT = 'INSERT INTO Student (first_name, last_name, dob) VALUES ("{0}", "{1}", DATE("{2}"))';
const INSERT_PROGRAM = 'INSERT INTO Program (site_id, program_name) VALUES ({0}, "{1}")';
const INSERT_STUDENT_TO_PROGRAM = 'INSERT INTO StudentToProgram (student_id, program_id) VALUES ({0}, {1})';
const INSERT_ACCT = 'INSERT INTO Acct (first_name, last_name, email, acct_type, auth0_id) VALUES ("{0}", "{1}", "{2}", "{3}", "{4}")';
const INSERT_ACCT_TO_PROGRAM = 'INSERT INTO AcctToProgram (acct_id, program_id) VALUES ({0}, {1})';
const INSERT_EVENT = 'INSERT INTO Event (program_id, event_date) VALUES ({0}, DATE("{1}"))';
const INSERT_MEASUREMENT = 'INSERT INTO Measurement (student_id, event_id, height, weight, pacer) VALUES ({0}, {1}, {2}, {3}, {4})';

module.exports = {
  INSERT_SITE,
  INSERT_STUDENT,
  INSERT_PROGRAM,
  INSERT_STUDENT_TO_PROGRAM,
  INSERT_ACCT,
  INSERT_ACCT_TO_PROGRAM,
  INSERT_EVENT,
  INSERT_MEASUREMENT
};

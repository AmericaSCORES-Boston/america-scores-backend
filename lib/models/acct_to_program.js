'use strict';

function AcctToProgram(acct_id, program_id, id) {
  this.acct_id = acct_id;
  this.program_id = program_id;
  this.id = id === undefined ? null : id;
}

module.exports = {
  AcctToProgram
};

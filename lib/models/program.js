'use strict';

function Program(site_id, program_name, program_id) {
  this.site_id = site_id;
  this.program_name = program_name;
  this.program_id = program_id === undefined ? null : program_id;
}

module.exports = {
  Program
};

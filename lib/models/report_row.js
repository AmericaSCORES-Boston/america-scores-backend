'use strict';

const utils = require('../utils');

function ReportRow(student_id, first_name, last_name, site_name, program_name,
  pre_date, pre_height, pre_weight, pre_pacer,
  post_date, post_height, post_weight, post_pacer) {
  this.student_id = student_id;
  this.first_name = first_name;
  this.last_name = last_name;
  this.site_name = site_name;
  this.program_name = program_name;
  this.pre_date = pre_date;
  this.pre_height = pre_height;
  this.pre_weight = pre_weight;
  this.pre_pacer = pre_pacer;
  this.post_date = post_date;
  this.post_height = post_height;
  this.post_weight = post_weight;
  this.post_pacer = post_pacer;
}

function ReportRowFromCSV(student_id, first_name, last_name, site_name, program_name,
  pre_date, pre_height, pre_weight, pre_pacer,
  post_date, post_height, post_weight, post_pacer) {
  this.student_id = parseInt(student_id);
  this.first_name = first_name;
  this.last_name = last_name;
  this.site_name = site_name;
  this.program_name = program_name;

  this.pre_date = pre_date !== 'NULL' ? utils.getJSDate(pre_date) : null;
  this.pre_height = pre_height !== 'NULL' ? parseInt(pre_height) : null;
  this.pre_weight = pre_weight !== 'NULL' ? parseInt(pre_weight) : null;
  this.pre_pacer = pre_pacer !== 'NULL' ? parseInt(pre_pacer) : null;

  this.post_date = post_date !== 'NULL' ? utils.getJSDate(post_date) : null;
  this.post_height = post_height !== 'NULL' ? parseInt(post_height) : null;
  this.post_weight = post_weight !== 'NULL' ? parseInt(post_weight) : null;
  this.post_pacer = post_pacer !== 'NULL' ? parseInt(post_pacer) : null;
}

module.exports = {
  ReportRow,
  ReportRowFromCSV
};

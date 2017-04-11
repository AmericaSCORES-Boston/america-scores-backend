'use strict';

function Measurement(student_id, event_id, height, weight, pacer, measurement_id) {
  this.student_id = student_id;
  this.event_id = event_id;
  this.height = height;
  this.weight = weight;
  this.pacer = pacer;
  this.measurement_id = measurement_id === undefined ? null : measurement_id;
}

module.exports = {
  Measurement
};

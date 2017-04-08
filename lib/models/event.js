'use strict';

function Event(program_id, event_date, event_id) {
  this.program_id = program_id;
  this.event_date = event_date;
  this.event_id = event_id === undefined ? null : event_id;
}

module.exports = {
  Event
};

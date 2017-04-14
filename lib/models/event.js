'use strict';

function Event(program_id, season_id, event_date, pre_season, event_id) {
  this.program_id = program_id;
  this.season_id = season_id;
  this.event_date = event_date;
  this.pre_season = pre_season;
  this.event_id = event_id === undefined ? null : event_id;
}

module.exports = {
  Event
};

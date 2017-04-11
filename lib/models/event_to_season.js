'use strict';

function EventToSeason(event_id, season_id, id) {
  this.event_id = event_id;
  this.season_id = season_id;
  this.id = id === undefined ? null : id;
}

module.exports = {
  EventToSeason
};

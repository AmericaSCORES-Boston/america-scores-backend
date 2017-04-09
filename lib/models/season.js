'use strict';

function Season(season, year, season_id) {
  this.season = season;
  this.year = year;
  this.season_id = season_id === undefined ? null : season_id;
}

module.exports = {
  Season
};

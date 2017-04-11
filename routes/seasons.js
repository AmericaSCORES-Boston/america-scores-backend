'use strict';

const query = require('../lib/utils').query;
const q = require('../lib/constants/queries');

function getSeasons(req) {
  return query(q.SELECT_SEASON);
}

module.exports = {
  getSeasons,
};

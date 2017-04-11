'use strict';

const chai = require('chai');
const assert = chai.assert;

const seasons = require('../../routes/seasons');
const SEASONS = require('../../lib/constants/seed').SEASONS;

describe('Seasons', function() {
  describe('getSeasons(req)', function() {
    it('returns all seasons in the database', function(done) {
      seasons.getSeasons({
        params: {},
        body: {},
      }).then(function(seasons) {
        assert.deepEqual(seasons, SEASONS);
        done();
      });
    });
  });
});


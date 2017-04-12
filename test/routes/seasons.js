'use strict';

const chai = require('chai');
const assert = chai.assert;

const seasons = require('../../routes/seasons');
const SEASONS = require('../../lib/constants/seed').TEST_SEASONS;

describe('Seasons', function() {
  before(function(done) {
    require('../../lib/seed').dbSeed().then(function() {
      done();
    });
  });

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


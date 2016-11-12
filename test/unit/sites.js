'use strict';

const chai = require('chai');
const assert = chai.assert;
const sites = require('../../routes/sites');
const utils = require('../../lib/utils');

const site1 = {
  site_id: 1,
    site_name: 'fakeSiteName',
    site_address: '123 Boston, MA'
};
const site2 = {
  site_id: 2,
  site_name: 'fakeSiteName',
  site_address: '123 Boston, MA'
};
const site3 = {
  site_id: 3,
  site_name: 'for the coach',
  site_address: '123 Boston, MA'
};
const site4 = {
  site_id: 4,
  site_name: 'also for the coach',
  site_address: '123 Boston, MA'
};
const site5 = {
  site_id: 5,
  site_name: 'fakeSiteName',
  site_address: '123 Boston, MA'
};
const site6 = {
  site_id: 6,
  site_name: 'fakeSiteName',
  site_address: '123 Boston, MA'
};
const site7 = {
  site_id: 7,
  site_name: 'fakeSiteName',
  site_address: '123 Boston, MA'
};
const site8 = {
  site_id: 8,
  site_name: 'singe',
  site_address: 'single Boston, MA'
};
const site9 = {
  site_id: 9,
  site_name: 'old name',
  site_address: 'old address'
};
const site10 = {
  site_id: 10,
  site_name: 'site a',
  site_address: '370 Marsh Rd, MA'
};
const site11 = {
  site_id: 11,
  site_name: 'site b',
  site_address: '144 Atwater St, CA'
};

describe('Sites', function() {
  beforeEach(function() {
    return utils.seed();
  });

  describe('getSites(req)', function() {
    it('gets all sites', function(done) {
      var promise = sites.getSites({});

      promise.then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);
        done();
      });
    });

    it('gets all sites for a given coach', function(done) {
      var promise = sites.getSites({
        query: {
          coach_id: 1
        }
      });

      promise.then(function(data) {
        assert.deepEqual([site1, site2], data);
        done();
      });
    });

    it('gets all sites for a given coach that does not exsit', function(done) {
      var promise = sites.getSites({
        query: {
          coach_id: 100
        }
      });

      promise.then(function(data) {
        assert.deepEqual([], data);
        done();
      });
    });
  });

  describe('createSite(req)', function() {
    it('create a site', function(done) {
      var newData = {
        site_name: 'newSiteName',
        site_address: 'new Boston, MA'
      };
      sites.getSites({})
      .then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);

        return sites.postSite({
          body: {
            site_name: newData.site_name,
            site_address: newData.site_address
          }
        });
      })
      .then(function() {
        return sites.getSites({});
      })
      .then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11, {
          site_id: 12,
          site_name: newData.site_name,
          site_address: newData.site_address
        }], data);
        done();
      });
    });

    it('does not create a site because body was missing', function(done) {
      sites.postSite({}).then(function() {
        return sites.getSites({});
      })
      .catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, and address');
        done();
      });
    });

    it('does not create a site because the site_name was missing', function(done) {
      sites.postSite({
        body: {
          site_address: 'address'
        }
      })
      .then(function() {
        return sites.getSites({});
      })
      .catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, and address');
        done();
      });
    });

    it('does not create a site because site_address was missing', function(done) {
      sites.postSite({
        body: {
          site_name: 'name'
        }
      })
      .then(function() {
        return sites.getSites({});
      })
      .catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, and address');
        done();
      });
    });
  });

  describe('getSite(req)', function() {
    it('get a site', function(done) {
      var promise = sites.getSite({
        params: {
          site_id: 1
        }
      });

      promise.then(function(data) {
        assert.deepEqual([site1], data);
        done();
      });
    });

    it('gets a site that does not exist', function(done) {
      var promise = sites.getSite({
        params: {
          site_id: 124
        }
      });

      promise.then(function(data) {
        assert.deepEqual([], data);
        done();
      });
    });
  });

  describe('updateSite(req)', function() {
    it('updates a site', function(done) {
      sites.getSite({
        params: {
          site_id: 9
        }
      })
      .then(function(data) {
        assert.deepEqual([site9], data);

        return sites.updateSite({
          params: {
            site_id: 9
          },
          body: {
            site_name: 'new name',
            site_address: 'new address'
          }
        });
      })
      .then(function() {
        return sites.getSite({
          params: {
            site_id: 9
          }
        });
      })
      .then(function(data) {
        assert.deepEqual([{
          site_id: 9,
          site_name: 'new name',
          site_address: 'new address'
        }], data);
        done();
      });
    });

    it('does not updated a site because the body was missing', function(done) {
      sites.updateSite({}).catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, or address');
        done();
      });
    });

    it('does not updated a site because there are no fields to be updated', function(done) {
      sites.updateSite({
        body: {}
      })
      .catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, or address');
        done();
      });
    });

    it('updates a site that does not exist', function(done) {
      sites.updateSite({
        params: {
          site_id: 92342
        },
        body: {
          site_name: 'new name',
          site_address: 'new address'
        }
      })
      .then(function(data) {
        assert.equal(0, data.affectedRows);
        done();
      });
    });
  });

  describe('deleteSite(req)', function() {
    it('delete a site', function(done) {
      sites.getSite({
        params: {
          site_id: 3
        }
      })
      .then(function(data) {
        assert.deepEqual([site3], data);

        return sites.deleteSite({
          params: {
            site_id: 3
          }
        });
      })
      .then(function() {
        return sites.getSite({
          params: {
            site_id: 3
          }
        });
      })
      .then(function(data) {
        assert.deepEqual([], data);
        done();
      });
    });

    it('deletes a site that does not exist', function(done) {
      sites.getSites({}).then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);

        return sites.deleteSite({
          params: {
            site_id: 12414
          }
        });
      })
      .then(function() {
        return sites.getSites({});
      })
      .then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);
        done();
      });
    });
  });
});

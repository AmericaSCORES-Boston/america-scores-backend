'use strict';

const chai = require('chai');
const assert = chai.assert;
const sites = require('../../routes/sites');
const utils = require('../../lib/utils');
const constants = require('../../lib/constants');

const site1 = {
  site_id: 1,
    site_name: 'Lin-Manuel Elementary',
    site_address: '1155 Tremont Street, Roxbury Crossing, MA'
};
const site2 = {
  site_id: 2,
  site_name: 'Yawkey Boys and Girls Club',
  site_address: '115 Warren St, Roxbury, MA'
};
const site3 = {
  site_id: 3,
  site_name: 'Hamilton Elementary',
  site_address: '625 Columbus Avenue, Boston, MA'
};
const site4 = {
  site_id: 4,
  site_name: 'Lafayette Middle School',
  site_address: '111 Huntington Avenue, Boston, MA'
};
const site5 = {
  site_id: 5,
  site_name: 'Washington Intermediate School',
  site_address: '1776 Beacon Street, Boston, MA'
};
const site6 = {
  site_id: 6,
  site_name: 'Schuyler High School',
  site_address: '232 Boylston Street, Boston, MA'
};
const site7 = {
  site_id: 7,
  site_name: 'Jefferson Elementary',
  site_address: '72 Kneeland Street, Boston, MA'
};
const site8 = {
  site_id: 8,
  site_name: 'Clear Brook High School',
  site_address: '451 Charles Street, Boston, MA'
};
const site9 = {
  site_id: 9,
  site_name: 'Amelia Earheart Elementary',
  site_address: '371 Clarendon Street, Boston, MA'
};
const site10 = {
  site_id: 10,
  site_name: 'Philip Elementary',
  site_address: '843 Massachusetts Avenue, Boston, MA'
};
const site11 = {
  site_id: 11,
  site_name: 'YMCA',
  site_address: '230 Huntington Avenue, Boston, MA'
};

describe('Sites', function() {
  beforeEach(function() {
    return utils.seed();
  });

  describe('getSites(req)', function() {
    it('gets all sites', function(done) {
      var promise = sites.getSites({
        user: constants.admin
      });

      promise.then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);
        done();
      });
    });

    it('gets sites on for the accont if not admin', function(done) {
      var promise = sites.getSites({
        user: constants.coach
      });

      promise.then(function(data) {
        assert.deepEqual([site1, site2], data);
        done();
      });
    });
  });

  describe('getSitesByAccount(req)', function() {
    it('gets all sites for a given coach', function(done) {
      var promise = sites.getSitesByAccount(1);

      promise.then(function(data) {
        assert.deepEqual([site1, site2], data);
        done();
      });
    });

    it('it should return no sites if the given coach does not exist', function(done) {
      var promise = sites.getSitesByAccount(100);

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
      sites.getSites({
        user: constants.admin
      })
      .then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);

        return sites.createSite({
          body: newData,
          user: constants.admin
        });
      })
      .then(function() {
        return sites.getSites({
          user: constants.admin
        });
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

    it('403 if you are not an admin or staff', function(done) {
      var newData = {
        site_name: 'newSiteName',
        site_address: 'new Boston, MA'
      };
      sites.createSite({
        body: newData,
        user: constants.coach
      })
      .catch(function(err) {
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied');
        done();
      });
    });

    it('does not create site because a site with the given name and address already exists', function(done) {
      sites.createSite({
        body: {
          site_name: 'Schuyler High School',
          site_address: '232 Boylston Street, Boston, MA'
        },
        user: constants.admin
      })
      .catch(function(err) {
        assert.equal(err.status, 409);
        assert.equal(err.message, 'Unable to create site: the site is already in the database');
        return sites.getSites({
          user: constants.admin
        });
      })
      .then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);
        done();
      });
    });

    it('does not create a site because body was missing', function(done) {
      sites.createSite({
        user: constants.admin
      }).catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, and address');
        return sites.getSites({
          user: constants.admin
        });
      })
      .then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);
        done();
      });
    });

    it('does not create a site because the site_name was missing', function(done) {
      sites.createSite({
        body: {
          site_address: 'address'
        },
        user: constants.admin
      })
      .catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, and address');
        return sites.getSites({
          user: constants.admin
        });
      })
      .then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);
        done();
      });
    });

    it('does not create a site because site_address was missing', function(done) {
      sites.createSite({
        body: {
          site_name: 'name'
        },
        user: constants.admin
      })
      .catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, and address');
        return sites.getSites({
          user: constants.admin
        });
      })
      .then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);
        done();
      });
    });
  });

  describe('getSite(req)', function() {
    it('get a site admin', function(done) {
      var promise = sites.getSite({
        params: {
          site_id: 1
        },
        user: constants.admin
      });

      promise.then(function(data) {
        assert.deepEqual([site1], data);
        done();
      });
    });

    it('get the site if the coach can see it', function(done) {
      var promise = sites.getSite({
        params: {
          site_id: 1
        },
        user: constants.coach
      });

      promise.then(function(data) {
        assert.deepEqual([site1], data);
        done();
      });
    });

    it('403 if the coach cannot see the sites', function(done) {
      var promise = sites.getSite({
        params: {
          site_id: 3
        },
        user: constants.coach
      });

      promise.catch(function(err) {
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied or site not found');
        done();
      });
    });

    it('returns an empty array when getting a site that does not exist', function(done) {
      var promise = sites.getSite({
        params: {
          site_id: 124
        },
        user: constants.admin
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
        },
        user: constants.admin
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
          },
          user: constants.admin
        });
      })
      .then(function() {
        return sites.getSite({
          params: {
            site_id: 9
          },
          user: constants.admin
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

    it('only admins or staff can edit a site', function(done) {
      sites.updateSite({
        params: {
            site_id: 9
        },
        body: {
          site_name: 'new name',
          site_address: 'new address'
        },
        user: constants.coach
      })
      .catch(function(err) {
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied');
        done();
      });
    });

    it('does not updated a site because the body was missing', function(done) {
      sites.updateSite({
        user: constants.admin
      }).catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, or address');
        done();
      });
    });

    it('does not updated a site because there are no fields to be updated', function(done) {
      sites.updateSite({
        body: {},
        user: constants.admin
      })
      .catch(function(err) {
        assert.equal(err.status, 406);
        assert.equal(err.message, 'Must provide site\'s name, or address');
        done();
      });
    });

    it('It does nothing when asked to update a site that doesn\'t exist', function(done) {
      sites.updateSite({
        params: {
          site_id: 92342
        },
        body: {
          site_name: 'new name',
          site_address: 'new address'
        },
        user: constants.admin
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
        },
        user: constants.admin
      })
      .then(function(data) {
        assert.deepEqual([site3], data);

        return sites.deleteSite({
          params: {
            site_id: 3
          },
          user: constants.admin
        });
      })
      .then(function() {
        return sites.getSite({
          params: {
            site_id: 3
          },
          user: constants.admin
        });
      })
      .then(function(data) {
        assert.deepEqual([], data);
        done();
      });
    });

    it('only admins can delete a site', function(done) {
      sites.deleteSite({
        params: {
          site_id: 3
        },
        user: constants.staff
      })
      .catch(function(err) {
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied');
        done();
      });
    });

    it('does nothing when told to delete a site that doesn\'t exist', function(done) {
      sites.getSites({
        user: constants.admin
      }).then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);

        return sites.deleteSite({
          params: {
            site_id: 12414
          },
          user: constants.admin
        });
      })
      .then(function() {
        return sites.getSites({
          user: constants.admin
        });
      })
      .then(function(data) {
        assert.deepEqual([site1, site2, site3, site4, site5, site6, site7, site8, site9, site10, site11], data);
        done();
      });
    });
  });
});

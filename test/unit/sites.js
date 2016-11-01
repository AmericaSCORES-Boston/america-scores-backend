'use strict';

const chai = require('chai');
const assert = chai.assert;
const sites = require('../../routes/sites');

describe('utils', function() {
  describe('sites', function() {
    it('gets all sites', function(done) {
      var fakeData1 = {
        site_id: 0,
        site_name: 'fakeSiteName',
        site_address: '123 Boston, MA'
      };
      var fakeData2 = {
        site_id: 22222,
        site_name: 'fakeSiteName',
        site_address: '123 Boston, MA'
      };
      var promise = sites.getSites({});

      promise.then(function(data) {
        assert.deepEqual([fakeData1, fakeData2], data);
        done();
      });
    });

    it('gets all sites for a given coach', function(done) {
      var fakeData1 = {
        site_id: 1,
        site_name: 'for the coach',
        site_address: '123 Boston, MA'
      };
      var fakeData2 = {
        site_id: 2,
        site_name: 'also for the coach',
        site_address: '123 Boston, MA'
      };
      var promise = sites.getSites({
        req: {
          query: {
            coach_id: 1
          }
        }
      });

      promise.then(function(data) {
        assert.deepEqual([fakeData1, fakeData2], data);
        done();
      });
    });

    it('create a site', function(done) {
      var fakeData1 = {
        site_id: 88888,
        site_name: 'fakeSiteName',
        site_address: '123 Boston, MA'
      };
      var fakeData2 = {
        site_id: 99999,
        site_name: 'fakeSiteName',
        site_address: '123 Boston, MA'
      };
      var newData = {
        site_id: 77777,
        site_name: 'newSiteName',
        site_address: 'new Boston, MA'
      };
      sites.getSites()
      .then(function(data) {
        assert.deepEqual([fakeData1, fakeData2], data);

        return sites.postSite({
          data: {
            site: {
              site_id: newData.site_id,
              site_name: newData.site_name,
              site_address: newData.site_address
            }
          }
        });
      })
      .then(function() {
        return sites.getSites({});
      })
      .then(function(data) {
        assert.deepEqual([fakeData1, fakeData2, newData], data);
        done();
      });
    });

    it('get a site', function(done) {
      var promise = sites.getSite({
        params: {
          site_id: 12345
        }
      });

      promise.then(function(data) {
        assert.equal({
          site_id: 12345,
          site_name: 'single',
          site_address: 'single Boston, MA'
        }, data[0]);
        done();
      });
    });

    it('updates a site', function(done) {
      site.getSite({
        params: {
          site_id: 54321
        }
      })
      .then(function(data) {
        assert.equal({
          site_id: 54321,
          site_name: 'old name',
          site_address: 'old address'
        }, data[0]);

        return sites.updateSite({
          params: {
            site_id: 54321
          },
          data: {
            updateValues: {
              site_name: 'new name',
              site_address: 'new address'
            }
          }
        });
      })
      .then(function() {
        return site.getSite({
          params: {
            site_id: 54321
          }
        });
      })
      .then(function(data) {
        assert.equal({
          site_id: 54321,
          site_name: 'new name',
          site_address: 'new address'
        }, data[0]);
        done();
      });
    });

    it('delete a site', function(done) {
      sites.getSite({
        params: {
          site_id: 55555
        }
      })
      .then(function(data) {
        assert.equal({
          site_id: 55555,
          site_name: 'to delete',
          site_address: 'Earth'
        }, data[0]);

        return site.deleteSite({
          params: {
            site_id: 55555
          }
        });
      })
      .then(function() {
        return site.getSite({
          params: {
            site_id: 55555
          }
        });
      })
      .then(function(data) {
        assert.equal([{}], data);
        done();
      });
    });
  });
});

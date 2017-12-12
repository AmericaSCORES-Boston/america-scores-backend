'use strict';

const Promise = require('bluebird');
const utils = require('../lib/utils');
const query = utils.query;
const defined = utils.defined;

/**
 * Gets all sites.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getSites(req) {
  return query('SELECT * FROM Site');
}

/**
 * Gets all sites for given account.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getSitesByAccount(req) {
  return query('SELECT site_id, site_name, site_address FROM Acct NATURAL JOIN AcctToProgram NATURAL JOIN Program NATURAL JOIN Site WHERE acct_id = ?', [req.params.account_id]);
}

/**
 * Creates a site.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function createSite(req) {
  if (!defined(req.body) || !defined(req.body.site_name) || !defined(req.body.site_address)) {
    return Promise.reject({
      status: 406,
      message: 'Must provide site\'s name, and address'
    });
  }

  return query('SELECT * FROM Site WHERE site_name = ? AND site_address = ?', [req.body.site_name, req.body.site_address])
    .then(function(rows) {
      if (rows.length > 0) {
        return Promise.reject({
          status: 409,
          message: 'Unable to create site: the site is already in the database'
        });
      }

      return query('INSERT INTO Site (site_name, site_address) VALUES (?, ?)', [req.body.site_name, req.body.site_address]);
    });
}

/**
 * Get a sites with given id.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function getSite(req) {
  return query('SELECT * FROM Site WHERE site_id = ?', [req.params.site_id]);
}

/**
 * Updates a site with given id.
 *
 * @param {Object} req The given request object
 * @return {Promise} The promise
 */
function updateSite(req) {
  if (!defined(req.body) || (!defined(req.body.site_name) && !defined(req.body.site_address))) {
    return Promise.reject({
      status: 406,
      message: 'Must provide site\'s name, or address'
    });
  }

  return Promise.resolve()
    .then(function() {
      if (defined(req.body.site_name)) {
        return query('UPDATE Site SET site_name = ? WHERE site_id = ?', [req.body.site_name, req.params.site_id]);
      }
    })
    .then(function() {
      if (defined(req.body.site_address)) {
        return query('UPDATE Site SET site_address = ? WHERE site_id = ?', [req.body.site_address, req.params.site_id]);
      }
    });
}

/**
 * Deletes a site with given id.
 *
 * @param {Object} req The given request   object
 * @return {Promise} The promise
 */
function deleteSite(req) {
  return query('DELETE FROM Site WHERE site_id = ?', [req.params.site_id]);
}

module.exports = {
  getSites, getSitesByAccount, createSite, getSite, updateSite, deleteSite
};

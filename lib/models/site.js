'use strict';

function Site(site_name, site_address, site_id) {
  this.site_name = site_name;
  this.site_address = site_address;
  this.site_id = site_id === undefined ? null : site_id;
}

module.exports = {
  Site
};

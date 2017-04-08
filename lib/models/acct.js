'use strict';

function Acct(first_name, last_name, email, acct_type, auth0_id, acct_id) {
  this.first_name = first_name;
  this.last_name = last_name;
  this.email = email;
  this.acct_type = acct_type;
  this.auth0_id = auth0_id;
  this.acct_id = acct_id === undefined ? null : acct_id;
}

module.exports = {
  Acct
};

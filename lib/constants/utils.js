'use strict';

const FALL = 'FALL';
const SPRING = 'SPRING';
const NULL = 'NULL';

const ADMIN = 'Admin';
const STAFF = 'Staff';
const COACH = 'Coach';
const VOLUNTEER = 'Volunteer';

// TODO: DELETE FROM HERE DOWN AND USE THE CONSTANTS FROM OTHER FILES THROUGHOUT
const auth0 = require('./auth0');
const ADMIN_AUTH0_ID = auth0.ADMIN_AUTH0_ID;
const COACH_AUTH0_ID = auth0.COACH_AUTH0_ID;
const STAFF_AUTH0_ID = auth0.STAFF_AUTH0_ID;
const VOLUNTEER_AUTH0_ID = auth0.VOLUNTEER_AUTH0_ID;

// Example accounts for all endpoint unit tests
const admin = {
  acct_type: ADMIN,
  first_name: 'Amanda',
  last_name: 'Diggs',
  email: 'adiggs@americascores.org',
  auth0_id: ADMIN_AUTH0_ID
};

const staff = {
  authorization: STAFF,
  first_name: 'Larry',
  last_name: 'Mulligan',
  email: 'lmulligan@americascores.org',
  auth0_id: STAFF_AUTH0_ID
};

const coach = {
  acct_type: COACH,
  first_name: 'Ron',
  last_name: 'Large',
  email: 'ronlarge@americascores.org',
  auth0_id: COACH_AUTH0_ID
};

const volunteer = {
  acct_type: VOLUNTEER,
  first_name: 'Maggie',
  last_name: 'Pam',
  email: 'mp@americascores.org',
  auth0_id: VOLUNTEER_AUTH0_ID
};

module.exports = {
  admin, staff, coach, volunteer,
  FALL,
  SPRING,
  NULL,
  ADMIN,
  STAFF,
  COACH,
  VOLUNTEER,
};

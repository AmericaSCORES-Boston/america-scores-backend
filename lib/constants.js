'use strict';

const ADMIN = 'Admin';
const STAFF = 'Staff';
const COACH = 'Coach';
const VOLUNTEER = 'Volunteer';

const ADMIN_AUTH0_ID = 'auth0|58437948dff6306470568bd5';
const STAFF_AUTH0_ID = 'auth0|584378dda26376e37529be0f';
const COACH_AUTH0_ID = 'auth0|584377c428be27504a2bcf92';
const VOLUNTEER_AUTH0_ID = 'auth0|5843788eda0529cd293da8e3';

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
  ADMIN, STAFF, COACH, VOLUNTEER,
  ADMIN_AUTH0_ID, STAFF_AUTH0_ID, COACH_AUTH0_ID, VOLUNTEER_AUTH0_ID
};

'use strict';
// TODO: REMAKE THE AUTH0 ACCOUNTS AND STICK THE IDEAS IN THE ENVIRONMENT (TRAVIS) OR A .ENV FILE
const ACCT1_AUTH0_ID = 'auth0|584377c428be27504a2bcf92';
const ACCT2_AUTH0_ID = 'auth0|58437854a26376e37529be0d';
const ACCT3_AUTH0_ID = 'auth0|5843788eda0529cd293da8e3';
const ACCT4_AUTH0_ID = 'auth0|584378b528be27504a2bcf98';
const ACCT5_AUTH0_ID = 'auth0|584378dda26376e37529be0f';
const ACCT6_AUTH0_ID = 'auth0|5843790aa7972b6f752e07d9';
const ACCT7_AUTH0_ID = 'auth0|5843792b28be27504a2bcfa0';
const ACCT8_AUTH0_ID = 'auth0|58437948dff6306470568bd5';
const ACCT9_AUTH0_ID = 'auth0|5843796a28be27504a2bcfa1';

const dotenv = require('dotenv');
// Travis doesn't see the .env file; it has the token/domain as env variables already
const fs = require('fs');
if (fs.existsSync('./.env')) {
  dotenv.load();
}

const DEMO_ACCT1_AUTH0_ID = process.env.DEMO_ACCT1_AUTH0_ID;

const ADMIN_AUTH0_ID = ACCT7_AUTH0_ID;
const STAFF_AUTH0_ID = ACCT5_AUTH0_ID;
const COACH_AUTH0_ID = ACCT1_AUTH0_ID;
const VOLUNTEER_AUTH0_ID = ACCT3_AUTH0_ID;

module.exports = {
  ADMIN_AUTH0_ID,
  STAFF_AUTH0_ID,
  COACH_AUTH0_ID,
  VOLUNTEER_AUTH0_ID,

  ACCT1_AUTH0_ID,
  ACCT2_AUTH0_ID,
  ACCT3_AUTH0_ID,
  ACCT4_AUTH0_ID,
  ACCT5_AUTH0_ID,
  ACCT6_AUTH0_ID,
  ACCT7_AUTH0_ID,
  ACCT8_AUTH0_ID,
  ACCT9_AUTH0_ID,

  DEMO_ACCT1_AUTH0_ID,
};

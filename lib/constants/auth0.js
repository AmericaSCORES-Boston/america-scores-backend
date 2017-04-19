'use strict';
const dotenv = require('dotenv');
// Travis doesn't see the .env file; it has the token/domain as env variables already
const fs = require('fs');
if (fs.existsSync('./.env')) {
  dotenv.load();
}

const ACCT1_AUTH0_ID = process.env.ACCT1_AUTH0_ID;
const ACCT2_AUTH0_ID = process.env.ACCT2_AUTH0_ID;
const ACCT3_AUTH0_ID = process.env.ACCT3_AUTH0_ID;
const ACCT4_AUTH0_ID = process.env.ACCT4_AUTH0_ID;
const ACCT5_AUTH0_ID = process.env.ACCT5_AUTH0_ID;
const ACCT6_AUTH0_ID = process.env.ACCT6_AUTH0_ID;
const ACCT7_AUTH0_ID = process.env.ACCT7_AUTH0_ID;
const ACCT8_AUTH0_ID = process.env.ACCT8_AUTH0_ID;
const ACCT9_AUTH0_ID = process.env.ACCT9_AUTH0_ID;

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

'use strict';

const Site = require('./models').Site;
const Student = require('./models').Student;
const Program = require('./models').Program;
const StudentToProgram = require('./models').StudentToProgram;
const Acct = require('./models').Acct;
const AcctToProgram = require('./models').AcctToProgram;
const Event = require('./models').Event;
const Measurement = require('./models').Measurement;

const NULL = 'NULL';

const ADMIN_AUTH0_ID = 'auth0|58437948dff6306470568bd5';
const STAFF_AUTH0_ID = 'auth0|584378dda26376e37529be0f';
const COACH_AUTH0_ID = 'auth0|584377c428be27504a2bcf92';
const VOLUNTEER_AUTH0_ID = 'auth0|5843788eda0529cd293da8e3';

const SITE_1 = new Site('Lin-Manuel Elementary', '1155 Treemont Street, Roxbury Crossing, MA', 1);
const SITE_2 = new Site('Yawkey Boys and Girls Club', '115 Warren St, Roxbury, MA', 2);
const SITE_3 = new Site('Hamilton Elementary', '625 Columbus Avenue, Boston, MA', 3);
const SITE_4 = new Site('Lafayette Middle School', '111 Huntington Avenue, Boston, MA', 4);
const SITE_5 = new Site('Washington Intermediate School', '1776 Beacon Street, Boston, MA', 5);
const SITE_6 = new Site('Schuyler High School', '232 Boylston Street, Boston, MA', 6);
const SITE_7 = new Site('Jefferson Elementary', '72 Kneeland Street, Boston, MA', 7);
const SITE_8 = new Site('Clear Brook High School', '451 Charles Street, Boston, MA', 8);
const SITE_9 = new Site('Amelia Earheart Elementary', '371 Clarendon Street, Boston, MA', 9);
const SITE_10 = new Site('Philip Elementary', '843 Massachusetts Avenue, Boston, MA', 10);
const SITE_11 = new Site('YMCA', '230 Huntington Avenue, Boston, MA', 11);

const SITES = [
  SITE_1,
  SITE_2,
  SITE_3,
  SITE_4,
  SITE_5,
  SITE_6,
  SITE_7,
  SITE_8,
  SITE_9,
  SITE_10,
  SITE_11
];

const STUDENT_1 = new Student('Percy', 'Jackson', '1993-08-18', 1);
const STUDENT_2 = new Student('Annabeth', 'Chase', '1993-07-12', 2);
const STUDENT_3 = new Student('Brian', 'Smith', '1993-04-12', 3);
const STUDENT_4 = new Student('Pam', 'Ho', '1993-04-12', 4);

const PROGRAM_1 = new Program(1, 'LMElementaryBoys', 1);
const PROGRAM_2 = new Program(2, 'YawkeyGirls', 2);
const PROGRAM_3 = new Program(10, 'PHElementaryBoys', 3);
const PROGRAM_4 = new Program(11, 'YMCAGirls', 4);

const STUDENT_TO_PROGRAM_1 = new StudentToProgram(1, 1, 1);
const STUDENT_TO_PROGRAM_2 = new StudentToProgram(2, 1, 2);
const STUDENT_TO_PROGRAM_3 = new StudentToProgram(4, 1, 3);
const STUDENT_TO_PROGRAM_4 = new StudentToProgram(3, 2, 4);

const ACCT_1 = new Acct('Ron', 'Large', 'ronlarge@americascores.org', 'Coach', COACH_AUTH0_ID, 1);
const ACCT_2 = new Acct('Marcel', 'Yogg', 'myogg@americascores.org', 'Coach', 'auth0|58437854a26376e37529be0d', 2);
const ACCT_3 = new Acct('Maggie', 'Pam', 'mp@americascores.org', 'Volunteer', VOLUNTEER_AUTH0_ID, 3);
const ACCT_4 = new Acct('Jeff', 'Nguyen', 'jnguyen@americascores.org', 'Volunteer', 'auth0|584378b528be27504a2bcf98', 4);
const ACCT_5 = new Acct('Larry', 'Mulligan', 'lmulligan@americascores.org', 'Staff', STAFF_AUTH0_ID, 5);
const ACCT_6 = new Acct('Jake', 'Sky', 'blue@americascores.org', 'Staff', 'auth0|5843790aa7972b6f752e07d9', 6);
const ACCT_7 = new Acct('Mark', 'Pam', 'redsoxfan@americascores.org', 'Admin', 'auth0|5843792b28be27504a2bcfa0', 7);
const ACCT_8 = new Acct('Amanda', 'Diggs', 'adiggs@americascores.org', 'Admin', ADMIN_AUTH0_ID, 8);
const ACCT_9 = new Acct('Tom', 'Lerner', 'tlerner@americascores.org', 'Coach', 'auth0|5843796a28be27504a2bcfa1', 9);

const ACCTS = [
  ACCT_1,
  ACCT_2,
  ACCT_3,
  ACCT_4,
  ACCT_5,
  ACCT_6,
  ACCT_7,
  ACCT_8,
  ACCT_9,
];

const ACCT_TO_PROGRAM_1 = new AcctToProgram(7, 1, 1);
const ACCT_TO_PROGRAM_2 = new AcctToProgram(8, 2, 2);
const ACCT_TO_PROGRAM_3 = new AcctToProgram(1, 1, 3);
const ACCT_TO_PROGRAM_4 = new AcctToProgram(1, 2, 4);
const ACCT_TO_PROGRAM_5 = new AcctToProgram(5, 2, 5);
const ACCT_TO_PROGRAM_6 = new AcctToProgram(6, 1, 6);
const ACCT_TO_PROGRAM_7 = new AcctToProgram(3, 2, 7);

const EVENT_1 = new Event(1, '2016-05-19', 1);
const EVENT_2 = new Event(2, '2016-05-18', 2);
const EVENT_3 = new Event(1, '2016-05-19', 3);
const EVENT_4 = new Event(1, '2016-12-02', 4);
const EVENT_5 = new Event(3, '2016-05-19', 5);
const EVENT_6 = new Event(4, '2016-05-19', 6);

const MEASUREMENT_1 = new Measurement(1, 1, 5, 5, 5, 1);
const MEASUREMENT_2 = new Measurement(1, 2, 7, 7, NULL, 2);
const MEASUREMENT_3 = new Measurement(2, 6, 71, 17, 57, 3);
const MEASUREMENT_4 = new Measurement(2, 4, 40, 12, 500, 4);
const MEASUREMENT_5 = new Measurement(2, 2, 44, 16, NULL, 5);
const MEASUREMENT_6 = new Measurement(4, 2, 4, 12, NULL, 6);

const DEMO_STUDENT_1 = new Student('Newt', 'Scamander', '2001-11-09', 5);
const DEMO_STUDENT_2 = new Student('Jacob', 'Kowalski', '1999-03-31', 6);

const DEMO_STUDENT_TO_PROGRAM_1 = new StudentToProgram(4, 2, 5);
const DEMO_STUDENT_TO_PROGRAM_2 = new StudentToProgram(5, 1, 6);
const DEMO_STUDENT_TO_PROGRAM_3 = new StudentToProgram(6, 1, 7);

const REPORT_EVENT_1 = new Event(2, '2016-05-19', 7);

const REPORT_MEASUREMENT_1 = new Measurement(1, 7, 7, 7, 7, 7);
const REPORT_MEASUREMENT_2 = new Measurement(3, 1, 44, 16, 50, 8);
const REPORT_MEASUREMENT_3 = new Measurement(3, 2, 45, 18, 421, 9);


module.exports = {
  SITE_1,
  SITE_2,
  SITE_3,
  SITE_4,
  SITE_5,
  SITE_6,
  SITE_7,
  SITE_8,
  SITE_9,
  SITE_10,
  SITE_11,

  STUDENT_1,
  STUDENT_2,
  STUDENT_3,
  STUDENT_4,

  PROGRAM_1,
  PROGRAM_2,
  PROGRAM_3,
  PROGRAM_4,

  STUDENT_TO_PROGRAM_1,
  STUDENT_TO_PROGRAM_2,
  STUDENT_TO_PROGRAM_3,
  STUDENT_TO_PROGRAM_4,

  ACCT_1,
  ACCT_2,
  ACCT_3,
  ACCT_4,
  ACCT_5,
  ACCT_6,
  ACCT_7,
  ACCT_8,
  ACCT_9,

  ACCT_TO_PROGRAM_1,
  ACCT_TO_PROGRAM_2,
  ACCT_TO_PROGRAM_3,
  ACCT_TO_PROGRAM_4,
  ACCT_TO_PROGRAM_5,
  ACCT_TO_PROGRAM_6,
  ACCT_TO_PROGRAM_7,

  EVENT_1,
  EVENT_2,
  EVENT_3,
  EVENT_4,
  EVENT_5,
  EVENT_6,

  MEASUREMENT_1,
  MEASUREMENT_2,
  MEASUREMENT_3,
  MEASUREMENT_4,
  MEASUREMENT_5,
  MEASUREMENT_6,

  DEMO_STUDENT_1,
  DEMO_STUDENT_2,

  DEMO_STUDENT_TO_PROGRAM_1,
  DEMO_STUDENT_TO_PROGRAM_2,
  DEMO_STUDENT_TO_PROGRAM_3,

  REPORT_EVENT_1,

  REPORT_MEASUREMENT_1,
  REPORT_MEASUREMENT_2,
  REPORT_MEASUREMENT_3,

  ADMIN_AUTH0_ID,
  STAFF_AUTH0_ID,
  COACH_AUTH0_ID,
  VOLUNTEER_AUTH0_ID,

  NULL,

  ACCTS,
  SITES,
};

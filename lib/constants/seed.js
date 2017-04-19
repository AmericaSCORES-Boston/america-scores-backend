'use strict';

const Site = require('../models/site').Site;
const Student = require('../models/student').Student;
const Program = require('../models/program').Program;
const StudentToProgram = require('../models/student_to_program').StudentToProgram;
const Acct = require('../models/acct').Acct;
const AcctToProgram = require('../models/acct_to_program').AcctToProgram;
const Event = require('../models/event').Event;
const Measurement = require('../models/measurement').Measurement;
const Season = require('../models/season').Season;

const utils = require('./utils');
const FALL = utils.FALL;
const SPRING = utils.SPRING;
const ADMIN = utils.ADMIN;
const COACH = utils.COACH;
const STAFF = utils.STAFF;
const VOLUNTEER = utils.VOLUNTEER;

const auth0 = require('./auth0');
const ACCT1_AUTH0_ID = auth0.ACCT1_AUTH0_ID;
const ACCT2_AUTH0_ID = auth0.ACCT2_AUTH0_ID;
const ACCT3_AUTH0_ID = auth0.ACCT3_AUTH0_ID;
const ACCT4_AUTH0_ID = auth0.ACCT4_AUTH0_ID;
const ACCT5_AUTH0_ID = auth0.ACCT5_AUTH0_ID;
const ACCT6_AUTH0_ID = auth0.ACCT6_AUTH0_ID;
const ACCT7_AUTH0_ID = auth0.ACCT7_AUTH0_ID;
const ACCT8_AUTH0_ID = auth0.ACCT8_AUTH0_ID;
const ACCT9_AUTH0_ID = auth0.ACCT9_AUTH0_ID;

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

const TEST_SITES = [
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
];

const STUDENT_1 = new Student('Percy', 'Jackson', '1993-08-18', 1);
const STUDENT_2 = new Student('Annabeth', 'Chase', '1993-07-12', 2);
const STUDENT_3 = new Student('Brian', 'Smith', '1993-04-12', 3);
const STUDENT_4 = new Student('Pam', 'Ho', '1993-04-12', 4);

const TEST_STUDENTS = [
  STUDENT_1,
  STUDENT_2,
  STUDENT_3,
  STUDENT_4,
];

const PROGRAM_1 = new Program(1, 'LMElementaryBoys', 1);
const PROGRAM_2 = new Program(2, 'YawkeyGirls', 2);
const PROGRAM_3 = new Program(10, 'PHElementaryBoys', 3);
const PROGRAM_4 = new Program(11, 'YMCAGirls', 4);

const TEST_PROGRAMS = [
  PROGRAM_1,
  PROGRAM_2,
  PROGRAM_3,
  PROGRAM_4,
];

const STUDENT_TO_PROGRAM_1 = new StudentToProgram(1, 1, 1);
const STUDENT_TO_PROGRAM_2 = new StudentToProgram(2, 1, 2);
const STUDENT_TO_PROGRAM_3 = new StudentToProgram(4, 1, 3);
const STUDENT_TO_PROGRAM_4 = new StudentToProgram(3, 2, 4);

const TEST_STUDENT_TO_PROGRAMS = [
  STUDENT_TO_PROGRAM_1,
  STUDENT_TO_PROGRAM_2,
  STUDENT_TO_PROGRAM_3,
  STUDENT_TO_PROGRAM_4,
];

const ACCT_1 = new Acct('Ron', 'Large', 'asb_test_user_1@americascores.org', COACH, ACCT1_AUTH0_ID, 1);
const ACCT_2 = new Acct('Marcel', 'Yogg', 'asb_test_user_2@americascores.org', COACH, ACCT2_AUTH0_ID, 2);
const ACCT_3 = new Acct('Maggie', 'Pam', 'asb_test_user_3@americascores.org', VOLUNTEER, ACCT3_AUTH0_ID, 3);
const ACCT_4 = new Acct('Jeff', 'Nguyen', 'asb_test_user_4@americascores.org', VOLUNTEER, ACCT4_AUTH0_ID, 4);
const ACCT_5 = new Acct('Larry', 'Mulligan', 'asb_test_user_5@americascores.org', STAFF, ACCT5_AUTH0_ID, 5);
const ACCT_6 = new Acct('Jake', 'Sky', 'asb_test_user_6@americascores.org', STAFF, ACCT6_AUTH0_ID, 6);
const ACCT_7 = new Acct('Mark', 'Pam', 'asb_test_user_7@americascores.org', ADMIN, ACCT7_AUTH0_ID, 7);
const ACCT_8 = new Acct('Amanda', 'Diggs', 'asb_test_user_8@americascores.org', ADMIN, ACCT8_AUTH0_ID, 8);
const ACCT_9 = new Acct('Tom', 'Lerner', 'asb_test_user_9@americascores.org', COACH, ACCT9_AUTH0_ID, 9);

const TEST_ACCTS = [
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

const TEST_ACCT_TO_PROGRAMS = [
  ACCT_TO_PROGRAM_1,
  ACCT_TO_PROGRAM_2,
  ACCT_TO_PROGRAM_3,
  ACCT_TO_PROGRAM_4,
  ACCT_TO_PROGRAM_5,
  ACCT_TO_PROGRAM_6,
  ACCT_TO_PROGRAM_7,
];

const SEASON_1 = new Season(SPRING, 2016, 1);
const SEASON_2 = new Season(FALL, 2016, 2);
const SEASON_3 = new Season(SPRING, 2017, 3);

const TEST_SEASONS = [
  SEASON_1,
  SEASON_2,
  SEASON_3,
];

// NOTE: js months are 0-indexed
const EVENT_1 = new Event(1, 1, new Date(2016, 1, 7), 1, 1);
const EVENT_2 = new Event(2, 1, new Date(2016, 1, 20), 1, 2);
const EVENT_3 = new Event(1, 1, new Date(2016, 4, 19), 0, 3);
const EVENT_4 = new Event(1, 2, new Date(2016, 11, 2), 0, 4);
const EVENT_5 = new Event(3, 1, new Date(2016, 3, 19), 0, 5);
const EVENT_6 = new Event(4, 1, new Date(2016, 1, 15), 1, 6);

const TEST_EVENTS = [
  EVENT_1,
  EVENT_2,
  EVENT_3,
  EVENT_4,
  EVENT_5,
  EVENT_6,
];

const STAT_1 = new Measurement(1, 1, 5, 5, 5, 1);
const STAT_2 = new Measurement(1, 2, 7, 7, null, 2);
const STAT_3 = new Measurement(2, 6, 71, 17, 57, 3);
const STAT_4 = new Measurement(2, 4, 40, 12, 500, 4);
const STAT_5 = new Measurement(2, 2, 44, 16, null, 5);
const STAT_6 = new Measurement(4, 2, 4, 12, null, 6);

const TEST_STATS = [
  STAT_1,
  STAT_2,
  STAT_3,
  STAT_4,
  STAT_5,
  STAT_6,
];

const DEMO_STUDENT_1 = new Student('Alice', 'Cooper', '1999-05-18', 1);
const DEMO_STUDENT_2 = new Student('Danny', 'Hannigan', '1998-12-13', 2);
const DEMO_STUDENT_3 = new Student('Rebecca', 'White', '2000-01-12', 3);
const DEMO_STUDENT_4 = new Student('Mal', 'Hyatt', '1999-03-14', 4);
const DEMO_STUDENT_5 = new Student('Sarah', 'Stein', '1998-04-28', 5);
const DEMO_STUDENT_6 = new Student('Thomas', 'Harris', '1998-02-13', 6);
const DEMO_STUDENT_7 = new Student('Iris', 'Beltrane', '1998-07-06', 7);
const DEMO_STUDENT_8 = new Student('Michael', 'Schmuel', '1998-08-01', 8);
const DEMO_STUDENT_9 = new Student('Elise', 'Rodriguez', '1999-01-30', 9);
const DEMO_STUDENT_10 = new Student('Jared', 'Cunningham', '1999-01-15', 10);
const DEMO_STUDENT_11 = new Student('Natalia', 'Rudova', '2005-12-30', 11);
const DEMO_STUDENT_12 = new Student('Ricky', 'Hayes', '2006-10-26', 12);
const DEMO_STUDENT_13 = new Student('Amaya', 'Heywood', '2007-11-03', 13);
const DEMO_STUDENT_14 = new Student('Ray', 'Jackson', '2006-09-08', 14);
const DEMO_STUDENT_15 = new Student('Cathy', 'Sampson', '2006-07-24', 15);
const DEMO_STUDENT_16 = new Student('George', 'Hardy', '2005-12-31', 16);
const DEMO_STUDENT_17 = new Student('Laurel', 'Rialto', '2007-02-08', 17);
const DEMO_STUDENT_18 = new Student('Charlie', 'Becker', '2006-04-28', 18);
const DEMO_STUDENT_19 = new Student('Olivia', 'Escoboza', '2006-02-19', 19);
const DEMO_STUDENT_20 = new Student('Carter', 'Dixon', '2006-10-11', 20);

const DEMO_STUDENTS = [
  DEMO_STUDENT_1,
  DEMO_STUDENT_2,
  DEMO_STUDENT_3,
  DEMO_STUDENT_4,
  DEMO_STUDENT_5,
  DEMO_STUDENT_6,
  DEMO_STUDENT_7,
  DEMO_STUDENT_8,
  DEMO_STUDENT_9,
  DEMO_STUDENT_10,
  DEMO_STUDENT_11,
  DEMO_STUDENT_12,
  DEMO_STUDENT_13,
  DEMO_STUDENT_14,
  DEMO_STUDENT_15,
  DEMO_STUDENT_16,
  DEMO_STUDENT_17,
  DEMO_STUDENT_18,
  DEMO_STUDENT_19,
  DEMO_STUDENT_20,
];

const DEMO_SITE_1 = new Site('Baker Elementary School', '14 Main Street, Boston, MA, 02132', 1);
const DEMO_SITE_2 = new Site('Turnbull High School', '1882 Harper Way, Boston, MA, 02118', 2);
const DEMO_SITE_3 = new Site('Rainbow Brook High School', '272 Storton Street, Boston, MA, 02136', 3);

const DEMO_SITES = [
  DEMO_SITE_1,
  DEMO_SITE_2,
  DEMO_SITE_3,
];

const DEMO_PROGRAM_1 = new Program(1, 'Baker Girls ES', 1);
const DEMO_PROGRAM_2 = new Program(1, 'Baker Boys ES', 2);
const DEMO_PROGRAM_3 = new Program(2, 'Turnbull SFS', 3);
const DEMO_PROGRAM_4 = new Program(3, 'RB SFS', 4);

const DEMO_PROGRAMS = [
  DEMO_PROGRAM_1,
  DEMO_PROGRAM_2,
  DEMO_PROGRAM_3,
  DEMO_PROGRAM_4,
];

const DEMO_STUDENT_TO_PROGRAM_1 = new StudentToProgram(1, 3, 1);
const DEMO_STUDENT_TO_PROGRAM_2 = new StudentToProgram(2, 3, 2);
const DEMO_STUDENT_TO_PROGRAM_3 = new StudentToProgram(3, 3, 3);
const DEMO_STUDENT_TO_PROGRAM_4 = new StudentToProgram(4, 3, 4);
const DEMO_STUDENT_TO_PROGRAM_5 = new StudentToProgram(5, 3, 5);
const DEMO_STUDENT_TO_PROGRAM_6 = new StudentToProgram(6, 4, 6);
const DEMO_STUDENT_TO_PROGRAM_7 = new StudentToProgram(7, 4, 7);
const DEMO_STUDENT_TO_PROGRAM_8 = new StudentToProgram(8, 4, 8);
const DEMO_STUDENT_TO_PROGRAM_9 = new StudentToProgram(9, 4, 9);
const DEMO_STUDENT_TO_PROGRAM_10 = new StudentToProgram(10, 4, 10);
const DEMO_STUDENT_TO_PROGRAM_11 = new StudentToProgram(11, 1, 11);
const DEMO_STUDENT_TO_PROGRAM_12 = new StudentToProgram(12, 2, 12);
const DEMO_STUDENT_TO_PROGRAM_13 = new StudentToProgram(13, 1, 13);
const DEMO_STUDENT_TO_PROGRAM_14 = new StudentToProgram(14, 2, 14);
const DEMO_STUDENT_TO_PROGRAM_15 = new StudentToProgram(15, 1, 15);
const DEMO_STUDENT_TO_PROGRAM_16 = new StudentToProgram(16, 2, 16);
const DEMO_STUDENT_TO_PROGRAM_17 = new StudentToProgram(17, 1, 17);
const DEMO_STUDENT_TO_PROGRAM_18 = new StudentToProgram(18, 2, 18);
const DEMO_STUDENT_TO_PROGRAM_19 = new StudentToProgram(19, 1, 19);
const DEMO_STUDENT_TO_PROGRAM_20 = new StudentToProgram(20, 2, 20);

const DEMO_STUDENT_TO_PROGRAMS = [
  DEMO_STUDENT_TO_PROGRAM_1,
  DEMO_STUDENT_TO_PROGRAM_2,
  DEMO_STUDENT_TO_PROGRAM_3,
  DEMO_STUDENT_TO_PROGRAM_4,
  DEMO_STUDENT_TO_PROGRAM_5,
  DEMO_STUDENT_TO_PROGRAM_6,
  DEMO_STUDENT_TO_PROGRAM_7,
  DEMO_STUDENT_TO_PROGRAM_8,
  DEMO_STUDENT_TO_PROGRAM_9,
  DEMO_STUDENT_TO_PROGRAM_10,
  DEMO_STUDENT_TO_PROGRAM_11,
  DEMO_STUDENT_TO_PROGRAM_12,
  DEMO_STUDENT_TO_PROGRAM_13,
  DEMO_STUDENT_TO_PROGRAM_14,
  DEMO_STUDENT_TO_PROGRAM_15,
  DEMO_STUDENT_TO_PROGRAM_16,
  DEMO_STUDENT_TO_PROGRAM_17,
  DEMO_STUDENT_TO_PROGRAM_18,
  DEMO_STUDENT_TO_PROGRAM_19,
  DEMO_STUDENT_TO_PROGRAM_20,
];

const DEMO_ACCT_1 = new Acct('Bob', 'Smith', 'asb_demo_user_1@americascores.org', ADMIN, auth0.DEMO_ACCT1_AUTH0_ID, 1);

const DEMO_ACCTS = [
  DEMO_ACCT_1,
];

const DEMO_ACCT_TO_PROGRAM_1 = new AcctToProgram(1, 1, 1);
const DEMO_ACCT_TO_PROGRAM_2 = new AcctToProgram(1, 3, 2);
const DEMO_ACCT_TO_PROGRAM_3 = new AcctToProgram(1, 3, 3);
const DEMO_ACCT_TO_PROGRAM_4 = new AcctToProgram(1, 4, 4);

const DEMO_ACCT_TO_PROGRAMS = [
  DEMO_ACCT_TO_PROGRAM_1,
  DEMO_ACCT_TO_PROGRAM_2,
  DEMO_ACCT_TO_PROGRAM_3,
  DEMO_ACCT_TO_PROGRAM_4,
];

const DEMO_SEASON_1 = new Season(SPRING, 2017, 1);

const DEMO_SEASONS = [
  DEMO_SEASON_1,
];

const DEMO_EVENT_1 = new Event(1, 1, new Date(2017, 0, 16), 1, 1);
const DEMO_EVENT_2 = new Event(1, 1, new Date(2017, 3, 13), 0, 2);
const DEMO_EVENT_3 = new Event(2, 1, new Date(2017, 1, 1), 1, 3);
const DEMO_EVENT_4 = new Event(2, 1, new Date(2017, 5, 17), 0, 4);
const DEMO_EVENT_5 = new Event(3, 1, new Date(2017, 1, 27), 1, 5);
const DEMO_EVENT_6 = new Event(4, 1, new Date(2017, 4, 12), 0, 6);

const DEMO_EVENTS = [
  DEMO_EVENT_1,
  DEMO_EVENT_2,
  DEMO_EVENT_3,
  DEMO_EVENT_4,
  DEMO_EVENT_5,
  DEMO_EVENT_6,
];

// student id, event id, height, weight, pacer, id
const DEMO_STAT_1 = new Measurement(1, 5, 65, 140, 9, 1);
const DEMO_STAT_2 = new Measurement(2, 5, 61, 123, 10, 2);
const DEMO_STAT_3 = new Measurement(3, 5, 58, 105, 11, 3);
const DEMO_STAT_4 = new Measurement(4, 5, 67, 172, 8, 4);
const DEMO_STAT_5 = new Measurement(5, 5, 70, 159, 7, 5);
const DEMO_STAT_6 = new Measurement(6, 6, 71, 182, 12, 6);
const DEMO_STAT_7 = new Measurement(7, 6, 64, 140, 9, 7);
const DEMO_STAT_8 = new Measurement(8, 6, 63, 176, 9, 8);
const DEMO_STAT_9 = new Measurement(9, 6, 72, 174, 10, 9);
const DEMO_STAT_10 = new Measurement(10, 6, 73, 192, 6, 10);
const DEMO_STAT_11 = new Measurement(11, 1, 50, 88, 5, 11);
const DEMO_STAT_12 = new Measurement(11, 2, 50, 90, 4, 12);
const DEMO_STAT_13 = new Measurement(13, 1, 49, 91, 5, 13);
const DEMO_STAT_14 = new Measurement(13, 2, 49, 90, 5, 14);
const DEMO_STAT_15 = new Measurement(15, 1, 46, 88, 5, 15);
const DEMO_STAT_16 = new Measurement(15, 2, 47, 86, 7, 16);
const DEMO_STAT_17 = new Measurement(17, 1, 50, 88, 6, 17);
const DEMO_STAT_18 = new Measurement(17, 2, 51, 87, 7, 18);
const DEMO_STAT_19 = new Measurement(19, 1, 48, 87, 6, 19);
const DEMO_STAT_20 = new Measurement(19, 2, 48, 89, 6, 20);
const DEMO_STAT_21 = new Measurement(12, 3, 42, 77, 5, 21);
const DEMO_STAT_22 = new Measurement(12, 4, 43, 78, 6, 22);
const DEMO_STAT_23 = new Measurement(14, 3, 44, 91, 6, 23);
const DEMO_STAT_24 = new Measurement(14, 4, 44, 89, 7, 24);
const DEMO_STAT_25 = new Measurement(16, 3, 50, 78, 7, 25);
const DEMO_STAT_26 = new Measurement(16, 4, 50, 78, 5, 26);
const DEMO_STAT_27 = new Measurement(18, 3, 46, 82, 5, 27);
const DEMO_STAT_28 = new Measurement(18, 4, 47, 80, 8, 28);
const DEMO_STAT_29 = new Measurement(20, 3, 48, 78, 6, 29);
const DEMO_STAT_30 = new Measurement(20, 4, 49, 80, 9, 30);

const DEMO_STATS = [
  DEMO_STAT_1,
  DEMO_STAT_2,
  DEMO_STAT_3,
  DEMO_STAT_4,
  DEMO_STAT_5,
  DEMO_STAT_6,
  DEMO_STAT_7,
  DEMO_STAT_8,
  DEMO_STAT_9,
  DEMO_STAT_10,
  DEMO_STAT_11,
  DEMO_STAT_12,
  DEMO_STAT_13,
  DEMO_STAT_14,
  DEMO_STAT_15,
  DEMO_STAT_16,
  DEMO_STAT_17,
  DEMO_STAT_18,
  DEMO_STAT_19,
  DEMO_STAT_20,
  DEMO_STAT_21,
  DEMO_STAT_22,
  DEMO_STAT_23,
  DEMO_STAT_24,
  DEMO_STAT_25,
  DEMO_STAT_26,
  DEMO_STAT_27,
  DEMO_STAT_28,
  DEMO_STAT_29,
  DEMO_STAT_30,
];

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

  STAT_1,
  STAT_2,
  STAT_3,
  STAT_4,
  STAT_5,
  STAT_6,

  SEASON_1,
  SEASON_2,
  SEASON_3,

  TEST_ACCTS,
  TEST_SITES,
  TEST_EVENTS,
  TEST_SEASONS,
  TEST_STUDENTS,
  TEST_STUDENT_TO_PROGRAMS,
  TEST_ACCT_TO_PROGRAMS,
  TEST_PROGRAMS,
  TEST_STATS,

  DEMO_STUDENTS,
  DEMO_SITES,
  DEMO_PROGRAMS,
  DEMO_STUDENT_TO_PROGRAMS,
  DEMO_ACCTS,
  DEMO_ACCT_TO_PROGRAMS,
  DEMO_SEASONS,
  DEMO_EVENTS,
  DEMO_STATS,
};

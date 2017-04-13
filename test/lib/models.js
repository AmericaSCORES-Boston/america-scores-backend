'use strict';

const chai = require('chai');
const assert = chai.assert;

const Student = require('../../lib/models/student').Student;
const Site = require('../../lib/models/site').Site;
const Program = require('../../lib/models/program').Program;
const StudentToProgram = require('../../lib/models/student_to_program').StudentToProgram;
const Acct = require('../../lib/models/acct').Acct;
const AcctToProgram = require('../../lib/models/acct_to_program').AcctToProgram;
const Season = require('../../lib/models/season').Season;
const Event = require('../../lib/models/event').Event;
const Measurement = require('../../lib/models/measurement').Measurement;
const ReportRow = require('../../lib/models/report_row').ReportRow;
const ReportRowFromCSV = require('../../lib/models/report_row').ReportRowFromCSV;

const s = require('../../lib/constants/seed');

describe('models', function() {
  describe('Student', function() {
    var first_name = s.STUDENT_1.first_name;
    var last_name = s.STUDENT_1.last_name;
    var dob = s.STUDENT_1.dob;
    var student_id = s.STUDENT_1.student_id;

    it('creates a Student object with no id', function() {
      var test_student = new Student(first_name, last_name, dob);
      assert.equal(test_student.first_name, first_name);
      assert.equal(test_student.last_name, last_name);
      assert.equal(test_student.dob, dob);
      assert.isNull(test_student.student_id);
    });

    it('creates a Student object with an id', function() {
      var test_student = new Student(first_name, last_name, dob, student_id);
      assert.deepEqual(test_student, s.STUDENT_1);
    });
  });

  describe('Site', function() {
    var site_name = s.SITE_1.site_name;
    var site_address = s.SITE_1.site_address;
    var site_id = s.SITE_1.site_id;

    it('creates a Site object with no id', function() {
      var test_site = new Site(site_name, site_address);
      assert.equal(test_site.site_name, site_name);
      assert.equal(test_site.site_address, site_address);
      assert.isNull(test_site.site_id);
    });

    it('creates a Site object with an id', function() {
      var test_site = new Site(site_name, site_address, site_id);
      assert.deepEqual(test_site, s.SITE_1);
    });
  });

  describe('Program', function() {
    var site_id = s.PROGRAM_1.site_id;
    var program_name = s.PROGRAM_1.program_name;
    var program_id = s.PROGRAM_1.program_id;

    it('creates a Program object with no id', function() {
      var test_program = new Program(site_id, program_name);
      assert.equal(test_program.site_id, site_id);
      assert.equal(test_program.program_name, program_name);
      assert.isNull(test_program.program_id);
    });

    it('creates a Program object with an id', function() {
      var test_program = new Program(site_id, program_name, program_id);
      assert.deepEqual(test_program, s.PROGRAM_1);
    });
  });

  describe('StudentToProgram', function() {
    var student_id = s.STUDENT_TO_PROGRAM_1.student_id;
    var program_id = s.STUDENT_TO_PROGRAM_1.program_id;
    var id = s.STUDENT_TO_PROGRAM_1.id;

    it('creates a StudentToProgram object with no id', function() {
      var test_stp = new StudentToProgram(student_id, program_id);
      assert.equal(test_stp.student_id, student_id);
      assert.equal(test_stp.program_id, program_id);
      assert.isNull(test_stp.id);
    });

    it('creates a StudentToProgram object with an id', function() {
      var test_stp = new StudentToProgram(student_id, program_id, id);
      assert.deepEqual(test_stp, s.STUDENT_TO_PROGRAM_1);
    });
  });

  describe('Acct', function() {
    var first_name = s.ACCT_1.first_name;
    var last_name = s.ACCT_1.last_name;
    var email = s.ACCT_1.email;
    var acct_type = s.ACCT_1.acct_type;
    var auth0_id = s.ACCT_1.auth0_id;
    var acct_id = s.ACCT_1.acct_id;

    it('creates a Acct object with no id', function() {
      var test_acct = new Acct(first_name, last_name, email, acct_type, auth0_id);
      assert.equal(test_acct.first_name, first_name);
      assert.equal(test_acct.last_name, last_name);
      assert.equal(test_acct.email, email);
      assert.equal(test_acct.acct_type, acct_type);
      assert.equal(test_acct.auth0_id, auth0_id);
      assert.isNull(test_acct.acct_id);
    });

    it('creates a Acct object with an id', function() {
      var test_acct = new Acct(first_name, last_name, email, acct_type, auth0_id, acct_id);
      assert.deepEqual(test_acct, s.ACCT_1);
    });
  });

  describe('AcctToProgram', function() {
    var acct_id = s.ACCT_TO_PROGRAM_1.acct_id;
    var program_id = s.ACCT_TO_PROGRAM_1.program_id;
    var id = s.ACCT_TO_PROGRAM_1.id;

    it('creates a AcctToProgram object with no id', function() {
      var test_a2p = new AcctToProgram(acct_id, program_id);
      assert.equal(test_a2p.acct_id, acct_id);
      assert.equal(test_a2p.program_id, program_id);
      assert.isNull(test_a2p.id);
    });

    it('creates a AcctToProgram object with an id', function() {
      var test_a2p = new AcctToProgram(acct_id, program_id, id);
      assert.deepEqual(test_a2p, s.ACCT_TO_PROGRAM_1);
    });
  });

  describe('Season', function() {
    var season = s.SEASON_1.season;
    var year = s.SEASON_1.year;
    var season_id = s.SEASON_1.season_id;

    it('creates a Season object with no id', function() {
      var test_season = new Season(season, year);
      assert.equal(test_season.season, season);
      assert.equal(test_season.year, year);
      assert.isNull(test_season.season_id);
    });

    it('creates a Season object with an id', function() {
      var test_season = new Season(season, year, season_id);
      assert.deepEqual(test_season, s.SEASON_1);
    });
  });

  describe('Event', function() {
    var program_id = s.EVENT_1.program_id;
    var season_id = s.EVENT_1.season_id;
    var event_date = s.EVENT_1.event_date;
    var pre_season = s.EVENT_1.pre_season;
    var event_id = s.EVENT_1.event_id;

    it('creates a Event object with no id', function() {
      var test_event = new Event(program_id, season_id, event_date, pre_season);
      assert.equal(test_event.program_id, program_id);
      assert.equal(test_event.season_id, season_id);
      assert.equal(test_event.event_date, event_date);
      assert.equal(test_event.pre_season, pre_season);
      assert.isNull(test_event.event_id);
    });

    it('creates a Event object with an id', function() {
      var test_event = new Event(program_id, season_id, event_date, pre_season, event_id);
      assert.deepEqual(test_event, s.EVENT_1);
    });
  });

  describe('Measurement', function() {
    var student_id = s.STAT_1.student_id;
    var event_id = s.STAT_1.event_id;
    var height = s.STAT_1.height;
    var weight = s.STAT_1.weight;
    var pacer = s.STAT_1.pacer;
    var measurement_id = s.STAT_1.measurement_id;

    it('creates a Measurement object with no id', function() {
      var test_stat = new Measurement(student_id, event_id, height, weight, pacer);
      assert.equal(test_stat.student_id, student_id);
      assert.equal(test_stat.event_id, event_id);
      assert.equal(test_stat.height, height);
      assert.equal(test_stat.weight, weight);
      assert.equal(test_stat.pacer, pacer);
      assert.isNull(test_stat.measurement_id);
    });

    it('creates a Measurement object with an id', function() {
      var test_stat = new Measurement(student_id, event_id, height, weight, pacer, measurement_id);
      assert.deepEqual(test_stat, s.STAT_1);
    });
  });

  describe('ReportRow', function() {
    var student_id = 1;
    var first_name = 'Foo';
    var last_name = 'Bar';
    var site_name = 'Hello';
    var program_name = 'World';

    var pre_date_str = '2017-11-04';
    var pre_date = new Date(2017, 10, 4);
    var pre_height = 60;
    var pre_weight = 150;
    var pre_pacer = 10;

    var post_date_str = '2016-01-04';
    var post_date = new Date(2016, 0, 4);
    var post_height = 61;
    var post_weight = 148;
    var post_pacer = 12;

    describe('ReportRow', function() {
      it('creates a ReportRow object', function() {
        var test_row = new ReportRow(student_id, first_name, last_name, site_name, program_name,
          pre_date, pre_height, pre_weight, pre_pacer, post_date, post_height, post_weight, post_pacer);
        assert.equal(test_row.student_id, student_id);
        assert.equal(test_row.first_name, first_name);
        assert.equal(test_row.last_name, last_name);
        assert.equal(test_row.site_name, site_name);
        assert.equal(test_row.program_name, program_name);
        assert.equal(test_row.pre_date, pre_date);
        assert.equal(test_row.pre_height, pre_height);
        assert.equal(test_row.pre_weight, pre_weight);
        assert.equal(test_row.pre_pacer, pre_pacer);
        assert.equal(test_row.post_date, post_date);
        assert.equal(test_row.post_height, post_height);
        assert.equal(test_row.post_weight, post_weight);
        assert.equal(test_row.post_pacer, post_pacer);
      });
    });

    describe('ReportRowFromCSV', function() {
      var str_id = String(student_id);
      var str_h1 = String(pre_height);
      var str_w1 = String(pre_weight);
      var str_p1 = String(pre_pacer);
      var str_h2 = String(post_height);
      var str_w2 = String(post_weight);
      var str_p2 = String(post_pacer);

      it('creates a ReportRowFromCSV object with null pre- and post-stats', function() {
        var test_row = new ReportRowFromCSV(str_id, first_name, last_name, site_name, program_name,
          'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL');
        assert.equal(test_row.student_id, student_id);
        assert.equal(test_row.first_name, first_name);
        assert.equal(test_row.last_name, last_name);
        assert.equal(test_row.site_name, site_name);
        assert.equal(test_row.program_name, program_name);
        assert.isNull(test_row.pre_date);
        assert.isNull(test_row.pre_height);
        assert.isNull(test_row.pre_weight);
        assert.isNull(test_row.pre_pacer);
        assert.isNull(test_row.post_date);
        assert.isNull(test_row.post_height);
        assert.isNull(test_row.post_weight);
        assert.isNull(test_row.post_pacer);
      });

      it('creates a ReportRowFromCSV object with all stats', function() {
        var test_row = new ReportRowFromCSV(str_id, first_name, last_name, site_name, program_name,
          pre_date_str, str_h1, str_w1, str_p1, post_date_str, str_h2, str_w2, str_p2);
        assert.equal(test_row.student_id, student_id);
        assert.equal(test_row.first_name, first_name);
        assert.equal(test_row.last_name, last_name);
        assert.equal(test_row.site_name, site_name);
        assert.equal(test_row.program_name, program_name);
        assert.equal(test_row.pre_date.getFullYear(), pre_date.getFullYear());
        assert.equal(test_row.pre_date.getMonth(), pre_date.getMonth());
        assert.equal(test_row.pre_date.getDate(), pre_date.getDate());
        assert.equal(test_row.pre_height, pre_height);
        assert.equal(test_row.pre_weight, pre_weight);
        assert.equal(test_row.pre_pacer, pre_pacer);
        assert.equal(test_row.post_date.getFullYear(), post_date.getFullYear());
        assert.equal(test_row.post_date.getMonth(), post_date.getMonth());
        assert.equal(test_row.post_date.getDate(), post_date.getDate());
        assert.equal(test_row.post_height, post_height);
        assert.equal(test_row.post_weight, post_weight);
        assert.equal(test_row.post_pacer, post_pacer);
      });
    });
  });
});

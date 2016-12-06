'use strict';

const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const request = require('supertest');
const Promise = require('bluebird');
const students = require('../routes/students');
const sites = require('../routes/sites');
const programs = require('../routes/programs');
const events = require('../routes/events');
const stats = require('../routes/stats');

describe('app.js', function() {
  var app;

  before(function() {
    app = require('../app');
  });

  after(function() {
    app.close();
  });

  xit('responds to /', function(done) {
    request(app)
      .get('/')
      .expect(405)
      .expect('Route not implemented', done);
  });

  xit('404 everything else', function(done) {
    request(app)
      .get('/foo/bar')
      .expect(404, done)
      .expect('Not Found');
  });

  // TODO create on fly tokens to generate tests.
  describe('authorization failures', function() {
    it('403 missing authorization field in request', function(done) {
      request(app)
        .get('/')
        .set('connection', 'web_app')
        .expect(403)
        .end(done);
    });

    it('400 missing connection field in request', function(done) {
      request(app)
        .get('/')
        .set('authorization', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9saXZlcmhic2NvdHRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVzZXJfaWQiOiJnb29nbGUtb2F1dGgyfDEwMDgwOTUzNTc3MTI0ODk2MjI1NCIsImF1dGhvcml6YXRpb24iOnsidHlwZSI6ImFkbWluIiwiZ3JvdXBzIjpbXX0sImlzcyI6Imh0dHBzOi8vYXNiYWRtaW4uYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAwODA5NTM1NzcxMjQ4OTYyMjU0IiwiYXVkIjoiYXBSNWxITnhvOWhhN2Y4RVI0eXhDZ3NYVU90SzZBbm9LIiwiZXhwIjoxNDgyOTc1MjA5LCJpYXQiOjE0ODA5NzUyMDl9.SqX0v3SQGta2OMgmxVp5_AsgUelcgszn3prZiNwfYHI')
        .expect(400)
        .end(done);
    });

    it('400 connection field is not mobile or web_app', function(done) {
      request(app)
        .get('/')
        .set('authorization', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9saXZlcmhic2NvdHRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVzZXJfaWQiOiJnb29nbGUtb2F1dGgyfDEwMDgwOTUzNTc3MTI0ODk2MjI1NCIsImF1dGhvcml6YXRpb24iOnsidHlwZSI6ImFkbWluIiwiZ3JvdXBzIjpbXX0sImlzcyI6Imh0dHBzOi8vYXNiYWRtaW4uYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAwODA5NTM1NzcxMjQ4OTYyMjU0IiwiYXVkIjoiYXBSNWxITnhvOWhhN2Y4RVI0eXhDZ3NYVU90SzZBbm9LIiwiZXhwIjoxNDgyOTc1MjA5LCJpYXQiOjE0ODA5NzUyMDl9.SqX0v3SQGta2OMgmxVp5_AsgUelcgszn3prZiNwfYHI')
        .set('connection', 'mobilemaybehahahnojkdefnot')
        .expect(400)
        .end(done);
    });

    it('401 authorization failed because an expired token was used', function(done) {
      request(app)
        .get('/')
        .set('authorization', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9saXZlcmhic2NvdHRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVzZXJfaWQiOiJnb29nbGUtb2F1dGgyfDEwMDgwOTUzNTc3MTI0ODk2MjI1NCIsImF1dGhvcml6YXRpb24iOnsidHlwZSI6ImFkbWluIn0sImlzcyI6Imh0dHBzOi8vYXNiYWRtaW4uYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTAwODA5NTM1NzcxMjQ4OTYyMjU0IiwiYXVkIjoiRjhpQlZGMzRLb1RxR2dPZDRmajVENklSU2F4OEpXeHoiLCJleHAiOjE0ODA5NzUyMDksImlhdCI6MTQ4MDk3NTIwOX0.vdy14qdpwFjCpyeZj1de0saO3HkDztxBhoW2Mc-zcFY')
        .set('connection', 'mobile')
        .expect(401)
        .end(done);
    });

    it('401 authorization failed because iss field in JWT is incorrect', function(done) {
      request(app)
        .get('/')
        .set('authorization', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9saXZlcmhic2NvdHRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVzZXJfaWQiOiJnb29nbGUtb2F1dGgyfDEwMDgwOTUzNTc3MTI0ODk2MjI1NCIsImF1dGhvcml6YXRpb24iOnsidHlwZSI6ImFkbWluIn0sImlzcyI6Imh0dHBzOi8vYXNiYWRtaW4uYXV0aDAuY29tL2QiLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMDgwOTUzNTc3MTI0ODk2MjI1NCIsImF1ZCI6IkY4aUJWRjM0S29UcUdnT2Q0Zmo1RDZJUlNheDhKV3h6IiwiZXhwIjoxNTgwOTc1MjA5LCJpYXQiOjE0ODA5NzUyMDl9.n800C_lQ08yt_UXX5mE2ygD0WJ3n1xqRgdASRo3GZl0')
        .set('connection', 'mobile')
        .expect(401)
        .end(done);
    });

    it('401 authorization failed because email_verified !== true', function(done) {
      request(app)
        .get('/')
        .set('authorization', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9saXZlcmhic2NvdHRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJ1c2VyX2lkIjoiZ29vZ2xlLW9hdXRoMnwxMDA4MDk1MzU3NzEyNDg5NjIyNTQiLCJhdXRob3JpemF0aW9uIjp7InR5cGUiOiJhZG1pbiJ9LCJpc3MiOiJodHRwczovL2FzYmFkbWluLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMDgwOTUzNTc3MTI0ODk2MjI1NCIsImF1ZCI6IkY4aUJWRjM0S29UcUdnT2Q0Zmo1RDZJUlNheDhKV3h6IiwiZXhwIjoxNTgwOTc1MjA5LCJpYXQiOjE0ODA5NzUyMDl9.JoOh9bhMMYLSKmS8jqxyWkTIyLvZMYaYXMwRZnADZEs')
        .set('connection', 'mobile')
        .expect(401)
        .end(done);
    });

    it('401 authorization failed because a token with a bad signature was provided', function(done) {
      request(app)
        .get('/')
        .set('authorization', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9saXZlcmhic2NvdHRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJ1c2VyX2lkIjoiZ29vZ2xlLW9hdXRoMnwxMDA4MDk1MzU3NzEyNDg5NjIyNTQiLCJhdXRob3JpemF0aW9uIjp7InR5cGUiOiJhZG1pbiJ9LCJpc3MiOiJodHRwczovL2FzYmFkbWluLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMDgwOTUzNTc3MTI0ODk2MjI1NCIsImF1ZCI6IkY4aUJWRjM0S29UcUdnT2Q0Zmo1RDZJUlNheDhKV3h6IiwiZXhwIjoxNTgwOTc1MjA5LCJpYXQiOjE0ODA5NzUyMDl9.vIvpsxmTdQX-sKpA89ivFjX-w93_Uvw3J2OEUc6fpkw')
        .set('connection', 'web_app')
        .expect(401)
        .end(done);
    });
  });

  describe('students endpoint', function() {
    var getStudentsStub;
    var getStudentStub;
    var deleteStudentStub;
    var updateStudentStub;
    var getStudentsByProgramStub;
    var createStudentStub;
    var getStudentsBySiteStub;
    var getStudentsByEventStub;

    before(function() {
      getStudentsStub = sinon.stub(students, 'getStudents', function() {
        return Promise.resolve('got the students');
      });
      getStudentStub = sinon.stub(students, 'getStudent', function() {
        return Promise.resolve('got the student');
      });
      deleteStudentStub = sinon.stub(students, 'deleteStudent', function() {
        return Promise.resolve('deleted the student');
      });
      updateStudentStub = sinon.stub(students, 'updateStudent', function() {
        return Promise.resolve('updated the student');
      });
      getStudentsByProgramStub = sinon.stub(students, 'getStudentsByProgram', function() {
        return Promise.resolve('got students by a program');
      });
      createStudentStub = sinon.stub(students, 'createStudent', function() {
        return Promise.resolve('created a student');
      });
      getStudentsBySiteStub = sinon.stub(students, 'getStudentsBySite', function() {
        return Promise.resolve('got students by a site');
      });
      getStudentsByEventStub = sinon.stub(students, 'getStudentsByEvent', function() {
        return Promise.resolve('got students by an event');
      });
    });

    after(function() {
      students.getStudents.restore();
      students.getStudent.restore();
      students.deleteStudent.restore();
      students.updateStudent.restore();
      students.getStudentsByProgram.restore();
      students.createStudent.restore();
      students.getStudentsBySite.restore();
      students.getStudentsByEvent.restore();
    });

    xit('GET /students', function(done) {
      request(app)
        .get('/students')
        .expect('got the students', 200)
        .end(function() {
          assert.isTrue(getStudentsStub.called);
          done();
        });
    });

    xit('GET /students/:students_id', function(done) {
      request(app)
        .get('/students/2')
        .expect('got the student', 200)
        .end(function() {
          assert.isTrue(getStudentStub.called);
          done();
        });
    });

    xit('DELETE /students/:students_id', function(done) {
      request(app)
        .delete('/students/4')
        .expect('deleted the student', 200)
        .end(function() {
          assert.isTrue(deleteStudentStub.called);
          done();
        });
    });

    xit('PUT /students/:students_id', function(done) {
      request(app)
        .put('/students/6')
        .expect('updated the student', 200)
        .end(function() {
          assert.isTrue(updateStudentStub.called);
          done();
        });
    });

    xit('PUT /students/:students_id/programs/:program_id', function(done) {
      request(app)
        .put('/students/8/programs/1')
        .expect('updated the student', 200)
        .end(function() {
          assert.isTrue(updateStudentStub.called);
          done();
        });
    });

    xit('GET /programs/:program_id/students', function(done) {
      request(app)
        .get('/programs/1/students')
        .expect('got students for a program', 200)
        .end(function() {
          assert.isTrue(getStudentsByProgramStub.called);
          done();
        });
    });

    xit('POST /programs/:program_id/students', function(done) {
      request(app)
        .post('/programs/3/students')
        .expect('created a student', 200)
        .end(function() {
          assert.isTrue(createStudentStub.called);
          done();
        });
    });

    xit('GET /sites/:site_id/students', function(done) {
      request(app)
        .get('/sites/3/students')
        .expect('got students for a site', 200)
        .end(function() {
          assert.isTrue(getStudentsBySiteStub.called);
          done();
        });
    });

    xit('GET /events/:event_id/students', function(done) {
      request(app)
        .get('/events/32/students')
        .expect('got students for an event', 200)
        .end(function() {
          assert.isTrue(getStudentsByEventStub.called);
          done();
        });
    });
  });

  describe('sites endpoint', function() {
    var getSitesStub;
    var getSitesByAccountStub;
    var createSiteStub;
    var getSiteStub;
    var updateSiteStub;
    var deleteSiteStub;

    before(function() {
      getSitesStub = sinon.stub(sites, 'getSites', function() {
        return Promise.resolve('got the sites');
      });
      getSitesByAccountStub = sinon.stub(sites, 'getSitesByAccount', function() {
        return Promise.resolve('got the students for an account');
      });
      createSiteStub = sinon.stub(sites, 'createSite', function() {
        return Promise.resolve('create a site');
      });
      getSiteStub = sinon.stub(sites, 'getSite', function() {
        return Promise.resolve('got the site');
      });
      updateSiteStub = sinon.stub(sites, 'updateSite', function() {
        return Promise.resolve('updated the site');
      });
      deleteSiteStub = sinon.stub(sites, 'deleteSite', function() {
        return Promise.resolve('deleted the site');
      });
    });

    after(function() {
      sites.getSites.restore();
      sites.getSitesByAccount.restore();
      sites.createSite.restore();
      sites.getSite.restore();
      sites.updateSite.restore();
      sites.deleteSite.restore();
    });

    xit('GET /sites', function(done) {
      request(app)
        .get('/sites')
        .expect('got the sites', 200)
        .end(function() {
          assert.isTrue(getSitesStub.called);
          done();
        });
    });

    xit('GET /accounts/:account_id/sites', function(done) {
      request(app)
        .get('/accounts/:account_id/sites')
        .expect('got the sites for an account', 200)
        .end(function() {
          assert.isTrue(getSitesByAccountStub.called);
          done();
        });
    });

    xit('POST /sites', function(done) {
      request(app)
        .post('/sites')
        .expect('created a site', 200)
        .end(function() {
          assert.isTrue(createSiteStub.called);
          done();
        });
    });

    xit('GET /sites/:site_id', function(done) {
      request(app)
        .get('/sites/4')
        .expect('got the site', 200)
        .end(function() {
          assert.isTrue(getSiteStub.called);
          done();
        });
    });

    xit('PUT /sites/:site_id', function(done) {
      request(app)
        .put('/sites/40')
        .expect('updated the site', 200)
        .end(function() {
          assert.isTrue(updateSiteStub.called);
          done();
        });
    });

    xit('DELETE /sites/:site_id', function(done) {
      request(app)
        .delete('/sites/22')
        .expect('deleted the site', 200)
        .end(function() {
          assert.isTrue(deleteSiteStub.called);
          done();
        });
    });
  });

  describe('programs endpoint', function() {
    var getProgramsStub;
    var getProgramStub;
    var updateProgramStub;
    var deleteProgramStub;
    var getProgramsBySiteStub;
    var createProgramStub;
    var getProgramsByStudentStub;
    var getProgramsByAccountStub;

    before(function() {
      getProgramsStub = sinon.stub(programs, 'getPrograms', function() {
        return Promise.resolve('got the programs');
      });
      getProgramStub = sinon.stub(programs, 'getProgram', function() {
        return Promise.resolve('got the program');
      });
      updateProgramStub = sinon.stub(programs, 'updateProgram', function() {
        return Promise.resolve('updated the program');
      });
      deleteProgramStub = sinon.stub(programs, 'deleteProgram', function() {
        return Promise.resolve('deleted the program');
      });
      getProgramsBySiteStub = sinon.stub(programs, 'getProgramsBySite', function() {
        return Promise.resolve('got the programs for a site');
      });
      createProgramStub = sinon.stub(programs, 'createProgram', function() {
        return Promise.resolve('created a program');
      });
      getProgramsByStudentStub = sinon.stub(programs, 'getProgramsByStudent', function() {
        return Promise.resolve('got the programs for a student');
      });
      getProgramsByAccountStub = sinon.stub(programs, 'getProgramsByAccount', function() {
        return Promise.resolve('got the programs for an account');
      });
    });

    after(function() {
      programs.getPrograms.restore();
      programs.getProgram.restore();
      programs.updateProgram.restore();
      programs.deleteProgram.restore();
      programs.getProgramsBySite.restore();
      programs.createProgram.restore();
      programs.getProgramsByStudent.restore();
      programs.getProgramsByAccount.restore();
    });

    xit('GET /programs', function(done) {
      request(app)
        .get('/programs')
        .expect('got the programs', 200)
        .end(function() {
          assert.isTrue(getProgramsStub.called);
          done();
        });
    });

    xit('GET /programs/:program_id', function(done) {
      request(app)
        .get('/programs/3')
        .expect('got the program', 200)
        .end(function() {
          assert.isTrue(getProgramStub.called);
          done();
        });
    });

    xit('PUT /programs/:program_id', function(done) {
      request(app)
        .put('/programs/3')
        .expect('updated the program', 200)
        .end(function() {
          assert.isTrue(updateProgramStub.called);
          done();
        });
    });

    xit('DELETE /programs/:program_id', function(done) {
      request(app)
        .delete('/programs/3')
        .expect('deleted the program', 200)
        .end(function() {
          assert.isTrue(deleteProgramStub.called);
          done();
        });
    });

    xit('GET /sites/:site_id/programs', function(done) {
      request(app)
        .get('/sites/3/programs')
        .expect('got the programs for a sites', 200)
        .end(function() {
          assert.isTrue(getProgramsBySiteStub.called);
          done();
        });
    });

    xit('POST /sites/:site_id/programs', function(done) {
      request(app)
        .post('/sites/3/programs')
        .expect('created a program', 200)
        .end(function() {
          assert.isTrue(createProgramStub.called);
          done();
        });
    });

    xit('GET /students/:student_id/programs', function(done) {
      request(app)
        .get('/students/3/programs')
        .expect('got the programs for a student', 200)
        .end(function() {
          assert.isTrue(getProgramsByStudentStub.called);
          done();
        });
    });

    xit('GET /accounts/:account_id/programs', function(done) {
      request(app)
        .get('/accounts/32/programs')
        .expect('got the programs for an account', 200)
        .end(function() {
          assert.isTrue(getProgramsByAccountStub.called);
          done();
        });
    });
  });

  describe('events endpoint', function() {
    var getEventsStub;
    var getEventStub;
    var deleteEventStub;
    var getEventsByProgramStub;
    var createEventStub;
    var getEventsByStudentStub;

    before(function() {
      getEventsStub = sinon.stub(events, 'getEvents', function() {
        return Promise.resolve('got the events');
      });
      getEventStub = sinon.stub(events, 'getEvent', function() {
        return Promise.resolve('got the event');
      });
      deleteEventStub = sinon.stub(events, 'deleteEvent', function() {
        return Promise.resolve('deleted the event');
      });
      createEventStub = sinon.stub(events, 'createEvent', function() {
        return Promise.resolve('created an event');
      });
      getEventsByStudentStub = sinon.stub(events, 'getEventsByStudent', function() {
        return Promise.resolve('got the events for a student');
      });
      getEventsByProgramStub = sinon.stub(events, 'getEventsByProgram', function() {
        return Promise.resolve('got the events for a program');
      });
    });

    after(function() {
      events.getEvents.restore();
      events.getEvent.restore();
      events.deleteEvent.restore();
      events.createEvent.restore();
      events.getEventsByStudent.restore();
      events.getEventsByProgram.restore();
    });

    xit('GET /events', function(done) {
      request(app)
        .get('/events')
        .expect('got the events', 200)
        .end(function() {
          assert.isTrue(getEventsStub.called);
          done();
        });
    });

    xit('GET /events/:event_id', function(done) {
      request(app)
        .get('/events/3')
        .expect('got the event', 200)
        .end(function() {
          assert.isTrue(getEventStub.called);
          done();
        });
    });

    xit('DELETE /events/:event_id', function(done) {
      request(app)
        .delete('/events/3')
        .expect('deleted the event', 200)
        .end(function() {
          assert.isTrue(deleteEventStub.called);
          done();
        });
    });

    xit('POST /programs/:program_id/events', function(done) {
      request(app)
        .post('/programs/1/events')
        .expect('created an event', 200)
        .end(function() {
          assert.isTrue(createEventStub.called);
          done();
        });
    });

    xit('GET /students/:student_id/events', function(done) {
      request(app)
        .get('/students/3/events')
        .expect('got the events for a student', 200)
        .end(function() {
          assert.isTrue(getEventsByStudentStub.called);
          done();
        });
    });

    xit('GET /program/:program_id/events', function(done) {
      request(app)
        .get('/programs/1/events')
        .expect('got the events for a program', 200)
        .end(function() {
          assert.isTrue(getEventsByProgramStub.called);
          done();
        });
    });
  });

  describe('stats endpoint', function() {
    var getStatsStub;
    var getStatsBySiteStub;
    var getStatsByProgramStub;
    var getStatsByEventStub;
    var getStatsByStudentStub;
    var uploadPacerStatsStub;
    var uploadBMIStatsStub;

    before(function() {
      getStatsStub = sinon.stub(stats, 'getStats', function() {
        return Promise.resolve('got the stats');
      });
      getStatsBySiteStub = sinon.stub(stats, 'getStatsBySite', function() {
        return Promise.resolve('got the stats for a site');
      });
      getStatsByProgramStub = sinon.stub(stats, 'getStatsByProgram', function() {
        return Promise.resolve('got the stats for a program');
      });
      getStatsByEventStub = sinon.stub(stats, 'getStatsByEvent', function() {
        return Promise.resolve('got the stats for an event');
      });
      getStatsByStudentStub = sinon.stub(stats, 'getStatsByStudent', function() {
        return Promise.resolve('got the stats for a student');
      });
      uploadPacerStatsStub = sinon.stub(stats, 'uploadPacerStats', function() {
        return Promise.resolve('uploaded the pacer stats');
      });
      uploadBMIStatsStub = sinon.stub(stats, 'uploadBMIStats', function() {
        return Promise.resolve('uploaded the BMI stats');
      });
    });

    after(function() {
      stats.getStats.restore();
      stats.getStatsBySite.restore();
      stats.getStatsByProgram.restore();
      stats.getStatsByEvent.restore();
      stats.getStatsByStudent.restore();
      stats.uploadPacerStats.restore();
      stats.uploadBMIStats.restore();
    });

    xit('get /stats', function(done) {
      request(app)
        .get('/stats')
        .expect('got the stats', 200)
        .end(function() {
          assert.isTrue(getStatsStub.called);
          done();
        });
    });

    xit('GET /sites/:site_id/stats', function(done) {
      request(app)
        .get('/sites/1/stats')
        .expect('got the stats for a site', 200)
        .end(function() {
          assert.isTrue(getStatsBySiteStub.called);
          done();
        });
    });

    xit('GET /programs/:program_id/stats', function(done) {
      request(app)
        .get('/programs/1/stats')
        .expect('got the stats for a program', 200)
        .end(function() {
          assert.isTrue(getStatsByProgramStub.called);
          done();
        });
    });

    xit('GET /events/:event_id/stats', function(done) {
      request(app)
        .get('/events/1/stats')
        .expect('got the stats for an event', 200)
        .end(function() {
          assert.isTrue(getStatsByEventStub.called);
          done();
        });
    });

    xit('GET /students/:student_id/stats', function(done) {
      request(app)
        .get('/students/1/stats')
        .expect('got the stats for a student', 200)
        .end(function() {
          assert.isTrue(getStatsByStudentStub.called);
          done();
        });
    });

    xit('PUT /events/:event_id/stats/pacer', function(done) {
      request(app)
        .put('/events/1/stats/pacer')
        .expect('uploaded the pacer stats', 200)
        .end(function() {
          assert.isTrue(uploadPacerStatsStub.called);
          done();
        });
    });

    xit('PUT /events/:event_id/stats/bmi', function(done) {
      request(app)
        .put('/events/1/stats/bmi')
        .expect('uploaded the BMI stats', 200)
        .end(function() {
          assert.isTrue(uploadBMIStatsStub.called);
          done();
        });
    });
  });
});

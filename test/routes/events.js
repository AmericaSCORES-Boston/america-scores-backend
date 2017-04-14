const chai = require('chai');
const assert = chai.assert;

const events = require('../../routes/events');
const seed = require('../../lib/seed').dbSeed;
const constants = require('../../lib/constants/seed');
const getSqlDateString = require('../../lib/utils').getSqlDateString;
const assertEqualError = require('../../lib/test_utils').assertEqualError;
const Event = require('../../lib/models/event').Event;

const EVENTS = constants.TEST_EVENTS;
const EVENT_1 = constants.EVENT_1;
const EVENT_2 = constants.EVENT_2;
const EVENT_3 = constants.EVENT_3;
const EVENT_4 = constants.EVENT_4;

const NEW_EVENT = new Event(1, 1, new Date(2016, 5, 20), 1, 7);


function getEventsTester(func, params, assertion, expected, done) {
  func({
    params: params
  }).then(function(data) {
    assertion(data, expected);
    done();
  });
}

describe('Events', function() {
  before(function(done) {
    seed().then(function() {
      done();
    });
  });

  describe('getEvents(req)', function() {
    it('gets all events', function(done) {
      getEventsTester(events.getEvents, {}, assert.deepEqual, EVENTS, done);
    });
  });

  describe('getEvent(req)', function() {
    it('gets a single event by id', function(done) {
      getEventsTester(events.getEvent, {event_id: 1}, assert.deepEqual, [EVENT_1], done);
    });

    it('returns nothing when the event id DNE', function(done) {
      getEventsTester(events.getEvent, {event_id: -1}, assert.lengthOf, 0, done);
    });
  });

  describe('getEventsByStudent(req)', function() {
    it('gets the events related to a student', function(done) {
      getEventsTester(events.getEventsByStudent, {student_id: 1}, assert.deepEqual, [EVENT_1, EVENT_2], done);
    });

    it('returns no events when the student id does not exist', function(done) {
      getEventsTester(events.getEventsByStudent, {student_id: -1}, assert.lengthOf, 0, done);
    });
  });

  describe('getEventsByProgram(req)', function() {
    it('gets all events related to a program', function(done) {
      getEventsTester(events.getEventsByProgram, {program_id: 1}, assert.deepEqual, [EVENT_1, EVENT_3, EVENT_4], done);
    });

    it('returns no events when the program id does not exist', function(done) {
      getEventsTester(events.getEventsByProgram, {program_id: -1}, assert.lengthOf, 0, done);
    });
  });

  describe('createEvent', function() {
    afterEach(function(done) {
      seed().then(function() {
        done();
      });
    });

    function createEvent(programId, body) {
      return events.createEvent({
        params: {
          program_id: programId
        },
        body: body
      });
    }

    function createEventTester(programId, eventDate, preSeason, assertion, expectedCreated, expectedAll, done) {
      createEvent(programId, {event_date: eventDate, pre_season: preSeason}).then(function(data) {
        assertion(data, [expectedCreated]);
        events.getEvents().then(function(data) {
          assert.deepEqual(data, expectedAll);
          done();
        });
      });
    }

    function createEventErrorTester(body, errName, errStatus, errMsg, done) {
      createEvent(1, body).catch(function(err) {
        assertEqualError(err, errName, errStatus, errMsg);
        done();
      });
    }

    it('creates a new event for the given program', function(done) {
      createEventTester(1, getSqlDateString(NEW_EVENT.event_date), 'true',
        assert.deepEqual, NEW_EVENT, EVENTS.concat([NEW_EVENT]), done);
    });

    it('does not create an event when the program id DNE', function(done) {
      createEventTester(-1, getSqlDateString(NEW_EVENT.event_date), 'false',
        assert.lengthOf, 0, EVENTS, done);
    });

    it('returns a 400 error if the date is malformed', function(done) {
      createEventErrorTester({event_date: '2015/12/12', pre_season: 'true'},
        'Malformed Date Error', 400, 'Malformed date YYYY-MM-DD', done);
    });

    it('returns a 400 error if the pre_season tag is missing', function(done) {
      createEventErrorTester({event_date: '2009-10-14'}, 'Missing Field', 400,
        'Request must have the following component(s): pre_season (body)',
        done);
    });

    it('returns a 400 error if the date is missing', function(done) {
      createEventErrorTester({pre_season: 'false'}, 'Missing Field', 400,
        'Request must have the following component(s): event_date (body)',
        done);
    });
  });

  describe('deleteEvent(req)', function() {
    afterEach(function(done) {
      seed().then(function() {
        done();
      });
    });

    function deleteEventTester(eventId, assertion, expected, expectedAll, done) {
      events.deleteEvent({
        params: {
          event_id: eventId
        }
      }).then(function(data) {
        assertion(data, expected);
        events.getEvents().then(function(data) {
          assert.deepEqual(data, expectedAll);
          done();
        });
      });
    }

    it('deletes an event by id', function(done) {
      deleteEventTester(1, assert.deepEqual, [EVENT_1], EVENTS.slice(1), done);
    });

    it('does nothing when given an invalid event id', function(done) {
      deleteEventTester(-1, assert.lengthOf, 0, EVENTS, done);
    });
  });
});

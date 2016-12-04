const events = require('../../routes/events');
const seed = require('../../lib/utils').seed;
const chai = require('chai');
const assert = chai.assert;

const event1 = {event_id: 1, program_id: 1, acct_id: 1, event_date: new Date(2016, 4, 19)};
const event2 = {event_id: 2, program_id: 2, acct_id: 1, event_date: new Date(2016, 4, 18)};
const event3 = {event_id: 3, program_id: 1, acct_id: 2, event_date: new Date(2016, 4, 19)};
const event4 = {event_id: 4, program_id: 1, acct_id: 1, event_date: new Date(2016, 11, 02)};
const event5 = {event_id: 5, program_id: 3, acct_id: 1, event_date: new Date(2016, 4, 19)};
const event6 = {event_id: 6, program_id: 4, acct_id: 1, event_date: new Date(2016, 4, 19)};
const allEvents = [event1, event2, event3, event4, event5, event6];
const eventsDeleted = [event2, event3, event4, event5, event6];
const newEvent = {event_id: 7, program_id: 1, acct_id: 1, event_date: new Date(2016, 4, 20)};
const eventsNew = [event1, event2, event3, event4, event5, event6, newEvent];

describe('GET', function(done) {
  it('/events', function(done) {
    var req = {
      params: {
      },
    };
    var promise = events.getEvents(req);
    promise.then(function(data) {
      assert.deepEqual(allEvents, data);
      done();
    });
  });
  it('/events/:event_id', function(done) {
    var req = {
      params: {
        event_id: 1
      },
    };
    var promise = events.getEvent(req);
    promise.then(function(data) {
      assert.deepEqual([event1], data);
      done();
    });
  });
  it('/events/:event_id (nonexistent event_id)', function(done) {
    var req = {
      params: {
        event_id: -1
      },
    };
    var promise = events.getEvent(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/events/:event_id (invalid event_id)', function(done) {
    var req = {
      params: {
        event_id: 'id'
      },
    };
    var promise = events.getEvent(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/students/:student_id/events', function(done) {
    var req = {
      params: {
        student_id: 1
      },
    };
    var promise = events.getEventsByStudent(req);
    promise.then(function(data) {
      assert.deepEqual([event1, event2], data);
      done();
    });
  });
  it('/students/:student_id/events (nonexistent student_id)', function(done) {
    var req = {
      params: {
        student_id: -1
      },
    };
    var promise = events.getEventsByStudent(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/students/:student_id/events (invalid student_id)', function(done) {
    var req = {
      params: {
        student_id: 'id'
      },
    };
    var promise = events.getEventsByStudent(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/programs/:program_id/events', function(done) {
    var req = {
      params: {
        program_id: 1
      },
    };
    var promise = events.getEventsByProgram(req);
    promise.then(function(data) {
      assert.deepEqual([event1, event3, event4], data);
      done();
    });
  });
  it('/programs/:program_id/events (nonexistent student_id)', function(done) {
    var req = {
      params: {
        program_id: -1
      },
    };
    var promise = events.getEventsByProgram(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/programs/:program_id/events (invalid student_id)', function(done) {
    var req = {
      params: {
        program_id: 'id'
      },
    };
    var promise = events.getEventsByProgram(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
});

describe('POST', function() {
  before(function(done) {
    seed().then(function() {
      done();
    });
  });
  afterEach(function(done) {
    seed().then(function() {
      done();
    });
  });
  it('/accounts/:acct_id/programs/:program_id/events', function(done) {
    var req = {
      params: {
        account_id: 1,
        program_id: 1
      },
      body: {
        event_date: '2016-05-20'
      }
    };
    var promise = events.createEvent(req);
    promise.then(function(data) {
      events.getEvents().then(function(data) {
        assert.deepEqual(eventsNew, data);
      });
      assert.deepEqual([newEvent], data);
      done();
    });
  });
  it('/accounts/:acct_id/programs/:program_id/events (account + program combo DNE)', function(done) {
    var req = {
      params: {
        account_id: 1,
        program_id: 3
      },
      body: {
        event_date: '2016-05-20'
      }
    };
    events.createEvent(req).then(function(data) {
      events.getEvents().then(function(data) {
        assert.deepEqual(allEvents, data);
      });
      assert.deepEqual([], data);
      done();
    });
  });
  it('/accounts/:acct_id/programs/:program_id/events (invalid id)', function(done) {
    var req = {
      params: {
        account_id: 'id',
        program_id: -3
      },
      body: {
        event_date: '2016-05-20'
      }
    };
    events.createEvent(req).then(function(data) {
      events.getEvents().then(function(data) {
        assert.deepEqual(allEvents, data);
      });
      assert.deepEqual([], data);
      done();
    });
  });
  it('/accounts/:acct_id/programs/:program_id/events (Malformed date)', function(done) {
    var req = {
      params: {
        account_id: 1,
        program_id: 1
      },
      body: {
        event_date: '2016-5-20'
      }
    };
    events.createEvent(req)
    .catch(function(err) {
      assert.equal(err.status, 400);
      assert.equal(err.message, 'Malformed date YYYY-MM-DD');
      done();
    });
  });
  it('/accounts/:acct_id/programs/:program_id/events (No date)', function(done) {
    var req = {
      params: {
        account_id: 1,
        program_id: 1
      },
      body: {
      }
    };
    events.createEvent(req)
    .catch(function(err) {
      assert.equal(err.status, 400);
      assert.equal(err.message, 'Missing event_date');
      done();
    });
  });
});
describe('DELETE', function() {
  before(function(done) {
    seed().then(function() {
      done();
    });
  });
  afterEach(function(done) {
    seed().then(function() {
      done();
    });
  });
  it('/events/:events_id', function(done) {
    var req = {
      params: {
        event_id: 1,
      },
    };
    events.deleteEvent(req).then(function(data) {
      assert.deepEqual([event1], data);
      return events.getEvents();
    })
    .then(function(data) {
      assert.deepEqual(eventsDeleted, data);
      done();
    });
  });
  it('/events/:events_id (nonexistent event_id)', function(done) {
    var req = {
      params: {
        event_id: -1,
      },
    };
    events.deleteEvent(req).then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/events/:events_id (invalid event_id)', function(done) {
    var req = {
      params: {
        event_id: 'id',
      },
    };
    events.deleteEvent(req).then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
});

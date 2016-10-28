// // Set the env to test
process.env.NODE_ENV = 'test';

// // Require the testing dependencies
 //var sinon = require('sinon') // how is sinon used? To check if things are called?
var chai = require('chai');
const sinon = require('sinon');
const assert = require('assert');
const Promise = require('bluebird');
const pool = require('../../config/config').pool;
const stats = require('../../routes/stats')

// StudentStats testing block
describe('utils', function() {
  var poolStub;

  beforeEach(function() {
  });

  afterEach(function() {
    pool.query.restore();
  });

  describe('stats', function() {

    // Get all stats
    it('gets all stats of everyone', function(done) {
      poolStub = sinon.stub(pool, 'query', function() {
        return Promise.resolve([{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
      });
      var promise = stats.getStats({});

      assert(poolStub.called);
      promise.then(function(data) {
        assert.deepEqual(data, [{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
        done();
      });
    });

    // Get all stats at one site
    it('gets all stats of everyone at one site', function(done) {
      poolStub = sinon.stub(pool, 'query', function() {
        return Promise.resolve([{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
      });
      var promise = stats.getStatsFromSite({});

      assert(poolStub.called);
      promise.then(function(data) {
        assert.deepEqual(data, [{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
        done();
      });
    });

    // Get all stats of one student
    it('gets all stats of one student', function(done) {
      poolStub = sinon.stub(pool, 'query', function() {
        return Promise.resolve([{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
      });
      var promise = stats.getStatsOfStudent({});

      assert(poolStub.called);
      promise.then(function(data) {
        assert.deepEqual(data, [{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
        done();
      });
    });

    // Get one set of stats for one student
    it('gets one stats of one student', function(done) {
      poolStub = sinon.stub(pool, 'query', function() {
        return Promise.resolve([{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
      });
      var promise = stats.getOneStatOfStudent({});

      assert(poolStub.called);
      promise.then(function(data) {
        assert.deepEqual(data, [{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
        done();
      });
    });

    //Post a new row of stats into stats database
    it('puts a new stats of a student', function(done) {
      poolStub = sinon.stub(pool, 'query', function() {
        return Promise.resolve([{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
      });
      var promise = stats.postStats({});

      assert(poolStub.called);
      promise.then(function(data) {
        assert.deepEqual(data, [{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
        done();
      });
    });

    // Update existing stats of a student
    it('Updates a stat of a student currently in the database', function(done) {
      poolStub = sinon.stub(pool, 'query', function() {
        return Promise.resolve([{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
      });
      var promise = stats.updateStats({});

      assert(poolStub.called);
      promise.then(function(data) {
        assert.deepEqual(data, [{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
        done();
      });
    });

    // Remove stat
    it('removes a stat of a student currently in the database', function(done) {
      poolStub = sinon.stub(pool, 'query', function() {
        return Promise.resolve([{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
      });
      var promise = stats.deleteStats({});

      assert(poolStub.called);
      promise.then(function(data) {
        assert.deepEqual(data, [{
          stat_id: 'fakeID',
          stat_student_id: 'fakeStudentID',
          stat_event_id: 'fakeEventID',
          stat_weight: 300,
          stat_height: 65,
          state_pacer: 999,
        }]);
        done();
      });
    });
  });
});

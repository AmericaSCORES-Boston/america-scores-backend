// Set the env to test
process.env.NODE_ENV = 'test';

// Require the testing dependencies
var chai = require('chai');
var assert = chai.assert;
var accounts = require('../../routes/accounts');

// Accounts testing block
describe('Accounts', function() {
    beforeEach(function() {
      // clear DB
      // seed data
    });

    describe('/GET accounts', function() {
      it('it should get all accounts', function(done) {
        var promise = accounts.getAccounts({});

        promise.then(function(data) {
          assert.lengthOf(data, 2);
          assert.typeOf(data, 'array');
          assert.deepEqual([{
            id: '1',
            firstName: 'first1',
            lastName: 'last1',
            email: '1@email.com',
            type: 'coach'
          },
          {
            id: '2',
            firstName: 'first2',
            lastName: 'last2',
            email: '2@email.com',
            type: 'admin'
          }], data);
          done();
        });
      });
    });

  describe('/GET account', function() {
    it('it should retrieve a single account', function(done) {
      var promise = accounts.getAccount({
        params: {
          id: '1'
        }
      });

      promise.then(function(data) {
        assert.equal({
          id: '1',
          firstName: 'first1',
          lastName: 'last1',
          email: '1@email.com',
          type: 'coach'
        }, data);
        done();
      });
    });

    it('it should return missing argument error', function(done) {
      var promise = accounts.getAccount({});

      promise.then(function(data) {
        // TODO verify error
        done();
      });
    });
  });

  describe('/PUT account', function() {
    it('it should update an account', function(done) {
      var promise = accounts.updateAccount({
        params: {
          id: '2',
          firstName: 'last2',
          lastName: 'first2',
          email: '2@email.com',
          type: 'admin'
        }
      });

      promise.then(function(data) {
        // TODO verify data updated
        done();
      });
    });

    it('it should return missing argument error', function(done) {
      var promise = accounts.updateAccount({});

      promise.then(function(data) {
        // TODO verify error
        done();
      });
    });
  });

  describe('/POST account', function() {
    it('it should add an account', function(done) {
      var promise = accounts.addAccount({
        params: {
          id: '3',
          firstName: 'first3',
          lastName: 'last3',
          email: '3@email.com',
          type: 'staff'
        }
      });

      promise.then(function(data) {
        // TODO verify account added
        done();
      });
    });

    it('it should return missing argument error', function(done) {
      var promise = accounts.addAccount({});

      promise.then(function(data) {
        // TODO verify error
        done();
      });
    });
  });

  describe('/DELETE account', function() {
    it('it should delete an account', function(done) {
      var promise = deleteAccount({
        params: {
          id: '1'
        }
      });

      promise.then(function(data) {
        // TODO verify delete
        done();
      });
    });

    it('it should return missing argument error', function(done) {
      var promise = deleteAccount({});

      promise.then(function(data) {
        // TODO verify error
        done();
      });
    });
  });
});

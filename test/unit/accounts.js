// Set the env to test
process.env.NODE_ENV = 'test';

// Require the testing dependencies
var chai = require('chai');
var assert = chai.assert;

// Endpoints being tested
var accounts = require('../../routes/accounts');
var accounts = require('../../routes/programs');

// Create testing example data
var first = {
  id: 1,
  firstName: 'first1',
  lastName: 'last1',
  email: '1@email.com',
  type: 'coach'
};

var second = {
  id: 2,
  firstName: 'first2',
  lastName: 'last2',
  email: '2@email.com',
  type: 'admin'
};

var updateSecondReq = {
  data: {
    id: 2,
    firstName: 'UpdatedFirst',
    lastName: 'UpdatedLast',
    email: 'updated@email.com',
    type: 'coach'
  }
};

var updateSecondResp = {
  id: 2,
  firstName: 'UpdatedFirst',
  lastName: 'UpdatedLast',
  email: 'updated@email.com',
  type: 'coach'
};

var newAccountReq = {
  data: {
    firstName: 'first3',
    lastName: 'last3',
    email: '3@email.com',
    type: 'staff'
  }
};

var newAccountResp = {
  id: 3,
  firstName: 'first3',
  lastName: 'last3',
  email: '3@email.com',
  type: 'staff'
};

// bad put request data
var noIDPutReq = {
  data: {
    id: '',
    firstName: 'first',
    lastName: 'last',
    email: 'something@rob.com',
    type: 'staff'
  }
};

var noFNamePutReq = {
  data: {
    id: 1,
    firstName: '',
    lastName: 'last',
    email: 'something@rob.com',
    type: 'staff'
  }
};

var noLNamePutReq = {
  data: {
    id: 1,
    firstName: 'first',
    lastName: '',
    email: 'something@rob.com',
    type: 'staff'
  }
};

var noEmailPutReq = {
  data: {
    id: 1,
    firstName: 'first',
    lastName: 'last',
    email: '',
    type: 'staff'
  }
};

var noTypePutReq = {
  data: {
    id: 1,
    firstName: 'first',
    lastName: 'last',
    email: 'some@thing.com',
    type: ''
  }
};

var badEMailPutReq = {
  data: {
    id: 1,
    firstName: 'first',
    lastName: 'last',
    email: 'something.com',
    type: 'staff'
  }
};

var badTypePutReq = {
  data: {
    id: 1,
    firstName: 'first',
    lastName: 'last',
    email: 'something.com',
    type: 'foo'
  }
};

var badIDPutReq = {
  data: {
    id: 'string',
    firstName: 'first',
    lastName: 'last',
    email: 'something@rob.com',
    type: 'staff'
  }
};

// TODO Verify how we are handling id assignments. Is this test okay?
var idDNEPutReq = {
  data: {
    id: 999999999,
    firstName: 'first',
    lastName: 'last',
    email: 'something@rob.com',
    type: 'staff'
  }
};

var malFormedDataPutReq = {
  data: {
    id: 1,
    firstName: 'first',
    lastName: 'last',
    email: 'some@thing.com',
    type: 'staff',
    extra: 'thing'
  }
};

// bad post request data
var noFNameReq = {
  data: {
    firstName: '',
    lastName: 'last',
    email: 'something@rob.com',
    type: 'staff'
  }
};

var noLNameReq = {
  data: {
    firstName: 'first',
    lastName: '',
    email: 'something@rob.com',
    type: 'staff'
  }
};

var noEmailReq = {
  data: {
    firstName: 'first',
    lastName: 'last',
    email: '',
    type: 'staff'
  }
};

var noTypeReq = {
  data: {
    firstName: 'first',
    lastName: 'last',
    email: 'some@thing.com',
    type: ''
  }
};

var badEMailReq = {
  data: {
    firstName: 'first',
    lastName: 'last',
    email: 'something.com',
    type: 'staff'
  }
};

var badTypeReq = {
  data: {
    firstName: 'first',
    lastName: 'last',
    email: 'something.com',
    type: 'foo'
  }
};

var malFormedDataReq = {
  data: {
    firstName: 'first',
    lastName: 'last',
    email: 'some@thing.com',
    type: 'staff',
    extra: 'thing'
  }
};

// Accounts testing block
describe('Accounts', function() {
    beforeEach(function() {
      // TODO clear DB
      // seed data
    });

    describe('/GET accounts', function() {
      it('it should get all accounts in DB', function(done) {
        var promise = accounts.getAccounts({});

        promise.then(function(data) {
          assert.lengthOf(data, 2);
          assert.typeOf(data, 'array');
          assert.deepEqual([first, second], data);
          done();
        });
      });

      // it('it should get all programs for a specific account',
      //  function(done) {
      //   var promise = accounts.getAccounts({
      //     params: {
      //       prog_id: 1
      //     }
      //   });
      //
      //   promise.then(function(data) {
      //     assert.lengthOf(data, 2);
      //     assert.typeOf(data, 'array');
      //     assert.deepEqual([first, second], data);
      //     done();
      //   });
      // });

      // it('it should get all accounts for a specific site', function(done) {
      //   //TODO
      //   var promise = accounts.getAccounts({});
      //
      //   promise.then(function(data) {
      //     assert.lengthOf(data, 2);
      //     assert.typeOf(data, 'array');
      //     assert.deepEqual([first, second], data);
      //     done();
      //   });
      // });

      // it('it should get all accounts of a specific type', function(done) {
      //   //TODO
      //   var promise = accounts.getAccounts({});
      //
      //   promise.then(function(data) {
      //     assert.lengthOf(data, 2);
      //     assert.typeOf(data, 'array');
      //     assert.deepEqual([first, second], data);
      //     done();
      //   });
      // });
    });

  describe('/GET account', function() {
    it('it should retrieve a single account', function(done) {
      var promise = accounts.getAccount({
        query: {
          id: 1
        }
      });

      promise.then(function(data) {
        assert.deepEqual([first], data);
        done();
      });
    });

    it('it should return missing argument error', function(done) {
      assert.throw(accounts.getAccount({}));
      assert.throw(accounts.getAccount(malFormedDataReq));
      assert.throw(accounts.getAccount({
        params: {
          id: 'bad'
        }
      }));
    });
  });

  describe('/PUT account', function() {
    it('it should update an account', function(done) {
      var promise = accounts.updateAccount(updateSecondReq);

      promise.then(function(data) {
        return accounts.getAccount({
          params: {
            id: 2
          }
        });
      }).then(function(data) {
        assert.equal(updateSecondResp, data);
        done();
      });
    });

    it('it should return missing argument errors', function(done) {
      // missing all fields
      assert.throw(accounts.updateAccount({}));

      // account DNE
      assert.throw(accounts.updateAccount(idDNEPutReq));

      // missing fields
      assert.throw(accounts.updateAccount(noFNamePutReq));
      assert.throw(accounts.updateAccount(noLNamePutReq));
      assert.throw(accounts.updateAccount(noEmailPutReq));
      assert.throw(accounts.updateAccount(noTypePutReq));
      assert.throw(accounts.updateAccount(noIDPutReq));

      // malformed data
      assert.throw(accounts.updateAccount(badIDPutReq));
      assert.throw(accounts.updateAccount(badEMailPutReq));
      assert.throw(accounts.updateAccount(badTypePutReq));
      assert.throw(accounts.updateAccount(malFormedDataPutReq));
    });
  });

  describe('/POST account', function() {
    it('it should add an account', function(done) {
      var req = {data: newAccountReq};
      var accCount;

      var promise = accounts.getAccounts({});
      promise.then(function(data) {
        // get number of accounts in DB before addition
        accCount = data.length;
        // add account
        return accounts.postAccount(req);
      }).then(function(data) {
        // get number of accounts after update
        return accounts.getAccounts({});
      }).then(function(data) {
        // verify new row was added
        assert.lengthOf(data, accCount + 1);
        assert.deepEqual([first, second, newAccountResp], data);
        done();
      });
    });

    it('it should return missing argument error', function(done) {
      // missing all fields
      assert.throws(accounts.addAccount({}));

      // missing fields
      assert.throws(accounts.addAccount(noFNameReq));
      assert.throws(accounts.addAccount(noLNameReq));
      assert.throws(accounts.addAccount(noEmailReq));
      assert.throws(accounts.addAccount(noTypeReq));

      // malformed data
      assert.throws(accounts.addAccount(badTypeReq));
      assert.throws(accounts.addAccount(badEMailReq));
      assert.throws(accounts.addAccount(malFormedDataReq));
    });

    it('it should throw error for trying to add an account that already exists',
    function(done) {
      accounts.addAccount(newAccountReq).then(function(data) {
        assert.throws(accounts.addAccount(newAccountReq));
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

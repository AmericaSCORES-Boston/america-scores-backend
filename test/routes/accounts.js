// Set the env to test
process.env.NODE_ENV = 'test';

// require the testing dependencies
const chai = require('chai');
const assert = chai.assert;

// endpoints being tested
const accounts = require('../../routes/accounts');

// Require seed to reset db before each test
const seed = require('../../lib/utils').seed;

// Require query function for getAllAccounts check
const query = require('../../lib/utils').query;

// Get contents of Accounts table in DB, used for asserts
function getAllAccounts() {
  return query('SELECT * FROM Acct')
}

// starting data from /utils.js.seed()
var acc1 = {
  id: 1,
  f_name: 'Ron',
  l_name: 'Large',
  email: 'ronlarge@gmail.com',
  authorization: 'Coach'
};

var acc2 = {
  id: 2,
  f_name: 'Marcel',
  l_name: 'Yogg',
  email: 'myogg@gmail.com',
  authorization: 'Coach'
};

var acc3 = {
  id: 3,
  f_name: 'Maggie',
  l_name: 'Pam',
  email: 'mp@gmail.com',
  authorization: 'Volunteer'
};

var acc4 = {
  id: 4,
  f_name: 'Jeff',
  l_name: 'Nguyen',
  email: 'jnguyen@gmail.com',
  authorization: 'Volunteer'
};

var acc5 = {
  id: 5,
  f_name: 'Larry',
  l_name: 'Mulligan',
  email: 'lmulligan@gmail.com',
  authorization: 'Staff'
};

var acc6 = {
  id: 6,
  f_name: 'Jake',
  l_name: 'Sky',
  email: 'blue@gmail.com',
  authorization: 'Staff'
};

var acc7 = {
  id: 7,
  f_name: 'Mark',
  l_name: 'Pam',
  email: 'redsoxfan@gmail.com',
  authorization: 'Admin'
};

var acc9 = {
  id: 9,
  f_name: 'Tom',
  l_name: 'Lerner',
  email: 'tlerner@gmail.com',
  authorization: 'Coach'
};

// updated accounts
var acc5_upd = {
  id: 5,
  f_name: 'updatedFirst',
  l_name: 'updatedLast',
  email: 'updated@email.com',
  authorization: 'Admin'
};

// newly created accounts
var newAdminReq = {
  data: {
    f_name: 'first10',
    l_name: 'last10',
    email: '10@email.com',
    authorization: 'Admin'
  }
};

var newAdminRes = {
  id: 10,
  f_name: 'first10',
  l_name: 'last10',
  email: '10@email.com',
  authorization: 'Admin'
};

var newStaffReq = {
  data: {
    f_name: 'first11',
    l_name: 'last11',
    email: '11@email.com',
    authorization: 'Staff'
  }
};

var newStaffRes = {
  id: 11,
  f_name: 'first11',
  l_name: 'last11',
  email: '11@email.com',
  authorization: 'Staff'
};

var newVolunteerReq = {
  data: {
    f_name: 'first12',
    l_name: 'last12',
    email: '12@email.com',
    authorization: 'Volunteer'
  }
};

var newVolunteerRes = {
  id: 12,
  f_name: 'first12',
  l_name: 'last12',
  email: '12@email.com',
  authorization: 'Volunteer'
};

var newCoachReq = {
  data: {
    f_name: 'first13',
    l_name: 'last13
    email: '13@email.com',
    authorization: 'Coach'
  }
};

var newCoachRes = {
  id: 13,
  f_name: 'first13',
  l_name: 'last13',
  email: '13@email.com',
  authorization: 'Coach'
};

// bad put request data
var noIDPutReq = {
  data: {
    id: '',
    f_name: 'first',
    l_name: 'last',
    email: 'something@rob.com',
    authorization: 'Staff'
  }
};

var noFNamePutReq = {
  data: {
    id: 1,
    f_name: '',
    l_name: 'last',
    email: 'something@rob.com',
    authorization: 'Staff'
  }
};

var noLNamePutReq = {
  data: {
    id: 1,
    f_name: 'first',
    l_name: '',
    email: 'something@rob.com',
    authorization: 'Staff'
  }
};

var noEmailPutReq = {
  data: {
    id: 1,
    f_name: 'first',
    l_name: 'last',
    email: '',
    authorization: 'Staff'
  }
};

var badAuthorizationPutReq = {
  data: {
    id: 1,
    f_name: 'first',
    l_name: 'last',
    email: 'some@thing.com',
    authorization: ''
  }
};

var badEMailPutReq = {
  data: {
    id: 1,
    f_name: 'first',
    l_name: 'last',
    email: 'something.com',
    authorization: 'Staff'
  }
};

// bad post request data
var noFNameReq = {
  data: {
    f_name: '',
    l_name: 'last',
    email: 'something@rob.com',
    authorization: 'Staff'
  }
};

var noLNameReq = {
  data: {
    f_name: 'first',
    l_name: '',
    email: 'something@rob.com',
    authorization: 'Staff'
  }
};

var noEmailReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: '',
    authorization: 'staff'
  }
};

var noAuthorizationReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: 'some@thing.com',
    authorization: ''
  }
};

var badEMailReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: 'something.com',
    authorization: 'staff'
  }
};

var badAuthorizationReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: 'something.com',
    authorization: 'foo'
  }
};

/*var malFormedDataReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: 'some@thing.com',
    authorization: 'staff',
    extra: 'thing'
  }
};*/

// Accounts testing block
describe('Accounts', function() {
    beforeEach(function() {
    });

    describe('getAccounts(req)', function() {
      it('it should get all accounts in DB', function(done) {
        // Retrieve all students when req.query.authorization is empty
        var promise = accounts.getAccounts({
          query: {},
          params: {},
          body: {}
        });

        // Confirm entire DB retrieved
        promise.then(function(data) {
          assert.deepEqual([acc1, acc2, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9], data);
          done();
        });
      });

      it('it should get all accounts in DB where authorization=Volunteer', function(done) {
        var promise = accounts.getAccounts({
          query: {
            authorization: 'Volunteer'
          }
        });

        promise.then(function(data) {
          // Check that all Volunteer accounts returned
          assert.deepEqual(data, [acc3, acc4]);
          done();
        });
      });

      it('it should get all accounts in DB where authorization=Staff', function(done) {
        var promise = accounts.getAccounts({
          query: {
            authorization: 'Staff'
          }
        });

        promise.then(function(data) {
          // Check that all Staff accounts returned
          assert.deepEqual(data, [acc5, acc6]);
          done();
        });
      });

      it('it should get all accounts in DB where authorization=Admin', function(done) {
        var promise = accounts.getAccounts({
          query: {
            authorization: 'Admin'
          }
        });

        promise.then(function(data) {
          // Check that all Admin accounts returned
          assert.deepEqual(data, [acc7, acc8]);
          done();
        });
      });

      it('it should get all accounts in DB where authorization=Coach', function(done) {
        var promise = accounts.getAccounts({
          query: {
            authorization: 'Coach'
          }
        });

        promise.then(function(data) {
          // Check that all Staff accounts returned
          assert.deepEqual(data, [acc1, acc2, acc9]);
          done();
        });
      });
    });

  describe('getAccountsByProgram(req)', function(){
      it('it should get all accounts for a specific program', function(done) {
        var promise = accounts.getAccountsByProgram({
          params: {
            program_id: 1
          }
        });

         promise.then(function(data) {
           assert.deepEqual([acc7, acc1, acc6], data);
           done();
         });
       });
  });

  describe('getAccountsBySite(req)', function(){
       it('it should get all accounts for a specific site', function(done) {
         var promise = accounts.getAccountsBySite({
           params: {
             site_id: 1
           }
         });

         promise.then(function(data) {
           assert.deepEqual([acc7, acc1, acc6], data);
           done();
         });
       });

       it('it should get 0 accounts when a site id that DNE is passed', function(done) {
         var promise = accounts.getAccountsBySite({
           params: {
             site_id: 404
           }
         });

         promise.then(function(data) {
           assert.deepEqual([], data);
           done();
         });
       });
    });

  describe('getAccount(req)', function() {
    it('it should retrieve a single account', function(done) {
      var promise = accounts.getAccount({
        query: {
          id: 1
        }
      });

      promise.then(function(data) {
        assert.deepEqual([acc1], data);
        done();
      });
    });

    it('it should retrieve an empty object as acc_id DNE', function (done) {
      var promise = accounts.getAccount({
        query: {
          id: 404
        }
      });

      promise.then(function(data) {
        assert.deepEqual([], data);
        done();
      })
    });
/* TODO - remove malformatting?
    it('it should return missing argument error', function(done) {
      assert.throw(accounts.getAccount({}));
      assert.throw(accounts.getAccount(malFormedDataReq));
      assert.throw(accounts.getAccount({
        params: {
          id: 'bad'
        }
      }));
    });*/
  });

  describe('updateAccount(req)', function() {
    it('it should update an account with all new fields', function(done) {
      var req = {
        params: {
          account_id: 5
        },
        body: {
          f_name: 'updatedFirst',
          l_name: 'updatedLast',
          email: 'updated@email.com',
          authorization: 'Admin'
        }
      };
      accounts.updateAccount(req)
        .then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc5_upd]);

          // check only id 5 was affected
          return getAccounts();
        })
      promise.then(function(data) {
        // check entire db
        assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5_upd, acc6, acc7, acc8, acc9]);
        done();
        });
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
      assert.throw(accounts.updateAccount(noAuthorizationPutReq));
      assert.throw(accounts.updateAccount(noIDPutReq));

      // malformed data
      assert.throw(accounts.updateAccount(badIDPutReq));
      assert.throw(accounts.updateAccount(badEMailPutReq));
      assert.throw(accounts.updateAccount(badAuthorizationPutReq));
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
      assert.throws(accounts.addAccount(noAuthorizationReq));

      // malformed data
      assert.throws(accounts.addAccount(badAuthorizationReq));
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

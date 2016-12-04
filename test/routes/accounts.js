'use strict';
const chai = require('chai'); //testing modules
const assert = chai.assert;
const accounts = require('../../routes/accounts'); //endpoint being tested
// Require seed to reset db before each test
const seed = require('../../lib/utils').seed;

// Require query function for getAllAccounts check
const query = require('../../lib/utils').query;
// Get contents of Accounts table in DB, used for asserts
function getAllAccounts() {
  return query('SELECT * FROM Acct');
}

// objects to store the initial database tables
var initAcc;
var initA2P;

// starting data from /utils.js.seed()
var acc1 = {
  account_id: 1,
  f_name: 'Ron',
  l_name: 'Large',
  email: 'ronlarge@gmail.com',
  authorization: 'Coach'
};

var acc2 = {
  account_id: 2,
  f_name: 'Marcel',
  l_name: 'Yogg',
  email: 'myogg@gmail.com',
  authorization: 'Coach'
};

var acc3 = {
  account_id: 3,
  f_name: 'Maggie',
  l_name: 'Pam',
  email: 'mp@gmail.com',
  authorization: 'Volunteer'
};

var acc4 = {
  account_id: 4,
  f_name: 'Jeff',
  l_name: 'Nguyen',
  email: 'jnguyen@gmail.com',
  authorization: 'Volunteer'
};

var acc5 = {
  account_id: 5,
  f_name: 'Larry',
  l_name: 'Mulligan',
  email: 'lmulligan@gmail.com',
  authorization: 'Staff'
};

var acc6 = {
  account_id: 6,
  f_name: 'Jake',
  l_name: 'Sky',
  email: 'blue@gmail.com',
  authorization: 'Staff'
};

var acc7 = {
  account_id: 7,
  f_name: 'Mark',
  l_name: 'Pam',
  email: 'redsoxfan@gmail.com',
  authorization: 'Admin'
};

var acc9 = {
  account_id: 9,
  f_name: 'Tom',
  l_name: 'Lerner',
  email: 'tlerner@gmail.com',
  authorization: 'Coach'
};

// updated accounts
var acc5_upd = {
  account_id: 5,
  f_name: 'updatedFirst',
  l_name: 'updatedLast',
  email: 'updated@email.com',
  authorization: 'Admin'
};


var acc7_fn_upd = {
  account_id: 7,
  f_name: 'updatedFirst',
  l_name: 'Pam',
  email: 'redsoxfan@gmail.com',
  authorization: 'Admin'
};

var acc7_ln_upd = {
  account_id: 7,
  f_name: 'updatedFirst',
  l_name: 'updatedSecond',
  email: 'redsoxfan@gmail.com',
  authorization: 'Admin'
};

var acc7_email_upd = {
  account_id: 7,
  f_name: 'updatedFirst',
  l_name: 'updatedSecond',
  email: 'updated@gmail.com',
  authorization: 'Admin'
};

var acc7_auth_upd = {
  account_id: 7,
  f_name: 'updatedFirst',
  l_name: 'updatedSecond',
  email: 'updated@gmail.com',
  authorization: 'Staff'
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
  account_id: 10,
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
  account_id: 11,
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
  account_id: 12,
  f_name: 'first12',
  l_name: 'last12',
  email: '12@email.com',
  authorization: 'Volunteer'
};

var newCoachReq = {
  data: {
    f_name: 'first13',
    l_name: 'last13',
    email: '13@email.com',
    authorization: 'Coach'
  }
};

var newCoachRes = {
  account_id: 13,
  f_name: 'first13',
  l_name: 'last13',
  email: '13@email.com',
  authorization: 'Coach'
};

// bad put request data
/*var noIDPutReq = {
  data: {
    account_id: '',
    f_name: 'first',
    l_name: 'last',
    email: 'something@rob.com',
    authorization: 'Staff'
  }
};

var noFNamePutReq = {
  data: {
    account_id: 1,
    f_name: '',
    l_name: 'last',
    email: 'something@rob.com',
    authorization: 'Staff'
  }
};

var noLNamePutReq = {
  data: {
    account_id: 1,
    f_name: 'first',
    l_name: '',
    email: 'something@rob.com',
    authorization: 'Staff'
  }
};

var noEmailPutReq = {
  data: {
    account_id: 1,
    f_name: 'first',
    l_name: 'last',
    email: '',
    authorization: 'Staff'
  }
};

var badAuthorizationPutReq = {
  data: {
    account_id: 1,
    f_name: 'first',
    l_name: 'last',
    email: 'some@thing.com',
    authorization: ''
  }
};

var badEMailPutReq = {
  data: {
    account_id: 1,
    f_name: 'first',
    l_name: 'last',
    email: 'something.com',
    authorization: 'Staff'
  }
};
*/
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

/* var malFormedDataReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: 'some@thing.com',
    authorization: 'staff',
    extra: 'thing'
  }
};*/

// get original states of the database tables
before(function() {
  // Acct table
  getAllAccounts().then(function(data) {
    initAcc = data;

    return query('SELECT * FROM AcctToProgram');
   })
     .then(function(data) {
       // Acct to Program table
       initA2P = data;
     });
});

// Accounts testing block
describe('Accounts', function() {
    beforeEach(function() {
      return seed();
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
          assert.deepEqual(initAcc, data);
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

  describe('getAccountsByProgram(req)', function() {
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

  describe('getAccountsBySite(req)', function() {
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
          account_id: 1
        }
      });

      promise.then(function(data) {
        assert.deepEqual([acc1], data);
        done();
      });
    });

    it('it should retrieve an empty object as acc_id DNE', function(done) {
      var promise = accounts.getAccount({
        query: {
          account_id: 404
        }
      });

      promise.then(function(data) {
        assert.deepEqual([], data);
        done();
      });
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

          return getAccounts();
        });
      promise.then(function(data) {
        // confirm only expected entry was updatedd
        assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5_upd, acc6, acc7, acc8, acc9]);
        done();
        });
      });

    it('it should update an account with a new first name', function(done) {
      var req = {
        params: {
          account_id: 7
        },
        body: {
          f_name: 'updatedFirst',
        }
      };
      accounts.updateAccount(req)
        .then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc7_fn_upd]);

          return getAccounts();
        });
      promise.then(function(data) {
        // confirm only expected entry was updatedd
        assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5, acc6, acc7_fn_upd, acc8, acc9]);
        done();
        });
      });

    it('it should update an account with a new last name', function(done) {
      var req = {
        params: {
          account_id: 7
        },
        body: {
          l_name: 'updatedLast',
        }
      };
      accounts.updateAccount(req)
        .then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc7_ln_upd]);

          return getAccounts();
        });
      promise.then(function(data) {
        // confirm only expected entry was updatedd
        assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5, acc6, acc7_ln_upd, acc8, acc9]);
        done();
        });
      });

    it('it should update an account with a new email', function(done) {
      var req = {
        params: {
          account_id: 7
        },
        body: {
          email: 'updated@gmail.com',
        }
      };
      accounts.updateAccount(req)
        .then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc7_email_upd]);

          return getAccounts();
        });
      promise.then(function(data) {
        // confirm only expected entry was updatedd
        assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5, acc6, acc7_email_updd, acc8, acc9]);
        done();
        });
      });

    it('it should update an account with a new auth level', function(done) {
      var req = {
        params: {
          account_id: 7
        },
        body: {
          authorization: 'Staff',
        }
      };
      accounts.updateAccount(req)
        .then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc7_auth_upd]);

          return getAccounts();
        });
      promise.then(function(data) {
        // confirm only expected entry was updatedd
        assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5, acc6, acc7_auth_upd, acc8, acc9]);
        done();
        });
      });

    it('it should return error err msg because body is missing', function(done) {
      accounts.updateAccount({
        params: {
          account_id: 1
        }
      }).catch(function(err) {
        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);
        assert.equal(err.message, 'Request must have body and params section. Within ' +
        'params a valid account_id must be given. Body should contain updated values ' +
        'for fields to be updated.');

        return getAllAccounts();
      })
        .then(function(data) {
          // confirm no updates were incurred
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });

    it('should not update if request is missing params section', function(done){
      accounts.updateAccount({
        body: {
          f_name: 'Beezlebub'
        }
      })
        .catch(function(err) {
          assert.equal(err.message, 'Request must have body and params section. Within ' +
          'params a valid account_id must be given. Body should contain updated values ' +
          'for fields to be updated.');
          assert.equal(err.name, 'MissingFieldError');
          assert.equal(err.status, 400);

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no changes were made to acc table
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          // confirm no change to acc-to-prog table
          assert.deepEqual(initA2P, data);
          done();
        });
    });

    it('should not update if request is missing account_id in params', function(done){
      accounts.updateAccount({
        params: {
          not_acc_id: 7
        },
        body: {
          f_name: 'Beezlebub'
        }
      })
        .catch(function(err) {
          assert.equal(err.message, 'Request must have body and params section. Within ' +
          'params a valid account_id must be given. Body should contain updated values ' +
          'for fields to be updated.');
          assert.equal(err.name, 'MissingFieldError');
          assert.equal(err.status, 400);

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no changes were made to accounts table
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          // confirm no changes were made to accounts-to-prog table
          assert.deepEqual(data, initA2P);
        });
    });

  describe('createAccount(req)', function() {
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
          account_id: '1'
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

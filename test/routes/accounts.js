'use strict';
const chai = require('chai'); // testing modules
const assert = chai.assert;
const accounts = require('../../routes/accounts'); // endpoint being tested
// const http = requre
// seed to reset db before each test
const seed = require('../../lib/utils').seed;
// constants specifying the given type of account performing the requets
const accType = require('../../lib/constants');
// query function for getAllAccounts check
const query = require('../../lib/utils').query;
const ManagementClient = require('auth0').ManagementClient;
const auth0ID = require('../../lib/utils').getAuth0ID;
const dotenv = require('dotenv');
dotenv.load();
var mgmt = new ManagementClient({
  token: process.env.AUTH0_MANAGEMENT_TOKEN,
  domain: process.env.AUTH0_DOMAIN
});

function getAllAccounts() {
  // Get contents of Accounts table in DB, used for asserts
  return query('SELECT first_name, last_name, email, acct_type FROM Acct');
}

function checkAuth0(userID, expected) {
  // confirms that the user is stored in Auth0s DB as exepcted
  mgmt.users.get({id: userID}, function(err, user) {
    if (user.email === expected.email &&
      user.user_metadata.first_name === expected.f_name &&
      user.user_metadata.last_name === expected.l_name &&
      user.app_metadata.authorization.group === expected.type) {
      return true;
    } else {
      return false;
    }
  });
}

function resetAuth0Acc(resetAcc) {
  // updates the Auth0 account associated with the resetAcc setting all values
  // to those found in resetAcc.
  var params = {id: auth0ID(resetAcc.account_id)};
  // Auth0 app_metadata object
  var app_metadata = {
    authorization: {
      group: resetAcc.type
    }
  };
  // Auth0 user user_metadata object
  var user_metadata = {
    first_name: resetAcc.f_name,
    last_name: resetAcc.l_name
  }
  // core Auth0 user data
  var data = {
    email: resetAcc.email
  }

  // reset user app_metadata
  mgmt.users.updateAppMetaData(params, app_metadata, function(err, user) {
    if (err) {
      console.error('Failed to update Auth0 app_metadata for user');
      console.error(err);
    }
    // reset user user_metadata
    mgmt.users.updateUserMetadata(params, user_metadata, function(err, user) {
      if (err) {
        console.error('Failed to update Auth0 user_metadata for user');
        console.error(err);
      }
      // reset user core Auth0 data
      mgmt.users.update(params, data, function(err, user) {
        if(err) {
          console.error('Failed to update Auth0 core data');
          console.error(err);
        }
      });
    });
  });
}

// objects to store the initial database tables
var initAcc;
var initA2P;

// starting data from /utils.js.seed()
var acc1 = {
  account_id: 1,
  f_name: 'Ron',
  l_name: 'Large',
  email: 'ronlarge@americascores.org',
  type: 'Coach'
};

var acc2 = {
  account_id: 2,
  f_name: 'Marcel',
  l_name: 'Yogg',
  email: 'myogg@americascores.org',
  type: 'Coach'
};

var acc3 = {
  account_id: 3,
  f_name: 'Maggie',
  l_name: 'Pam',
  email: 'mp@americascores.org',
  type: 'Volunteer'
};

var acc4 = {
  account_id: 4,
  f_name: 'Jeff',
  l_name: 'Nguyen',
  email: 'jnguyen@americascores.org',
  type: 'Volunteer'
};

var acc5 = {
  account_id: 5,
  f_name: 'Larry',
  l_name: 'Mulligan',
  email: 'lmulligan@americascores.org',
  type: 'Staff'
};

var acc6 = {
  account_id: 6,
  f_name: 'Jake',
  l_name: 'Sky',
  email: 'blue@americascores.org',
  type: 'Staff'
};

var acc7 = {
  account_id: 7,
  f_name: 'Mark',
  l_name: 'Pam',
  email: 'redsoxfan@americascores.org',
  type: 'Admin'
};

var acc8 = {
  account_id: 8,
  f_name: 'Amanda',
  l_name: 'Diggs',
  email: 'adiggs@americascores.org',
  type: 'Admin'
};

var acc9 = {
  account_id: 9,
  f_name: 'Tom',
  l_name: 'Lerner',
  email: 'tlerner@americascores.org',
  type: 'Coach'
};

// updated accounts
var acc5_upd = {
  account_id: 5,
  f_name: 'updatedFirst',
  l_name: 'updatedLast',
  email: 'updated@email.com',
  type: 'Admin'
};


var acc7_fn_upd = {
  account_id: 7,
  f_name: 'updatedFirst',
  l_name: 'Pam',
  email: 'redsoxfan@americascores.org',
  type: 'Admin'
};

var acc7_ln_upd = {
  account_id: 7,
  f_name: 'Mark',
  l_name: 'updatedSecond',
  email: 'redsoxfan@americascores.org',
  type: 'Admin'
};

var acc7_email_upd = {
  account_id: 7,
  f_name: 'Mark',
  l_name: 'Pam',
  email: 'updated@americascores.org',
  type: 'Admin'
};

var acc7_auth_upd = {
  account_id: 7,
  f_name: 'Mark',
  l_name: 'Pam',
  email: 'redsoxfan@americascores.org',
  type: 'Staff'
};

var newAdminRes = {
  account_id: 10,
  f_name: 'first10',
  l_name: 'last10',
  email: '10@email.com',
  type: 'Admin'
};

var newStaffReq = {
  data: {
    f_name: 'first11',
    l_name: 'last11',
    email: '11@email.com',
    type: 'Staff'
  },
  user: accType.Admin
};

var newStaffRes = {
  account_id: 11,
  f_name: 'first11',
  l_name: 'last11',
  email: '11@email.com',
  type: 'Staff'
};

var newVolunteerReq = {
  data: {
    f_name: 'first12',
    l_name: 'last12',
    email: '12@email.com',
    type: 'Volunteer'
  },
  user: accType.Admin
};

var newVolunteerRes = {
  account_id: 12,
  f_name: 'first12',
  l_name: 'last12',
  email: '12@email.com',
  type: 'Volunteer'
};

var newCoachReq = {
  data: {
    f_name: 'first13',
    l_name: 'last13',
    email: '13@email.com',
    type: 'Coach'
  },
  user: accType.Admin
};

var newCoachRes = {
  account_id: 13,
  f_name: 'first13',
  l_name: 'last13',
  email: '13@email.com',
  type: 'Coach'
};

// bad put request data
/* var noIDPutReq = {
  data: {
    account_id: '',
    f_name: 'first',
    l_name: 'last',
    email: 'something@rob.com',
    type: 'Staff'
  }
};

var noFNamePutReq = {
  data: {
    account_id: 1,
    f_name: '',
    l_name: 'last',
    email: 'something@rob.com',
    type: 'Staff'
  }
};

var noLNamePutReq = {
  data: {
    account_id: 1,
    f_name: 'first',
    l_name: '',
    email: 'something@rob.com',
    type: 'Staff'
  }
};

var noEmailPutReq = {
  data: {
    account_id: 1,
    f_name: 'first',
    l_name: 'last',
    email: '',
    type: 'Staff'
  }
};

var badtypePutReq = {
  data: {
    account_id: 1,
    f_name: 'first',
    l_name: 'last',
    email: 'some@thing.com',
    type: ''
  }
};

var badEMailPutReq = {
  data: {
    account_id: 1,
    f_name: 'first',
    l_name: 'last',
    email: 'something.com',
    type: 'Staff'
  }
};
*/
// bad post request data
var noFNameReq = {
  data: {
    f_name: '',
    l_name: 'last',
    email: 'something@rob.com',
    type: 'Staff'
  }
};

var noLNameReq = {
  data: {
    f_name: 'first',
    l_name: '',
    email: 'something@rob.com',
    type: 'Staff'
  }
};

var noEmailReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: '',
    type: 'staff'
  }
};

var notypeReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: 'some@thing.com',
    type: ''
  }
};

var badEMailReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: 'something.com',
    type: 'staff'
  }
};

var badtypeReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: 'something.com',
    type: 'foo'
  }
};

/* var malFormedDataReq = {
  data: {
    f_name: 'first',
    l_name: 'last',
    email: 'some@thing.com',
    type: 'staff',
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

beforeEach(function() {
  return seed();
});

describe('Accounts', function() {
  describe('getAccounts(req)', function() {
    it('it should get all accounts in DB when requested by an admin', function(done) {
      // Retrieve all students when req.query.type is empty
      var promise = accounts.getAccounts({
        query: {},
        params: {},
        body: {},
        user: accType.Admin
      });

      // Confirm entire DB retrieved
      promise.then(function(data) {
        assert.deepEqual(initAcc, data);
        done();
      });
    });

    it('it should return a 401 error because staff cannot request accounts', function(done) {
      var promise = accounts.getAccounts({
        query: {},
        params: {},
        body: {},
        user: accType.Staff
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'Unauthorized');
        assert.equal(err.status, 401);
        assert.equal(err.message, 'Request denied, insufficient authorization ' +
          'supplied.');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initacc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });

    it('it should return a 401 error because coaches cannot request accounts', function(done) {
      var promise = accounts.getAccounts({
        params: {
          account_id: 7
        },
        body: {
          f_name: 'Beezlebub'
        },
        user: accType.Coach
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'Unauthorized');
        assert.equal(err.status, 401);
        assert.equal(err.message, 'Request denied, insufficient authorization ' +
          'supplied.');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });

    it('it should return a 401 error because volunteers cannot request accounts', function(done) {
      var promise = accounts.getAccounts({
        query: {},
        params: {},
        body: {},
        user: accType.Volunteer
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'Unauthorized');
        assert.equal(err.status, 401);
        assert.equal(err.message, 'Request denied, insufficient authorization ' +
          'supplied.');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });

    it('it should get all accounts in DB where type=Volunteer', function(done) {
      var promise = accounts.getAccounts({
        query: {
          type: 'Volunteer',
        },
        user: accType.Admin
      });

      promise.then(function(data) {
        // Check that all Volunteer accounts returned
        assert.deepEqual(data, [acc3, acc4]);
        done();
      });
    });

    it('it should get all accounts in DB where type=Staff', function(done) {
      var promise = accounts.getAccounts({
        query: {
          type: 'Staff',
        },
        user: accType.Admin
      });

      promise.then(function(data) {
        // Check that all Staff accounts returned
        assert.deepEqual(data, [acc5, acc6]);
        done();
      });
    });

    it('it should get all accounts in DB where type=Admin', function(done) {
      var promise = accounts.getAccounts({
        query: {
          type: 'Admin',
        },
        user: accType.Admin
      });

      promise.then(function(data) {
        // Check that all Admin accounts returned
        assert.deepEqual(data, [acc7, acc8]);
        done();
      });
    });

    it('it should get all accounts in DB where type=Coach', function(done) {
      var promise = accounts.getAccounts({
        query: {
          type: 'Coach'
        },
        user: accType.Admin
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
        },
        user: accType.Admin
      });

      promise.then(function(data) {
        assert.deepEqual([acc7, acc1, acc6], data);
        done();
      });
    });

    it('it should return a 401 error because staff cannot request accounts', function(done) {
      var promise = accounts.getAccountsByProgram({
        params: {
          program_id: 1
        },
        user: accType.Staff
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'Unauthorized');
        assert.equal(err.status, 401);
        assert.equal(err.message, 'Request denied, insufficient authorization ' +
          'supplied.');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initacc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });

    it('it should return a 401 error because coaches cannot request accounts', function(done) {
      var promise = accounts.getAccountsByProgram({
        params: {
          program_id: 1
        },
        user: accType.Coachach
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'Unauthorized');
        assert.equal(err.status, 401);
        assert.equal(err.message, 'Request denied, insufficient authorization ' +
          'supplied.');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });

    it('it should return a 401 error because volunteers cannot request accounts', function(done) {
      var promise = accounts.getAccountsByProgram({
        params: {
          program_id: 1
        },
        user: accType.Volunteer
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'Unauthorized');
        assert.equal(err.status, 401);
        assert.equal(err.message, 'Request denied, insufficient authorization ' +
          'supplied.');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });
  });

  describe('getAccountsBySite(req)', function() {
    it('it should get all accounts for a specific site', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 1
        },
        user: accType.Admin
      });

      promise.then(function(data) {
        assert.deepEqual([acc7, acc1, acc6], data);
        done();
      });
    });

    it('it should get 0 accounts when a site id that DNE is passed', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 999
        },
        user: accType.Admin
      });

      promise.then(function(data) {
        assert.deepEqual([], data);
        done();
      });
    });

    it('it should return a 401 error because staff cannot request accounts', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 1
        },
        user: accType.Staff
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'Unauthorized');
        assert.equal(err.status, 401);
        assert.equal(err.message, 'request denied, insufficient authorization ' +
          'supplied.');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initacc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });

    it('it should return a 401 error because coaches cannot request accounts', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 1
        },
        user: accType.Coachach
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'Unauthorized');
        assert.equal(err.status, 401);
        assert.equal(err.message, 'request denied, insufficient authorization ' +
          'supplied.');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });

    it('it should return a 401 error because volunteers cannot request accounts', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 1
        },
        user: accType.Volunteer
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'Unauthorized');
        assert.equal(err.status, 401);
        assert.equal(err.message, 'Request denied, insufficient authorization ' +
          'supplied.');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(initA2P, data);
          done();
        });
    });
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
            type: 'Admin'
          },
          user: accType.Admin
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
          // confirm update received in Auth0
          assert.isTrue(checkAuth0(auth0ID(5)), acc5_upd);
          // reset the account to previous Auth0 values
          resetAuth0Acc(acc5);
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
          },
          user: accType.Admin
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
          // confirm update received in Auth0
          assert.isTrue(checkAuth0(auth0ID(7)), acc7_fn_upd);
          // reset the account to the previous Auth0 values
          resetAuth0Acc(acc7);
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
          },
          user: accType.Admin
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
          // confirm update received in Auth0
          assert.isTrue(checkAuth0(auth0ID(7)), acc7_ln_upd);
          // reset the account to the previous Auth0 values
          resetAuth0Acc(acc7);
          done();
        });
      });

      it('it should update an account with a new email', function(done) {
        var req = {
          params: {
            account_id: 7
          },
          body: {
            email: 'updated@americascores.org',
          },
          user: accType.Admin
        };
        accounts.updateAccount(req)
          .then(function(data) {
            // check that updated account is returned
            assert.deepEqual(data, [acc7_email_upd]);

            return getAccounts();
          });
        promise.then(function(data) {
          // confirm only expected entry was updatedd
          assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5, acc6, acc7_email_upd, acc8, acc9]);
          // confirm update received in Auth0
          assert.isTrue(checkAuth0(auth0ID(7)), acc7_email_upd);
          // reset the account to the previous Auth0 values
          resetAuth0Acc(acc7);
          done();
        });
      });

      it('it should update an account with a new auth level', function(done) {
        var req = {
          params: {
            account_id: 7
          },
          body: {
            type: 'Staff',
          },
          user: accType.Admin
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
          // confirm update received in Auth0
          assert.isTrue(checkAuth0(auth0ID(7)), acc7_auth_upd);
          // reset the account to the previous Auth0 values
          resetAuth0Acc(acc7);
          done();
        });
      });

      it('it should return error err msg because body is missing', function(done) {
        accounts.updateAccount({
          params: {
            account_id: 1
          },
          user: accType.Admin
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
            // confirm account was not affected
            assert.isTrue(checkAuth0(auth0ID(1)), acc1);
            // reset the account to the previous Auth0 values
            resetAuth0Acc(acc1);
            done();
          });
      });

      it('should not update if request is missing params section', function(done) {
        // TODO create test to ensure Auth0 is the same before and after
        accounts.updateAccount({
          body: {
            f_name: 'Beezlebub'
          },
          user: accType.Admin
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

      it('should not update if request is missing account_id in params', function(done) {
        // TODO ensure entire Auth0 DB has not been affected
        accounts.updateAccount({
          params: {
            not_acc_id: 7
          },
          body: {
            f_name: 'Beezlebub'
          },
          user: accType.Admin
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

      it('it should return a 401 error because staff cannot update other accounts', function(done) {
        var promise = accounts.updateAccount({
          params: {
            account_id: 7
          },
          body: {
            f_name: 'Beezlebub'
          },
          user: accType.Staff
        });

        promise.catch(function(err) {
          assert.equal(err.name, 'Unauthorized');
          assert.equal(err.status, 401);
          assert.equal(err.message, 'Request denied, insufficient authorization ' +
            'supplied.');

          return getAllAccounts();
        })
          .then(function(data) {
            assert.deepEqual(data, initAcc);

            return query('SELECT * FROM AcctToProgram');
          })
          .then(function(data) {
            // confirm table was unaffected
            assert.deepEqual(initA2P, data);
            // reset the account to the previous Auth0 values
            resetAuth0Acc(acc7);
            done();
          });
      });

      it('it should return a 401 error because coaches cannot update other accounts', function(done) {
        var promise = accounts.updateAccount({
          params: {
            acc_id: 7
          },
          body: {
            f_name: 'Beezlebub'
          },
          user: accType.Coach
        });

        promise.catch(function(err) {
          assert.equal(err.name, 'Unauthorized');
          assert.equal(err.status, 401);
          assert.equal(err.message, 'Request denied, insufficient authorization ' +
            'supplied.');

          return getAllAccounts();
        })
          .then(function(data) {
            assert.deepEqual(data, initAcc);

            return query('select * from AcctToProgram');
          })
          .then(function(data) {
            // confirm table was unaffected
            assert.deepEqual(initA2P, data);
            // reset the account to the previous Auth0 values
            resetAuth0Acc(acc7);
            done();
          });
      });

      it('it should return a 401 error because volunteers cannot update other accounts', function(done) {
        var promise = accounts.updateAccount({
          params: {
            acc_id: 7
          },
          body: {
            f_name: 'Beezlebub'
          },
          user: accType.Volunteer
        });

        promise.catch(function(err) {
          assert.equal(err.name, 'Unauthorized');
          assert.equal(err.status, 401);
          assert.equal(err.message, 'Request denied, insufficient authorization ' +
            'supplied.');

          return getAllAccounts();
        })
          .then(function(data) {
            assert.deepEqual(data, initAcc);

            return query('SELECT * FROM AcctToProgram');
          })
          .then(function(data) {
            // confirm table was unaffected
            assert.deepEqual(initA2P, data);
            // reset the account to the previous Auth0 values
            resetAuth0Acc(acc7);
            done();
          });
      });

      it('it should return a 401 error because staff cannot update their own type', function(done) {
        var promise = accounts.updateAccount({
          params: {
            acc_id: 5  // id for the accType.Staff constant
          },
          body: {
            type: 'Admin'
          },
          user: accType.Staff
        });

        promise.catch(function(err) {
          assert.equal(err.name, 'Unauthorized');
          assert.equal(err.status, 401);
          assert.equal(err.message, 'Request denied, insufficient authorization ' +
            'supplied.');

          return getAllAccounts();
        })
          .then(function(data) {
            assert.deepEqual(data, initacc);

            return query('SELECT * FROM AcctToProgram');
          })
          .then(function(data) {
            assert.deepEqual(inita2p, data);
            // reset the account to the previous Auth0 values
            resetAuth0Acc(acc5);
            done();
          });
      });

      it('it should return a 401 error because coaches cannot update cannot update their own type', function(done) {
        var promise = accounts.updateAccount({
          params: {
            acc_id: 1 // id for the accType.Coach constant
          },
          body: {
            f_name: 'Beezlebub'
          },
          user: accType.Coach
        });

        promise.catch(function(err) {
          assert.equal(err.name, 'Unauthorized');
          assert.equal(err.status, 401);
          assert.equal(err.message, 'Request denied, insufficient authorization ' +
            'supplied.');

          return getAllAccounts();
        })
          .then(function(data) {
            assert.deepEqual(data, initAcc);

            return query('SELECT * FROM AcctToProgram');
          })
          .then(function(data) {
            // confirm table was unaffected
            assert.deepEqual(initA2P, data);
            // reset the account to the previous Auth0 values
            resetAuth0Acc(acc1);
            done();
          });
      });

      it('it should return a 401 error because volunteers cannot update their own type', function(done) {
        var promise = accounts.updateAccount({
          params: {
            acc_id: 3 // id for the accType.Volunteer constant
          },
          body: {
            f_name: 'Beezlebub'
          },
          user: accType.Volunteer
        });

        promise.catch(function(err) {
          assert.equal(err.name, 'Unauthorized');
          assert.equal(err.status, 401);
          assert.equal(err.message, 'Request denied, insufficient authorization ' +
            'supplied.');

          return getAllAccounts();
        })
          .then(function(data) {
            // confirm table was unaffected
            assert.deepEqual(data, initAcc);

            return query('SELECT * FROM AcctToProgram');
          })
          .then(function(data) {
            // confirm table was unaffectd
            assert.deepEqual(initA2P, data);
            // reset the account to the previous Auth0 values
            resetAuth0Acc(acc3);
            done();
          });
      });

      it('it should allow volunteers to update their own email and name', function(done) {
        var newFName = 'Beezlebub';
        var newLName = 'Smith';
        var newEmail = 'updated@americascores.org';
        var promise = accounts.updateAccount({
          params: {
            acc_id: 3 // id for the accType.Volunteer constant
          },
          body: {
            f_name: newFName,
            l_name: newLName,
            email: newEmail
          },
          user: accType.Volunteer
        });

        // update acc3 object to match
        acc3.f_name = newFName;
        acc3.l_name = newLName;
        acc3.l_name = newEmail;

        promise.then(function(data) {
          // confirm the returned data matches updated object
          assert.equal(data, acc3);

          return getAllAccounts();
        })
          .then(function(data) {
            // confirm all data in db is as expected, 3 has been updated
            assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]);
            // confirm updates received in Auth0
            assert.isTrue(checkAuth0(auth0ID(3), acc3));
            // reset Auth0 account to init values
            resetAuth0Acc(acc3);
            done();
          });
      });

      it('it should allow coaches to update their own email and name', function(done) {
        var newFName = 'Beezlebub';
        var newLName = 'Smith';
        var newEmail = 'updated@americascores.org';
        var promise = accounts.updateAccount({
          params: {
            acc_id: 1 // id for the accType.Coach constant
          },
          body: {
            f_name: newFName,
            l_name: newLName,
            email: newEmail
          },
          user: accType.Coach
        });
        // update acc1 object to match
        acc1.f_name = newFName;
        acc1.l_name = newLName;
        acc1.l_name = newEmail;

        promise.then(function(data) {
          // confirm the returned data matches updated object
          assert.equal(data, acc1);

          return getAllAccounts();
        })
          .then(function(data) {
            // confirm all data in db is as expected, 1 has been updated
            assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]);
            // confirm updates received in Auth0
            assert.isTrue(checkAuth0(auth0ID(1), acc1));
            // reset Auth0 account to init values
            resetAuth0Acc(acc1);
            done();
          });
      });

      it('it should allow staff to update their own email and name', function(done) {
        var newFName = 'Beezlebub';
        var newLName = 'Smith';
        var newEmail = 'updated@americascores.org';
        var promise = accounts.updateAccount({
          params: {
            acc_id: 5 // id for the accType.Staff constant
          },
          body: {
            f_name: newFName,
            l_name: newLName,
            email: newEmail
          },
          user: accType.Staff
        });
        // update acc5 object to match
        acc5.f_name = newFName;
        acc5.l_name = newLName;
        acc5.l_name = newEmail;

        promise.then(function(data) {
          // confirm the returned data matches updated object
          assert.equal(data, acc5);

          return getAllAccounts();
        })
          .then(function(data) {
            // confirm all data in db is as expected, 5 has been updated
            assert.deepEqual(data, [acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9]);
            // confirm updates received in Auth0
            assert.isTrue(checkAuth0(auth0ID(5), acc5));
            // reset Auth0 account to init values
            resetAuth0Acc(acc5);
            done();
          });
      });
    });

    describe('createAccount(req)', function() {
      it('it should add an Admin account', function(done) {
        accounts.createAccount(
          {
            body: {
              f_name: 'first10',
              l_name: 'last10',
              email: '10@americascores.org',
              type: 'Admin'
            },
            user: accType.Admin
          })
          .then(function(data) {
            // confirm new user added
            assert.deepEqual(newAdminRes, data);
            // get contents of accounts table
            return getAllAccounts();
          })
          .then(function(data) {
            // confirm new account added to accounts table
            initAcc.push(newAdminRes);
            // confirm new account added to table
            assert.deepEqual(data, initAcc);
            // confirm new account added to Auth0
            // TODO TODO TODO
            assert.isTrue(checkAuth0(auth0ID(newAdminRes.acc_id), newAdminRes))
          });

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

    describe('deleteAccount(req)', function() {
      it('it should delete an account', function(done) {
        var promise = deleteAccount({
          params: {
            account_id: '1'
          },
          user: accType.Admin
        });

        promise.then(function(data) {
          // TODO verify delete
          done();
        });
      });

      it('it should return missing argument error', function(done) {
        var promise = deleteAccount({
          user: accType.Admin
        });

        promise.then(function(data) {
          // TODO verify error
          done();
        });
      });
    });

    describe('getAccount(req)', function() {
      it('it should retrieve a single account', function(done) {
        var promise = accounts.getAccount({
          query: {
            account_id: 1
          },
          user: accType.Admin
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
          },
          user: accType.Admin
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
      })); */
      // });
    });
  });

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
const creds = require('./../../config/creds');

var mgmt = new ManagementClient({
  token: creds.auth0.AUTH0_MANAGEMENT_TOKEN,
  domain: creds.auth0.AUTH0_DOMAIN
});

function getAllAccounts() {
  // Get contents of Accounts table in DB, used for asserts
  return query('SELECT acct_id, first_name, last_name, email, acct_type FROM Acct');
}

function checkAuth0(userID, expected) {
  // confirms that the user is stored in Auth0s DB as exepcted
  mgmt.users.get({id: userID}, function(err, user) {
    if (user.email === expected.email &&
      user.user_metadata.first_name === expected.first_name &&
      user.user_metadata.last_name === expected.last_name &&
      user.app_metadata.authorization.group === expected.acct_type) {
      return true;
    } else {
      return false;
    }
  });
}

function deleteAuth0Acc(accID) {
  // delete the auth0 account for the supplied acct_id
  var params = {id: auth0ID(acc.acct_id)};

  mgmt.users.delete(params, function(err) {
    if (err) {
      console.error('Failed to remove user from Auth0');
      console.error(err);
    }
  });
}

function resetAuth0Acc(resetAcc) {
  // updates the Auth0 account associated with the resetAcc setting all values
  // to those found in resetAcc.
  var params = {id: auth0ID(resetAcc.acct_id)};
  // Auth0 app_metadata object
  var app_metadata = {
    authorization: {
      group: resetAcc.acct_type
    }
  };
  // Auth0 user user_metadata object
  var user_metadata = {
    first_name: resetAcc.first_name,
    last_name: resetAcc.last_name
  };
  // core Auth0 user data
  var data = {
    email: resetAcc.email
  };

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
  acct_id: 1,
  first_name: 'Ron',
  last_name: 'Large',
  email: 'ronlarge@americascores.org',
  acct_type: 'Coach'
};

var acc2 = {
  acct_id: 2,
  first_name: 'Marcel',
  last_name: 'Yogg',
  email: 'myogg@americascores.org',
  acct_type: 'Coach'
};

var acc3 = {
  acct_id: 3,
  first_name: 'Maggie',
  last_name: 'Pam',
  email: 'mp@americascores.org',
  acct_type: 'Volunteer'
};

var acc4 = {
  acct_id: 4,
  first_name: 'Jeff',
  last_name: 'Nguyen',
  email: 'jnguyen@americascores.org',
  acct_type: 'Volunteer'
};

var acc5 = {
  acct_id: 5,
  first_name: 'Larry',
  last_name: 'Mulligan',
  email: 'lmulligan@americascores.org',
  acct_type: 'Staff'
};

var acc6 = {
  acct_id: 6,
  first_name: 'Jake',
  last_name: 'Sky',
  email: 'blue@americascores.org',
  acct_type: 'Staff'
};

var acc7 = {
  acct_id: 7,
  first_name: 'Mark',
  last_name: 'Pam',
  email: 'redsoxfan@americascores.org',
  acct_type: 'Admin'
};

var acc8 = {
  acct_id: 8,
  first_name: 'Amanda',
  last_name: 'Diggs',
  email: 'adiggs@americascores.org',
  acct_type: 'Admin'
};

var acc9 = {
  acct_id: 9,
  first_name: 'Tom',
  last_name: 'Lerner',
  email: 'tlerner@americascores.org',
  acct_type: 'Coach'
};

// updated accounts
var acc5_upd = {
  acct_id: 5,
  first_name: 'updatedFirst',
  last_name: 'updatedLast',
  email: 'updated@email',
  acct_type: 'Admin'
};


var acc7_fn_upd = {
  acct_id: 7,
  first_name: 'updatedFirst',
  last_name: 'Pam',
  email: 'redsoxfan@americascores.org',
  acct_type: 'Admin'
};

var acc7_ln_upd = {
  acct_id: 7,
  first_name: 'Mark',
  last_name: 'updatedSecond',
  email: 'redsoxfan@americascores.org',
  acct_type: 'Admin'
};

var acc7_email_upd = {
  acct_id: 7,
  first_name: 'Mark',
  last_name: 'Pam',
  email: 'updated@americascores.org',
  acct_type: 'Admin'
};

var acc7_auth_upd = {
  acct_id: 7,
  first_name: 'Mark',
  last_name: 'Pam',
  email: 'redsoxfan@americascores.org',
  acct_type: 'Staff'
};

var newAdminRes = {
  acct_id: 10,
  first_name: 'first',
  last_name: 'last',
  email: '10@americascores.org',
  acct_type: 'Admin'
};

var newStaffRes = {
  acct_id: 10,
  first_name: 'first',
  last_name: 'last',
  email: '10@americascores.org',
  acct_type: 'Staff'
};

var newVolunteerRes = {
  acct_id: 10,
  first_name: 'first',
  last_name: 'last',
  email: '10@americascores.org',
  acct_type: 'Volunteer'
};

var newCoachRes = {
  acct_id: 10,
  first_name: 'first',
  last_name: 'last',
  email: '10@americascores.org',
  acct_type: 'Coach'
};

// bad put request data
/* var noIDPutReq = {
  data: {
    acct_id: '',
    first_name: 'first',
    last_name: 'last',
    email: 'something@rob.com',
    acct_type: 'Staff'
  }
};

var noFNamePutReq = {
  data: {
    acct_id: 1,
    first_name: '',
    last_name: 'last',
    email: 'something@rob.com',
    acct_type: 'Staff'
  }
};

var noLNamePutReq = {
  data: {
    acct_id: 1,
    first_name: 'first',
    last_name: '',
    email: 'something@rob.com',
    acct_type: 'Staff'
  }
};

var noEmailPutReq = {
  data: {
    acct_id: 1,
    first_name: 'first',
    last_name: 'last',
    email: '',
    acct_type: 'Staff'
  }
};

var badtypePutReq = {
  data: {
    acct_id: 1,
    first_name: 'first',
    last_name: 'last',
    email: 'some@thing.com',
    acct_type: ''
  }
};

var badEMailPutReq = {
  data: {
    acct_id: 1,
    first_name: 'first',
    last_name: 'last',
    email: 'something.com',
    acct_type: 'Staff'
  }
};
*/
// bad post request data

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
      // Retrieve all students when req.query.acct_type is empty
      var promise = accounts.getAccounts({
        query: {},
        params: {},
        body: {},
        user: accType.admin
      });

      // Confirm entire DB retrieved
      promise.then(function(data) {
        assert.deepEqual(initAcc, data);
        done();
      });
    });

    it('it should return a 403 error because staff cannot request accounts', function(done) {
      var promise = accounts.getAccounts({
        query: {},
        params: {},
        body: {},
        user: accType.staff
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    it('it should return a 403 error because coaches cannot request accounts', function(done) {
      var promise = accounts.getAccounts({
        params: {
          acct_id: 7
        },
        body: {
          first_name: 'Beezlebub'
        },
        user: accType.coach
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    it('it should return a 403 error because volunteers cannot request accounts', function(done) {
      var promise = accounts.getAccounts({
        query: {},
        params: {},
        body: {},
        user: accType.volunteer
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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
          acct_type: 'Volunteer',
        },
        user: accType.admin
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
          acct_type: 'Staff',
        },
        user: accType.admin
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
          acct_type: 'Admin',
        },
        user: accType.admin
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
          acct_type: 'Coach'
        },
        user: accType.admin
      });

      promise.then(function(data) {
        // Check that all Staff accounts returned
        assert.deepEqual(data, [acc1, acc2, acc9]);
        done();
      });
    });
  });

  describe('getAccountsByProgram(req)', function() {
    xit('it should get all accounts for a specific program', function(done) {
      var promise = accounts.getAccountsByProgram({
        params: {
          program_id: 1
        },
        user: accType.admin
      });

      promise.then(function(data) {
        assert.deepEqual([acc7, acc1, acc6], data);
        done();
      });
    });

    xit('it should return a 403 error because staff cannot request accounts', function(done) {
      var promise = accounts.getAccountsByProgram({
        params: {
          program_id: 1
        },
        user: accType.staff
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    xit('it should return a 403 error because coaches cannot request accounts', function(done) {
      var promise = accounts.getAccountsByProgram({
        params: {
          program_id: 1
        },
        user: accType.coach
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    xit('it should return a 403 error because volunteers cannot request accounts', function(done) {
      var promise = accounts.getAccountsByProgram({
        params: {
          program_id: 1
        },
        user: accType.volunteer
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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
    xit('it should get all accounts for a specific site', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 1
        },
        user: accType.admin
      });

      promise.then(function(data) {
        assert.deepEqual([acc7, acc1, acc6], data);
        done();
      });
    });

    xit('it should get 0 accounts when a site id that DNE is passed', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 999
        },
        user: accType.admin
      });

      promise.then(function(data) {
        assert.deepEqual([], data);
        done();
      });
    });

    xit('it should return a 403 error because staff cannot request accounts', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 1
        },
        user: accType.staff
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    xit('it should return a 403 error because coaches cannot request accounts', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 1
        },
        user: accType.coach
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    xit('it should return a 403 error because volunteers cannot request accounts', function(done) {
      var promise = accounts.getAccountsBySite({
        params: {
          site_id: 1
        },
        user: accType.volunteer
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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
    xit('it should update an account with all new fields', function(done) {
      var req = {
        params: {
          acct_id: 5
        },
        body: {
          first_name: 'updatedFirst',
          last_name: 'updatedLast',
          email: 'updated@americascores.org',
          acct_type: 'Admin'
        },
        user: accType.admin
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

    xit('it should update an account with a new first name', function(done) {
      var req = {
        params: {
          acct_id: 7
        },
        body: {
          first_name: 'updatedFirst',
        },
        user: accType.admin
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

    xit('it should update an account with a new last name', function(done) {
      var req = {
        params: {
          acct_id: 7
        },
        body: {
          last_name: 'updatedLast',
        },
        user: accType.admin
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

    xit('it should update an account with a new email', function(done) {
      var req = {
        params: {
          acct_id: 7
        },
        body: {
          email: 'updated@americascores.org',
        },
        user: accType.admin
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

    xit('it should update an account with a new auth level', function(done) {
      var req = {
        params: {
          acct_id: 7
        },
        body: {
          acct_type: 'Staff',
        },
        user: accType.admin
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

    xit('it should return error err msg because body is missing', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: 1
        },
        user: accType.admin
      }).catch(function(err) {
        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);
        assert.equal(err.message, 'Request must have body and params section. Within ' +
          'params a valid acct_id must be given. Body should contain updated values ' +
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

    xit('should not update if request is missing params section', function(done) {
      // TODO create test to ensure Auth0 is the same before and after
      accounts.updateAccount({
        body: {
          first_name: 'Beezlebub'
        },
        user: accType.admin
      })
        .catch(function(err) {
          assert.equal(err.message, 'Request must have body and params section. Within ' +
            'params a valid acct_id must be given. Body should contain updated values ' +
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

    xit('should not update if request is missing acct_id in params', function(done) {
      // TODO ensure entire Auth0 DB has not been affected
      accounts.updateAccount({
        params: {
          something_stupid: 7
        },
        body: {
          first_name: 'Beezlebub'
        },
        user: accType.admin
      })
        .catch(function(err) {
          assert.equal(err.message, 'Request must have body and params section. Within ' +
            'params a valid acct_id must be given. Body should contain updated values ' +
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

    xit('it should return a 403 error because staff cannot update other accounts', function(done) {
      var promise = accounts.updateAccount({
        params: {
          acct_id: 7
        },
        body: {
          first_name: 'Beezlebub'
        },
        user: accType.staff
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    xit('it should return a 403 error because coaches cannot update other accounts', function(done) {
      var promise = accounts.updateAccount({
        params: {
          acct_id: 7
        },
        body: {
          first_name: 'Beezlebub'
        },
        user: accType.coach
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    xit('it should return a 403 error because volunteers cannot update other accounts', function(done) {
      var promise = accounts.updateAccount({
        params: {
          acct_id: 7
        },
        body: {
          first_name: 'Beezlebub'
        },
        user: accType.volunteer
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    xit('it should return a 403 error because staff cannot update their own type', function(done) {
      var promise = accounts.updateAccount({
        params: {
          acct_id: 5  // id for the accType.staff constant
        },
        body: {
          acct_type: 'Admin'
        },
        user: accType.staff
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

        return getAllAccounts();
      })
        .then(function(data) {
          assert.deepEqual(data, initAcc);

          return query('SELECT * FROM AcctToProgram');
        })
        .then(function(data) {
          assert.deepEqual(inita2p, data);
          // reset the account to the previous Auth0 values
          resetAuth0Acc(acc5);
          done();
        });
    });

    xit('it should return a 403 error because coaches cannot update their own type', function(done) {
      var promise = accounts.updateAccount({
        params: {
          acct_id: 1 // id for the accType.coach constant
        },
        body: {
          first_name: 'Beezlebub'
        },
        user: accType.coach
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    xit('it should return a 403 error because volunteers cannot update their own type', function(done) {
      var promise = accounts.updateAccount({
        params: {
          acct_id: 3 // id for the accType.volunteer constant
        },
        body: {
          first_name: 'Beezlebub'
        },
        user: accType.volunteer
      });

      promise.catch(function(err) {
        assert.equal(err.name, 'AccessDenied');
        assert.equal(err.status, 403);
        assert.equal(err.message, 'Access denied: this account does not have permission ' +
          'for this action');

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

    xit('it should allow volunteers to update their own email and name', function(done) {
      var newFName = 'Beezlebub';
      var newLName = 'Smith';
      var newEmail = 'updated@americascores.org';
      var promise = accounts.updateAccount({
        params: {
          acct_id: 3 // id for the accType.volunteer constant
        },
        body: {
          first_name: newFName,
          last_name: newLName,
          email: newEmail
        },
        user: accType.volunteer
      });

      // update acc3 object to match
      acc3.first_name = newFName;
      acc3.last_name = newLName;
      acc3.last_name = newEmail;

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

    xit('it should allow coaches to update their own email and name', function(done) {
      var newFName = 'Beezlebub';
      var newLName = 'Smith';
      var newEmail = 'updated@americascores.org';
      var promise = accounts.updateAccount({
        params: {
          acct_id: 1 // id for the accType.coach constant
        },
        body: {
          first_name: newFName,
          last_name: newLName,
          email: newEmail
        },
        user: accType.coach
      });
      // update acc1 object to match
      acc1.first_name = newFName;
      acc1.last_name = newLName;
      acc1.last_name = newEmail;

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

    xit('it should allow staff to update their own email and name', function(done) {
      var newFName = 'Beezlebub';
      var newLName = 'Smith';
      var newEmail = 'updated@americascores.org';
      var promise = accounts.updateAccount({
        params: {
          acct_id: 5 // id for the accType.staff constant
        },
        body: {
          first_name: newFName,
          last_name: newLName,
          email: newEmail
        },
        user: accType.staff
      });
      // update acc5 object to match
      acc5.first_name = newFName;
      acc5.last_name = newLName;
      acc5.last_name = newEmail;

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
    xit('it should add an Admin account when requested by an existing admin', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'first',
            last_name: 'last',
            email: '10@americascores.org',
            acct_type: 'Admin',
            password: 'Password123'
          },
          user: accType.admin
        })
        .then(function(data) {
          // confirm new user returned
          assert.deepEqual(newAdminRes, data);
          // get contents of accounts table
          return getAllAccounts();
        })
        .then(function(data) {
          // add newly created account to account list
          initAcc.push(newAdminRes);
          // confirm account list matches what was found in db
          assert.deepEqual(data, initAcc);
          // confirm new account added to Auth0
          assert.isTrue(checkAuth0(auth0ID(newAdminRes.acct_id), newAdminRes));
          // remove account from Auth0
          deleteAuth0Acc(newAdminRes.acct_id);
        });
    });

    xit('it should add a Staff account when requested by an existing admin', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'first',
            last_name: 'last',
            email: '10@americascores.org',
            acct_type: 'Staff',
            password: 'Password123'
          },
          user: accType.admin
        })
        .then(function(data) {
          // confirm new user returned
          assert.deepEqual(newStaffRes, data);
          // get contents of accounts table
          return getAllAccounts();
        })
        .then(function(data) {
          // add newly created account to account list
          initAcc.push(newStaffRes);
          // confirm account list matches what was found in db
          assert.deepEqual(data, initAcc);
          // confirm new account added to Auth0
          assert.isTrue(checkAuth0(auth0ID(newStaffRes.acct_id), newStaffRes));
          // remove account from Auth0
          deleteAuth0Acc(newStaffRes.acct_id);
        });
    });

    xit('it should add a volunteer account when requested', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'first',
            last_name: 'last',
            email: '10@americascores.org',
            acct_type: 'Volunteer',
            password: 'Password123'
          }
        })
        .then(function(data) {
          // confirm new user returned
          assert.deepEqual(newVolunteerRes, data);
          // get contents of accounts table
          return getAllAccounts();
        })
        .then(function(data) {
          // add newly created account to account list
          initAcc.push(newVolunteerRes);
          // confirm account list matches what was found in db
          assert.deepEqual(data, initAcc);
          // confirm new account added to Auth0
          assert.isTrue(checkAuth0(auth0ID(newVolunteerRes.acct_id), newVolunteerRes));
          // remove account from Auth0
          deleteAuth0Acc(newVolunteerRes.acct_id);
          done();
        });
    });

    xit('it should add a coach account when requested', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'first',
            last_name: 'last',
            email: '10@americascores.org',
            acct_type: 'Coach',
            password: 'Password123'
          }
        })
        .then(function(data) {
          // confirm new user returned
          assert.deepEqual(newCoachRes, data);
          // get contents of accounts table
          return getAllAccounts();
        })
        .then(function(data) {
          // add newly created account to account list
          initAcc.push(newCoachRes);
          // confirm account list matches what was found in db
          assert.deepEqual(data, initAcc);
          // confirm new account added to Auth0
          assert.isTrue(checkAuth0(auth0ID(newCoachRes.acct_id), newCoachRes));
          // remove account from Auth0
          deleteAuth0Acc(newCoachRes.acct_id);
          done();
        });
    });

    xit('it should return a 403 error because staff cannot create admin accounts', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'first',
            last_name: 'last',
            email: '10@americascores.org',
            acct_type: 'Staff',
            password: 'Password123'
          },
          user: accType.staff
        })
        .catch(function(err) {
          assert.equal(err.name, 'AccessDenied');
          assert.equal(err.status, 403);
          assert.equal(err.message, 'Access denied: this account does not have permission ' +
            'for this action');
          // get contents of accounts table
          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates were made
          assert.deepEqual(data, initAcc);
          // TODO confirm all data on Auth0 unaffected
          done();
        });
    });

    xit('it should return a 403 error because Volunteers cannot create admin accounts', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'first',
            last_name: 'last',
            email: '10@americascores.org',
            acct_type: 'Admin',
            password: 'Password123'
          },
          user: accType.volunteer
        })
        .catch(function(err) {
          assert.equal(err.name, 'AccessDenied');
          assert.equal(err.status, 403);
          assert.equal(err.message, 'Access denied: this account does not have permission ' +
            'for this action');
          // get contents of accounts table
          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates were made
          assert.deepEqual(data, initAcc);
          // TODO confirm all data on Auth0 unaffected
          done();
        });
    });

    xit('it should return a 403 error because Coaches cannot create staff accounts', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'first',
            last_name: 'last',
            email: '10@americascores.org',
            acct_type: 'Staff',
            password: 'Password123'
          },
          user: accType.coach
        })
        .catch(function(err) {
          assert.equal(err.name, 'AccessDenied');
          assert.equal(err.status, 403);
          assert.equal(err.message, 'Access denied: this account does not have permission ' +
            'for this action');
          // get contents of accounts table
          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates were made
          assert.deepEqual(data, initAcc);
          // TODO confirm all data on Auth0 unaffected
          done();
        });
    });

    xit('it should return a 403 error because coaches cannot create admin accounts', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'first',
            last_name: 'last',
            email: '10@americascores.org',
            acct_type: 'Admin',
            password: 'Password123'
          },
          user: accType.coach
        })
        .catch(function(err) {
          assert.equal(err.name, 'AccessDenied');
          assert.equal(err.status, 403);
          assert.equal(err.message, 'Access denied: this account does not have permission ' +
            'for this action');
          // get contents of accounts table
          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates were made
          assert.deepEqual(data, initAcc);
          // TODO confirm all data on Auth0 unaffected
          done();
        });
    });

    xit('it should return a 403 error because volunteers cannot create staff accounts', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'first',
            last_name: 'last',
            email: '10@americascores.org',
            acct_type: 'Staff',
            password: 'Password123'
          },
          user: accType.volunteer
        })
        .catch(function(err) {
          assert.equal(err.name, 'AccessDenied');
          assert.equal(err.status, 403);
          assert.equal(err.message, 'Access denied: this account does not have permission ' +
            'for this action');
          // get contents of accounts table
          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates were made
          assert.deepEqual(data, initAcc);
          // TODO confirm all data on Auth0 unaffected
          done();
        });
    });

    xit('it should return a 400 error because a first_name is missing', function(done) {
      accounts.createAccount(
        {
          body: {
            last_name: 'Smith',
            email: 'garbage@americascores.org',
            acct_type: 'Staff',
            password: 'Password123'
          }
        })
        .catch(function(err) {
          assert.equal(err.name, 'MissingFieldError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'Request must have a first_name in the body');

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates incurred
          assert.deepEqual(data, initAcc);
          done();
        });
    });

    xit('it should return a 400 error because a last_name is missing', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'Smith',
            email: 'garbage@americascores.org',
            acct_type: 'Staff',
            password: 'Password123'
          }
        })
        .catch(function(err) {
          assert.equal(err.name, 'MissingFieldError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'Request must have a last_name in the body');

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates incurred
          assert.deepEqual(data, initAcc);
          done();
        });
    });

    xit('it should return a 400 error because email is missing', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'Agent',
            last_name: 'Smith',
            acct_type: 'Volunteer',
            password: 'Password123'
          }
        })
        .catch(function(err) {
          assert.equal(err.name, 'MissingFieldError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'Request must specify email in the body');

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates incurred
          assert.deepEqual(data, initAcc);
          done();
        });
    });

    xit('it should return a 400 error because type is missing', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'Agent',
            last_name: 'Smith',
            email: 'garbage@americascores.org',
            password: 'Password123'
          }
        })
        .catch(function(err) {
          assert.equal(err.name, 'MissingFieldError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'Request must specify type in the body');

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates incurred
          assert.deepEqual(data, initAcc);
          done();
        });
    });

    xit('it should return a 400 error because password is missing', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'Agent',
            last_name: 'Smith',
            email: 'garbage@americascores.org',
            acct_type: 'Staff'
          }
        })
        .catch(function(err) {
          assert.equal(err.name, 'MissingFieldError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'Request must specify password in the body');

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates incurred
          assert.deepEqual(data, initAcc);
          done();
        });
    });

    xit('it should return a 400 error because first_name is empty', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: '',
            last_name: 'Smith',
            email: 'garbage@americascores.org',
            acct_type: 'Staff',
            password: 'Password123'
          }
        })
        .catch(function(err) {
          assert.equal(err.name, 'BadRequestError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'first_name in body must not be empty');

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates incurred
          assert.deepEqual(data, initAcc);
          done();
        });
    });

    xit('it should return a 400 error because last_name is empty', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'Agent',
            last_name: '',
            email: 'garbage@americascores.org',
            acct_type: 'Staff',
            password: 'Password123'
          }
        })
        .catch(function(err) {
          assert.equal(err.name, 'BadRequestError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'last_name in body must not be empty');

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates incurred
          assert.deepEqual(data, initAcc);
          done();
        });
    });

    xit('it should return a 400 error because email is invalid', function(done) {
      accounts.createAccount(
        {
          body: {
            first_name: 'Agent',
            last_name: 'Smith',
            email: 'garbage.at.americascores.org',
            acct_type: 'Staff',
            password: 'Password123'
          }
        })
        .catch(function(err) {
          assert.equal(err.name, 'BadRequestError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'Email address does not fit expected format.');

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates incurred
          assert.deepEqual(data, initAcc);
          done();
        });
    });


    xit('it should return a 400 error because the password supplied is too weak', function(done) {
      // as of time of writing, Auth0 configured such that password must be longer
      // than 8 characters and contain uppercase letter(s) and lowercase letter(s)
      // in addition to containing at least one digit
      accounts.createAccount(
        {
          body: {
            first_name: 'Agent',
            last_name: 'Smith',
            email: 'garbage@americascores.org',
            acct_type: 'Staff',
            password: 'pass'
          }
        })
        .catch(function(err) {
          assert.equal(err.name, 'BadRequestError');
          assert.equal(err.status, 400);
          assert.equal(err.message, 'PasswordStrengthError: Password is too weak');

          return getAllAccounts();
        })
        .then(function(data) {
          // confirm no updates incurred
          assert.deepEqual(data, initAcc);
          done();
        });
    });

    xit('it should throw error for trying to add an account that already exists',
      function(done) {
        accounts.createAccount({
          body: {
            first_name: 'Marcel',
            last_name: 'Yogg',
            email: 'myogg@americascores.org',
            acct_type: 'Coach',
            password: 'Password123'
          }
        })
          .catch(function(err) {
            assert.equal(err.name, 'Conflict');
            assert.equal(err.status, 409);
            assert.equal(err.message, 'Account already exists for email address supplied');

            return getAllAccounts();
          })
          .then(function(data) {
            // confirm no updates incurred
            assert.deepEqual(data, initAcc);
            done();
          });
      });
  });
  /*
  describe('deleteAccount(req)', function() {
    xit('it should delete an account', function(done) {
      var auth_id = auth0ID('1');
      var promise = accounts.deleteAccount({
        params: {
          acct_id: 1
        },
        user: accType.admin
      });

      promise.then(function(data) {
        return accounts.getAccount({
          params: {
            acct_id: 1
          }
        });
  // confirm user deleted for DB
        done();
      });
    });

    xit('it should return missing argument error', function(done) {
      var promise = deleteAccount({
        user: accType.admin
      });

      promise.then(function(data) {
  // TODO verify error
        done();
      });
    });
  });
  */
  /* describe('getAccount(req)', function() {
    xit('it should retrieve a single account', function(done) {
      var promise = accounts.getAccount({
        query: {
          acct_id: 1
        },
        user: accType.admin
      });

      promise.then(function(data) {
        assert.deepEqual([acc1], data);
        done();
      });
    });

    xit('it should retrieve an empty object as acct_id DNE', function(done) {
      var promise = accounts.getAccount({
        query: {
          acct_id: 404
        },
        user: accType.admin
      });

      promise.then(function(data) {
        assert.deepEqual([], data);
        done();
      });
    });*/
  /* TODO - remove malformatting?
    xit('it should return missing argument error', function(done) {
      assert.throw(accounts.getAccount({}));
      assert.throw(accounts.getAccount(malFormedDataReq));
      assert.throw(accounts.getAccount({
        params: {
          id: 'bad'
        }
      })); */
  // });
  //  });
});

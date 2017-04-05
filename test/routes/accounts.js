'use strict';

const chai = require('chai');
const assert = chai.assert;
const Promise = require('bluebird');

const accounts = require('../../routes/accounts');
const utils = require('../../lib/utils');

const accType = require('../../lib/constants');
const ADMIN = accType.ADMIN;
const STAFF = accType.STAFF;
const COACH = accType.COACH;
const VOLUNTEER = accType.VOLUNTEER;

const query = utils.query;

const auth0 = require('../../lib/auth0_utils');
const ACCTS = require('../../lib/seed_constants').ACCTS;
const auth0Seed = require('../../lib/seed').auth0Seed;

const testUtils = require('../../lib/test_utils');
const assertEqualAuth0DB = testUtils.assertEqualAuth0DBAcct;
const assertEqualDB = testUtils.assertEqualDBAcct;
const assertEqualError = testUtils.assertEqualError;


const dummyAccount = {
  first_name: 'first',
  last_name: 'last',
  username: 'dummy_account',
  email: 'dummy@americascores.org',
  password: 'Password123',
  acct_type: ADMIN
};

function getAllAccounts() {
  // Get contents of Accounts table in DB, used for asserts
  return query('SELECT acct_id, first_name, last_name, email, acct_type FROM Acct');
}

function verifyNoAccountChanges(done) {
  // get contents of accounts table
  getAllAccounts().then(function(data) {
    // confirm no updates were made
    assert.deepEqual(data, initAcc);
    // TODO confirm all data on Auth0 unaffected
    done();
  });
}

function createAccountTester(newAcctData, type, done) {
  var req = {
    body: newAcctData,
    user: type
  };

  accounts.createAccount(req).then(function() {
    query('SELECT acct_id, first_name, last_name, email, acct_type FROM Acct ' +
      'WHERE first_name = ? AND last_name = ? AND email = ?',
      [newAcctData.first_name, newAcctData.last_name, newAcctData.email]).then(function(accts) {
      // confirm new user returned
      var newAcct = accts[0];
      assertEqualDB(newAcctData, newAcct);
      // get contents of accounts table
      getAllAccounts().then(function(dbAccts) {
        // confirm account list matches what was found in db
        assert.deepEqual(dbAccts, [acc1, acc2, acc3, acc4, acc5, acc6, acc7, acc8, acc9, newAcct]);
        auth0.getAuth0Id(newAcct.acct_id).then(function(auth0Id) {
          auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
            // confirm new account added to Auth0
            assertEqualAuth0DB(auth0Acct, newAcct);
            // remove account from Auth0
            deleteAccount(auth0Id, newAcct).then(function() {
              done();
            });
          });
        });
      });
    });
  });
}

function createAccountErrorTester(newAcctData, type, errName, errStatus, errMessage, done) {
  var req = {
    body: newAcctData,
    user: type
  };

  accounts.createAccount(req).catch(function(err) {
    assertEqualError(err, errName, errStatus, errMessage);
    verifyNoAccountChanges(done);
  });
}

function createPermissionErrorTester(createType, reqType, done) {
  var acct = {
    first_name: 'first',
    last_name: 'last',
    email: '10@americascores.org',
    password: 'Password123',
    acct_type: createType
  };

  createAccountErrorTester(acct, reqType,
    'AccessDenied', 403, 'Access denied: this account does not have permission ' +
    'for this action', done);
}

function createMissingFieldErrorTester(field, type, done) {
  var acct = Object.assign({}, dummyAccount);
  delete acct[field];

  createAccountErrorTester(acct, type,
    'Missing Field', 400,
    'Request must have the following component(s): ' + field + ' (body)',
    done);
}

function createEmptyFieldErrorTester(field, type, done) {
  var acct = Object.assign({}, dummyAccount);
  acct[field] = '';
  createAccountErrorTester(acct, type,
    'Empty Field', 400,
    'Request must have the following non-empty component(s): ' + field + ' (body)',
    done);
}

function deletePermissionErrorTester(user, done) {
  accounts.deleteAccount({
    params: {
      account_id: createdDBId
    },
    user: user
  }).catch(function(err) {
    assertEqualError(err,
      'AccessDenied', 403, 'Access denied: this account does not have permission ' +
      'for this action'
    );
    getAllAccounts().then(function(accts) {
      // verify the account didn't get deleted
      assertEqualDB(accts[accts.length - 1], dummyAccount);
      done();
    });
  });
}

function resetAccount(auth0Id, acct) {
  return auth0.updateAuth0User(auth0Id, {
    email: acct.email,
    user_metadata: {
      first_name: acct.first_name,
      last_name: acct.last_name
    },
    app_metadata: {
      acct_type: acct.acct_type
    }
  }).then(function(data) {
    return query(accounts.UPDATE_ACCT_ALL,
      [acct.first_name, acct.last_name, acct.email, acct.acct_type, acct.acct_id]);
  });
}

function deleteAccount(auth0Id, acct) {
  return auth0.deleteAuth0User(auth0Id).then(function(data) {
    return query(accounts.DELETE_ACCT, acct.acct_id);
  });
}

// objects to store the initial database tables
var initAcc;

// starting data from /utils.js.seed()
var acc1 = {
  acct_id: 1,
  first_name: 'Ron',
  last_name: 'Large',
  email: 'ronlarge@americascores.org',
  acct_type: 'Coach'
};

var acc1_auth0 = 'auth0|584377c428be27504a2bcf92';

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
  email: 'updated@americascores.org',
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
  last_name: 'updatedLast',
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

describe('Accounts', function() {
  // get original states of the database tables
  before(function(done) {
    /* eslint-disable no-invalid-this */
    this.timeout(20000);
    /* eslint-enable no-invalid-this */

    // Acct table
    getAllAccounts().then(function(data) {
      initAcc = data;
      auth0Seed(ACCTS).then(function() {
        done();
      });
    });
  });

  describe('getAccounts(req)', function() {
    it('it should get all accounts in DB when requested by an admin',
      function(done) {
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

    // Verify access errors
    xit('it should return a 403 error because staff cannot request accounts',
      function(done) {
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

          done();
        });
    });

    xit('it should return a 403 error because coaches cannot request accounts',
        function(done) {
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

            done();
          });
    });

    xit('it should return a 403 error because volunteers cannot request accounts',
        function(done) {
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

            done();
          });
    });

    // Acct Type queries
    it('it should get all accounts in DB where type=Volunteer',
        function(done) {
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

    it('it should get all accounts in DB where type=Staff',
        function(done) {
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

    it('it should get all accounts in DB where type=Admin',
        function(done) {
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

    it('it should get all accounts in DB where type=Coach',
        function(done) {
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

    it('it should get accounts pertaining to an auth0 id',
      function(done) {
        var promise = accounts.getAccounts({
          query: {
            auth0_id: acc1_auth0
          },
          user: accType.admin
        });

        promise.then(function(data) {
          // Check that referenced account is returned
          assert.deepEqual(data, [acc1]);
          done();
        });
    });

    it('it should get accounts pertaining to an id',
      function(done) {
        var promise = accounts.getAccounts({
          query: {
            account_id: '1'
          },
          user: accType.admin
        });

        promise.then(function(data) {
          // Check that referenced account is returned
          assert.deepEqual(data, [acc1]);
          done();
        });
    });

    it('it should get accounts pertaining to a full name and email',
      function(done) {
        var promise = accounts.getAccounts({
          query: {
            first_name: 'Ron',
            last_name: 'Large',
            email: 'ronlarge@americascores.org'
          },
          user: accType.admin
        });

        promise.then(function(data) {
          // Check that referenced account is returned
          assert.deepEqual(data, [acc1]);
          done();
        });
    });

    it('it should get all accounts for a specific program',
      function(done) {
        var promise = accounts.getAccounts({
          query: {
            program_id: 1
          },
          user: accType.admin
        });

        promise.then(function(data) {
          assert.deepEqual([acc7, acc1, acc6], data);
          done();
        });
    });

    it('it should get 0 accounts when a program id that DNE is passed',
      function(done) {
        var promise = accounts.getAccounts({
          query: {
            program_id: 999
          },
          user: accType.admin
        });

        promise.then(function(data) {
          assert.deepEqual([], data);
          done();
        });
    });

    it('it should get all accounts for a specific site',
      function(done) {
        var promise = accounts.getAccounts({
          query: {
            site_id: 1
          },
          user: accType.admin
        });

        promise.then(function(data) {
          assert.deepEqual([acc7, acc1, acc6], data);
          done();
        });
    });

    it('it should get 0 accounts when a site id that DNE is passed',
      function(done) {
        var promise = accounts.getAccounts({
          query: {
            site_id: 999
          },
          user: accType.admin
        });

        promise.then(function(data) {
          assert.deepEqual([], data);
          done();
        });
    });

    it('it should return a 501 error because of a malformed query',
        function(done) {
          var promise = accounts.getAccounts({
            query: {
              first_name: 'Ron',
              email: 'ronlarge@americascores.org'
            },
            user: accType.admin
          });

          promise.catch(function(err) {
            assert.equal(err.name, 'UnsupportedRequest');
            assert.equal(err.status, 501);
            assert.equal(err.message, 'The API does not support a request of this format. ' +
              ' See the documentation for a list of options.');

            done();
          });
    });
  });

  describe('updateAccount(req)', function() {
    it('it should update an account with all new fields',
      function(done) {
        var body = {
          first_name: 'updatedFirst',
          last_name: 'updatedLast',
          email: 'updated@americascores.org',
          acct_type: 'Admin'
        };

        var promise = accounts.updateAccount({
          params: {
            acct_id: 5
          },
          body: body,
          user: accType.admin
        });

        promise.then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc5_upd]);
          auth0.getAuth0Id(data[0].acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account got updated
              assertEqualAuth0DB(auth0Acct, body);
              getAllAccounts().then(function(accounts) {
                // check that only the target account was updated in the db
                assert.deepEqual(accounts,
                  [acc1, acc2, acc3, acc4,
                   acc5_upd, acc6, acc7,
                   acc8, acc9]);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc5).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    it('it should update an account with a new first name',
      function(done) {
        var promise = accounts.updateAccount({
          params: {
            acct_id: 7
          },
          body: {
            first_name: 'updatedFirst',
          },
          user: accType.admin
        });

        var body = {
          email: acc7.email,
          first_name: 'updatedFirst',
          last_name: acc7.last_name,
          acct_type: acc7.acct_type
        };

        promise.then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc7_fn_upd]);
          auth0.getAuth0Id(data[0].acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account got updated
              assertEqualAuth0DB(auth0Acct, body);
              getAllAccounts().then(function(accounts) {
                // check that only the target account was updated in the db
                assert.deepEqual(accounts,
                  [acc1, acc2, acc3, acc4,
                   acc5, acc6, acc7_fn_upd,
                   acc8, acc9]);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    it('it should update an account with a new last name',
      function(done) {
        var promise = accounts.updateAccount({
          params: {
            acct_id: 7
          },
          body: {
            last_name: 'updatedLast',
          },
          user: accType.admin
        });

        var body = {
          email: acc7.email,
          first_name: acc7.first_name,
          last_name: 'updatedLast',
          acct_type: acc7.acct_type
        };

        promise.then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc7_ln_upd]);
          auth0.getAuth0Id(data[0].acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account got updated
              assertEqualAuth0DB(auth0Acct, body);
              getAllAccounts().then(function(accounts) {
                // check that only the target account was updated in the db
                assert.deepEqual(accounts,
                  [acc1, acc2, acc3, acc4,
                   acc5, acc6, acc7_ln_upd,
                   acc8, acc9]);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    it('it should update an account with a new email',
      function(done) {
        var promise = accounts.updateAccount({
          params: {
            acct_id: 7
          },
          body: {
            email: 'updated@americascores.org',
          },
          user: accType.admin
        });

        var body = {
          email: 'updated@americascores.org',
          first_name: acc7.first_name,
          last_name: acc7.last_name,
          acct_type: acc7.acct_type
        };

        promise.then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc7_email_upd]);
          auth0.getAuth0Id(data[0].acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account got updated
              assertEqualAuth0DB(auth0Acct, body);
              getAllAccounts().then(function(accounts) {
                // check that only the target account was updated in the db
                assert.deepEqual(accounts,
                  [acc1, acc2, acc3, acc4,
                   acc5, acc6, acc7_email_upd,
                   acc8, acc9]);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    it('it should update an account with a new auth level',
      function(done) {
        var promise = accounts.updateAccount({
          params: {
            acct_id: 7
          },
          body: {
            acct_type: 'Staff',
          },
          user: accType.admin
        });

        var body = {
          email: acc7.email,
          first_name: acc7.first_name,
          last_name: acc7.last_name,
          acct_type: 'Staff'
        };

        promise.then(function(data) {
          // check that updated account is returned
          assert.deepEqual(data, [acc7_auth_upd]);
          auth0.getAuth0Id(data[0].acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account got updated
              assertEqualAuth0DB(auth0Acct, body);
              getAllAccounts().then(function(accounts) {
                // check that only the target account was updated in the db
                assert.deepEqual(accounts,
                  [acc1, acc2, acc3, acc4,
                   acc5, acc6, acc7_auth_upd,
                   acc8, acc9]);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    it('it should return a 501 error because body is missing',
      function(done) {
        var promise = accounts.updateAccount({
          params: {
            acct_id: 1
          },
          user: accType.admin
        });

        promise.catch(function(err) {
          assert.equal(err.name, 'UnsupportedRequest');
          assert.equal(err.status, 501);
          assert.equal(err.message,
            'The API does not support a request of this format. ' +
            ' See the documentation for a list of options.');
          auth0.getAuth0Id(acc1.acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account did not get updated
              assertEqualAuth0DB(auth0Acct, acc1);
              getAllAccounts().then(function(accts) {
                // confirm no updates were incurred
                assert.deepEqual(accts, initAcc);
                done();
              });
            });
          });
        });
    });

    it('should not update if request is missing params section',
      function(done) {
        var promise = accounts.updateAccount({
          body: {
            first_name: 'Beezlebub'
          },
          user: accType.admin
        });

        promise.catch(function(err) {
          assert.equal(err.name, 'UnsupportedRequest');
          assert.equal(err.status, 501);
          assert.equal(err.message,
            'The API does not support a request of this format. ' +
            ' See the documentation for a list of options.');
          getAllAccounts().then(function(accts) {
            // confirm no updates were incurred
            assert.deepEqual(accts, initAcc);
            done();
          });
        });
    });

    it('should not update if request is missing acct_id in params',
      function(done) {
        var promise = accounts.updateAccount({
          params: {
            something_stupid: 7
          },
          body: {
            first_name: 'Beezlebub'
          },
          user: accType.admin
        });

        promise.catch(function(err) {
          assert.equal(err.name, 'UnsupportedRequest');
          assert.equal(err.status, 501);
          assert.equal(err.message,
            'The API does not support a request of this format. ' +
            ' See the documentation for a list of options.');
          getAllAccounts().then(function(accts) {
            // confirm no updates were incurred
            assert.deepEqual(accts, initAcc);
            done();
          });
        });
    });

    it('it should return a 400 if given a non-positive integer account id',
      function(done) {
      accounts.updateAccount({
        params: {
          acct_id: -1
        },
        body: {
          first_name: 'Bobby'
        },
        user: accType.admin
      }).catch(function(err) {
        assertEqualError(err, 'InvalidArgumentError', 400,
          'Given acct_id is of invalid format (e.g. not an integer or negative)');
        verifyNoAccountChanges(done);
      });
    });

    it('it should return a 404 if the account id DNE',
      function(done) {
      accounts.updateAccount({
        params: {
          acct_id: 999
        },
        body: {
          first_name: 'Bobby'
        },
        user: accType.admin
      }).catch(function(err) {
        assertEqualError(err, 'ArgumentNotFoundError', 404,
          'Invalid request: The given acct_id does not exist in the database');
        verifyNoAccountChanges(done);
      });
    });

    it('it should 501 if no updates are provided in the body',
      function(done) {
      accounts.updateAccount({
        params: {
          acct_id: 1
        },
        body: {},
        user: accType.admin
      }).catch(function(err) {
        assertEqualError(err, 'UnsupportedRequest', 501,
          'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
        verifyNoAccountChanges(done);
      });
    });

    // TODO: Auth0 API should be throwing an error because of duplicate email ... but it's not
    xit('it should 500 when it encounters an auth0 error and rollback the database updates',
      function(done) {
      accounts.updateAccount({
        params: {
          acct_id: 1
        },
        body: {
          email: acc1.email
        },
        user: accType.admin
      }).catch(function(err) {
        assertEqualError(err, 'InternalServerError', 500,
            'The server encountered an unexpected condition which prevented it from fulfilling the request');
        verifyNoAccountChanges(done);
      });
    });

    xit('it should return a 403 error because staff cannot update other accounts',
      function(done) {
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

          auth0.getAuth0Id(acc7.acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account did not get updated
              assertEqualAuth0DB(auth0Acct, acc7);
              getAllAccounts().then(function(accounts) {
                // check that nothing was updated in the db
                assert.deepEqual(accounts, initAcc);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    xit('it should return a 403 error because coaches cannot update other accounts',
      function(done) {
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

          auth0.getAuth0Id(acc7.acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account did not get updated
              assertEqualAuth0DB(auth0Acct, acc7);
              getAllAccounts().then(function(accounts) {
                // check that nothing was updated in the db
                assert.deepEqual(accounts, initAcc);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    xit('it should return a 403 error because volunteers cannot update other accounts',
      function(done) {
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

          auth0.getAuth0Id(acc7.acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account did not get updated
              assertEqualAuth0DB(auth0Acct, acc7);
              getAllAccounts().then(function(accounts) {
                // check that nothing was updated in the db
                assert.deepEqual(accounts, initAcc);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    xit('it should return a 403 error because staff cannot update their own type',
      function(done) {
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

          auth0.getAuth0Id(acc7.acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account did not get updated
              assertEqualAuth0DB(auth0Acct, acc7);
              getAllAccounts().then(function(accounts) {
                // check that nothing was updated in the db
                assert.deepEqual(accounts, initAcc);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    xit('it should return a 403 error because coaches cannot update their own type',
      function(done) {
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

          auth0.getAuth0Id(acc7.acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account did not get updated
              assertEqualAuth0DB(auth0Acct, acc7);
              getAllAccounts().then(function(accounts) {
                // check that nothing was updated in the db
                assert.deepEqual(accounts, initAcc);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    xit('it should return a 403 error because volunteers cannot update their own type',
      function(done) {
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

          auth0.getAuth0Id(acc7.acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account did not get updated
              assertEqualAuth0DB(auth0Acct, acc7);
              getAllAccounts().then(function(accounts) {
                // check that nothing was updated in the db
                assert.deepEqual(accounts, initAcc);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc7).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    it('it should allow volunteers to update their own email and name',
      function(done) {
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

        var updated = {
          acct_id: acc3.acct_id,
          email: newEmail,
          first_name: newFName,
          last_name: newLName,
          acct_type: acc3.acct_type,
        };

        promise.then(function(data) {
          // confirm the returned data matches updated object
          assert.deepEqual(data, [updated]);
          auth0.getAuth0Id(data[0].acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account got updated
              assertEqualAuth0DB(auth0Acct, updated);
              getAllAccounts().then(function(accounts) {
                // check that only the target account was updated in the db
                assert.deepEqual(accounts,
                  [acc1, acc2, updated, acc4,
                   acc5, acc6, acc7, acc8, acc9]);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc3).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    it('it should allow coaches to update their own email and name',
      function(done) {
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

        var updated = {
          acct_id: acc1.acct_id,
          email: newEmail,
          first_name: newFName,
          last_name: newLName,
          acct_type: acc1.acct_type,
        };

        promise.then(function(data) {
          // confirm the returned data matches updated object
          assert.deepEqual(data, [updated]);
          auth0.getAuth0Id(data[0].acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account got updated
              assertEqualAuth0DB(auth0Acct, updated);
              getAllAccounts().then(function(accounts) {
                // check that only the target account was updated in the db
                assert.deepEqual(accounts,
                  [updated, acc2, acc3, acc4,
                   acc5, acc6, acc7, acc8, acc9]);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc1).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });

    it('it should allow staff to update their own email and name',
      function(done) {
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

        var updated = {
          acct_id: acc5.acct_id,
          email: newEmail,
          first_name: newFName,
          last_name: newLName,
          acct_type: acc5.acct_type,
        };

        promise.then(function(data) {
          // confirm the returned data matches updated object
          assert.deepEqual(data, [updated]);
          auth0.getAuth0Id(data[0].acct_id).then(function(auth0Id) {
            auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
              // check that the auth0 account got updated
              assertEqualAuth0DB(auth0Acct, updated);
              getAllAccounts().then(function(accounts) {
                // check that only the target account was updated in the db
                assert.deepEqual(accounts,
                  [acc1, acc2, acc3, acc4, updated,
                   acc6, acc7, acc8, acc9]);
                // reset the auth0 and db accounts
                resetAccount(auth0Id, acc5).then(function(data) {
                  done();
                });
              });
            });
          });
        });
    });
  });

  describe('createAccount(req)', function() {
    before(function(done) {
      auth0.getAuth0UserByEmail(dummyAccount.email).then(function(user) {
        // clear existing user so we don't get a duplicate email error on creation
        auth0.deleteAuth0User(user.user_id).then(function() {
          done();
        });
      }).catch(function(err) {
        // no user to delete, tests are good to go
        done();
      });
    });

    it('it should add an Admin account when requested by an existing admin', function(done) {
      var acct = Object.assign({}, dummyAccount);
      createAccountTester(acct, accType.admin, done);
    });

    it('it should add a Staff account when requested by an existing admin', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = STAFF;
      createAccountTester(acct, accType.admin, done);
    });

    it('it should add a volunteer account when requested by an existing admin', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = VOLUNTEER;
      createAccountTester(acct, accType.admin, done);
    });

    it('it should add a coach account when requested by an existing admin', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = COACH;
      createAccountTester(acct, accType.admin, done);
    });

    xit('it should return a 403 error because staff cannot create admin accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      createPermissionErrorTester(acct, accType.staff, done);
    });

    xit('it should return a 403 error because Volunteers cannot create admin accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      createPermissionErrorTester(acct, accType.volunteer, done);
    });

    xit('it should return a 403 error because Coaches cannot create staff accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = STAFF;
      createPermissionErrorTester(acct, accType.coach, done);
    });

    xit('it should return a 403 error because coaches cannot create admin accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      createPermissionErrorTester(acct, accType.coach, done);
    });

    xit('it should return a 403 error because volunteers cannot create staff accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = STAFF;
      createPermissionErrorTester(acct, accType.volunteer, done);
    });

    it('it should return a 400 error because a first_name is missing', function(done) {
      createMissingFieldErrorTester('first_name', accType.admin, done);
    });

    it('it should return a 400 error because a last_name is missing', function(done) {
      createMissingFieldErrorTester('last_name', accType.admin, done);
    });

    it('it should return a 400 error because email is missing', function(done) {
      createMissingFieldErrorTester('email', accType.admin, done);
    });

    it('it should return a 400 error because acct_type is missing', function(done) {
      createMissingFieldErrorTester('acct_type', accType.admin, done);
    });

    it('it should return a 400 error because password is missing', function(done) {
      createMissingFieldErrorTester('password', accType.admin, done);
    });

    it('it should return a 400 error because first_name is empty', function(done) {
      createEmptyFieldErrorTester('first_name', accType.admin, done);
    });

    it('it should return a 400 error because last_name is empty', function(done) {
      createEmptyFieldErrorTester('last_name', accType.admin, done);
    });

    it('it should return a 400 error because acct_type is empty', function(done) {
      createEmptyFieldErrorTester('acct_type', accType.admin, done);
    });

    it('it should return a 400 error because acct_type is invalid', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = 'Invalid';
      createAccountErrorTester(acct, accType.admin, 'Bad Request', 400, 'Account type must be one of: Admin, Coach, Staff, Volunteer', done);
    });

    it('it should return a 400 error because the password does not meet requirements', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.password = 'weak';
      createAccountErrorTester(acct, accType.admin, 'Bad Request', 400, 'Password is too weak', done);
    });
  });

  describe('deleteAccount(req)', function() {
    var createdDBId;
    var createdAuth0Id;

    // add a dummy account to auth0 and the db
    function createDummyAccount() {
      // first add to auth0
      return auth0.createAuth0User(dummyAccount.first_name, dummyAccount.last_name, dummyAccount.username,
      dummyAccount.email, dummyAccount.acct_type, dummyAccount.password).then(function(auth0Id) {
        createdAuth0Id = auth0Id;
        // then add to our db
        return query(accounts.CREATE_ACCT,
          [dummyAccount.first_name, dummyAccount.last_name, dummyAccount.email,
           dummyAccount.acct_type, auth0Id]).then(function() {
          return query(accounts.ACCOUNT_BY_AUTH, [createdAuth0Id]).then(function(accts) {
            createdDBId = accts[0].acct_id;
            return Promise.resolve();
          });
        });
      });
    }

    afterEach(function(done) {
      auth0.getAuth0UserByEmail(dummyAccount.email).then(function(user) {
        // clear existing user so we don't get a duplicate email error on future creation
        auth0.deleteAuth0User(user.user_id).then(function() {
          query('DELETE FROM Acct WHERE auth0_id=?', [user.user_id]).then(function() {
            done();
          });
        });
      }).catch(function(err) {
        // no user to delete, teardown is complete
        done();
      });
    });

    xit('it should 403 when a coach tries to delete an account', function(done) {
      createDummyAccount().then(function() {
        deletePermissionErrorTester(accType.coach, done);
      });
    });

    xit('it should 403 when a staff member tries to delete an account', function(done) {
      createDummyAccount().then(function() {
        deletePermissionErrorTester(accType.staff, done);
      });
    });

    xit('it should 403 when a volunteer tries to delete an account', function(done) {
      createDummyAccount().then(function() {
        deletePermissionErrorTester(accType.volunteer, done);
      });
    });

    it('it should delete an account if an admin requests the action', function(done) {
      createDummyAccount().then(function() {
        accounts.deleteAccount({
          params: {
            account_id: createdDBId
          },
          user: accType.admin
        }).then(function() {
          auth0.getAuth0User(createdAuth0Id).catch(function(err) {
            assertEqualError(err,
              'ArgumentNotFoundError', 404, 'Invalid request: The given auth0_id' +
              ' does not exist in the database'
            );
            verifyNoAccountChanges(done);
          });
        });
      });
    });

    it('it should return a 400 error if no id is passed', function(done) {
      accounts.deleteAccount({
        params: {},
        user: accType.admin
      }).catch(function(err) {
        assertEqualError(err, 'Missing Field', 400,
          'Request must have the following component(s): account_id (params)');
        verifyNoAccountChanges(done);
      });
    });

    it('it should 404 when passed the acct id is not recognized', function(done) {
      accounts.deleteAccount({
        params: {
          account_id: 999
        },
        user: accType.admin
      }).catch(function(err) {
        assertEqualError(err, 'Not Found', 404, 'No account with id 999 exists in the database.');
        verifyNoAccountChanges(done);
      });
    });
  });
});

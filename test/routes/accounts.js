'use strict';

const chai = require('chai');
const assert = chai.assert;
const Promise = require('bluebird');

const accounts = require('../../routes/accounts');
const seed = require('../../lib/seed').testSeed;
const utils = require('../../lib/utils');

const constants = require('../../lib/constants/utils');
const ADMIN = constants.ADMIN;
const STAFF = constants.STAFF;
const COACH = constants.COACH;
const VOLUNTEER = constants.VOLUNTEER;

const A0_CONST = require('../../lib/constants/auth0');
const ADMIN_AUTH0_ID = A0_CONST.ADMIN_AUTH0_ID;
const STAFF_AUTH0_ID = A0_CONST.STAFF_AUTH0_ID;
const COACH_AUTH0_ID = A0_CONST.COACH_AUTH0_ID;
const VOLUNTEER_AUTH0_ID = A0_CONST.VOLUNTEER_AUTH0_ID;

const query = utils.query;
const q = require('../../lib/constants/queries');

const auth0 = require('../../lib/auth0_utils');
const SC = require('../../lib/constants/seed');
const ACCTS = SC.TEST_ACCTS;
const ACCT_1 = SC.ACCT_1;
const ACCT_2 = SC.ACCT_2;
const ACCT_3 = SC.ACCT_3;
const ACCT_4 = SC.ACCT_4;
const ACCT_5 = SC.ACCT_5;
const ACCT_6 = SC.ACCT_6;
const ACCT_7 = SC.ACCT_7;
const ACCT_8 = SC.ACCT_8;
const ACCT_9 = SC.ACCT_9;

const testUtils = require('../../lib/test_utils');
const assertEqualAuth0DB = testUtils.assertEqualAuth0DBAcct;
const assertEqualDB = testUtils.assertEqualDBAcct;
const assertEqualError = testUtils.assertEqualError;
const assertEqualPermissionsError = testUtils.assertEqualPermissionsError;
const assertEqualMissingAuthError = testUtils.assertEqualMissingAuthError;


const dummyAccount = {
  first_name: 'first',
  last_name: 'last',
  username: 'dummy_account',
  email: 'dummy@americascores.org',
  password: 'Password123',
  acct_type: ADMIN
};

const UPDATED_FIRST = 'updatedFirst';
const UPDATED_LAST = 'updatedLast';
const UPDATED_EMAIL = 'updated@americascores.org';
const UPDATED_ACCT_TYPE = COACH;

function getAllAccounts() {
  // Get contents of Accounts table in DB, used for asserts
  return query(q.SELECT_ACCT);
}

function verifyNoAccountChanges(done) {
  // get contents of accounts table
  getAllAccounts().then(function(data) {
    // confirm no updates were made
    assert.deepEqual(data, ACCTS);
    // TODO confirm all data on Auth0 unaffected
    done();
  });
}

function updateAccountTester(target, updates, auth0Id, done, error) {
  var updateAccount = Object.assign({}, target);
  Object.assign(updateAccount, updates);

  var promise = accounts.updateAccount({
    params: {
      acct_id: target.acct_id
    },
    body: updates,
    auth: {
      auth0_id: auth0Id
    }
  });

  if (error !== undefined) {
    promise.catch(function(err) {
      assertEqualError(err, error.name, error.status, error.message);
      verifyNoAccountChanges(done);
    });
  } else {
    promise.then(function(data) {
      assert.deepEqual(data, [updateAccount]);
      auth0.getAuth0User(data[0].auth0_id).then(function(auth0Acct) {
        assertEqualAuth0DB(auth0Acct, updateAccount);
        getAllAccounts().then(function(accounts) {
          var accts = ACCTS.slice();
          accts[target.acct_id - 1] = updateAccount;
          assert.deepEqual(accounts, accts);
          done();
        });
      });
    });
  }
}

function createAccountTester(newAcctData, auth0_id, done) {
  var req = {
    body: newAcctData,
    auth: {
      auth0_id: auth0_id
    }
  };

  accounts.createAccount(req).then(function() {
    query('SELECT acct_id, first_name, last_name, email, acct_type, auth0_id FROM Acct ' +
      'WHERE first_name = ? AND last_name = ? AND email = ?',
      [newAcctData.first_name, newAcctData.last_name, newAcctData.email]).then(function(accts) {
      // confirm new user returned
      var newAcct = accts[0];
      assertEqualDB(newAcctData, newAcct);
      // get contents of accounts table
      getAllAccounts().then(function(dbAccts) {
        // confirm account list matches what was found in db
        assert.deepEqual(dbAccts, ACCTS.concat([newAcct]));
        auth0.getAuth0User(newAcct.auth0_id).then(function(auth0Acct) {
          // confirm new account added to Auth0
          assertEqualAuth0DB(auth0Acct, newAcct);
          done();
        });
      });
    });
  });
}

function createAccountErrorTester(newAcctData, auth0_id, errName, errStatus, errMessage, done) {
  var req = {
    body: newAcctData,
    auth: {
      auth0_id: auth0_id
    }
  };

  accounts.createAccount(req).catch(function(err) {
    assertEqualError(err, errName, errStatus, errMessage);
    verifyNoAccountChanges(done);
  });
}

function createPermissionErrorTester(auth0_id, createType, reqType, done) {
  var acct = {
    first_name: 'first',
    last_name: 'last',
    email: '10@americascores.org',
    password: 'Password123',
    acct_type: createType
  };

  createAccountErrorTester(acct, auth0_id,
    'AccessDenied', 403, 'Access denied: this account (' + reqType + ') does not have permission ' +
    'for this action', done);
}

function createMissingFieldErrorTester(field, auth0_id, done) {
  var acct = Object.assign({}, dummyAccount);
  delete acct[field];

  createAccountErrorTester(acct, auth0_id,
    'Missing Field', 400,
    'Request must have the following component(s): ' + field + ' (body)',
    done);
}

function createEmptyFieldErrorTester(field, auth0_id, done) {
  var acct = Object.assign({}, dummyAccount);
  acct[field] = '';
  createAccountErrorTester(acct, auth0_id,
    'Empty Field', 400,
    'Request must have the following non-empty component(s): ' + field + ' (body)',
    done);
}

function deletePermissionErrorTester(auth0_id, type, done) {
  accounts.deleteAccount({
    params: {
      account_id: createdDBId
    },
    auth: {
      auth0_id: auth0_id
    }
  }).catch(function(err) {
    assertEqualPermissionsError(err, type);

    getAllAccounts().then(function(accts) {
      // verify the account didn't get deleted
      assertEqualDB(accts[accts.length - 1], dummyAccount);
      done();
    });
  });
}

function resetAccount(acct) {
  return auth0.updateAuth0User(acct.auth0_id, {
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

describe('Accounts', function() {
  // get original states of the database tables
  before(function(done) {
    /* eslint-disable no-invalid-this */
    this.timeout(20000);
    /* eslint-enable no-invalid-this */

    seed().then(function() {
      done();
    });
  });

  describe('getAccounts(req)', function() {
    it('it should get all accounts in DB when requested by an admin', function(done) {
      // Retrieve all students when req.query.acct_type is empty
      accounts.getAccounts({
        query: {},
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
      // Confirm entire DB retrieved
        assert.deepEqual(ACCTS, data);
        done();
      });
    });

    // Verify access errors
    xit('it should return a 400 error when no auth0 id is passed with the request', function(done) {
      accounts.getAccounts({
        query: {}
      }).catch(function(err) {
        assertEqualMissingAuthError(err);
        done();
      });
    });

    xit('it should return a 403 error because staff cannot request accounts', function(done) {
      accounts.getAccounts({
        query: {},
        auth: {
          auth0_id: STAFF_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualPermissionsError(err, STAFF);
        done();
      });
    });

    xit('it should return a 403 error because coaches cannot request accounts', function(done) {
      accounts.getAccounts({
        params: {
          acct_id: 7
        },
        body: {
          first_name: 'Beezlebub'
        },
        auth: {
          auth0_id: COACH_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualPermissionsError(err, COACH);
        done();
      });
    });

    xit('it should return a 403 error because volunteers cannot request accounts', function(done) {
      accounts.getAccounts({
        query: {},
        auth: {
          auth0_id: VOLUNTEER_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualPermissionsError(err, VOLUNTEER);
        done();
      });
    });

    // Acct Type queries
    it('it should get all accounts in DB where type=Volunteer', function(done) {
      accounts.getAccounts({
        query: {
          acct_type: VOLUNTEER,
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        // Check that all Volunteer accounts returned
        assert.deepEqual(data, [ACCT_3, ACCT_4]);
        done();
      });
    });

    it('it should get all accounts in DB where type=Staff', function(done) {
      accounts.getAccounts({
        query: {
          acct_type: STAFF,
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        // Check that all Staff accounts returned
        assert.deepEqual(data, [ACCT_5, ACCT_6]);
        done();
      });
    });

    it('it should get all accounts in DB where type=Admin', function(done) {
      accounts.getAccounts({
        query: {
          acct_type: ADMIN,
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        // Check that all Admin accounts returned
        assert.deepEqual(data, [ACCT_7, ACCT_8]);
        done();
      });
    });

    it('it should get all accounts in DB where type=Coach', function(done) {
      accounts.getAccounts({
        query: {
          acct_type: COACH
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        // Check that all Staff accounts returned
        assert.deepEqual(data, [ACCT_1, ACCT_2, ACCT_9]);
        done();
      });
    });

    it('it should get accounts pertaining to an auth0 id', function(done) {
      accounts.getAccounts({
        query: {
          auth0_id: ACCT_1.auth0_id
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        // Check that referenced account is returned
        assert.deepEqual(data, [ACCT_1]);
        done();
      });
    });

    it('it should get accounts pertaining to an id', function(done) {
      accounts.getAccounts({
        query: {
          account_id: ACCT_1.acct_id
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        // Check that referenced account is returned
        assert.deepEqual(data, [ACCT_1]);
        done();
      });
    });

    it('it should get accounts pertaining to a full name and email', function(done) {
      accounts.getAccounts({
        query: {
          first_name: ACCT_1.first_name,
          last_name: ACCT_1.last_name,
          email: ACCT_1.email
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        // Check that referenced account is returned
        assert.deepEqual(data, [ACCT_1]);
        done();
      });
    });

    it('it should get all accounts for a specific program', function(done) {
      accounts.getAccounts({
        query: {
          program_id: 1
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        assert.deepEqual([ACCT_7, ACCT_1, ACCT_6], data);
        done();
      });
    });

    it('it should get 0 accounts when a program id that DNE is passed', function(done) {
      accounts.getAccounts({
        query: {
          program_id: 999
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        assert.deepEqual([], data);
        done();
      });
    });

    it('it should get all accounts for a specific site', function(done) {
      accounts.getAccounts({
        query: {
          site_id: 1
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        assert.deepEqual([ACCT_7, ACCT_1, ACCT_6], data);
        done();
      });
    });

    it('it should get 0 accounts when a site id that DNE is passed', function(done) {
      accounts.getAccounts({
        query: {
          site_id: 999
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).then(function(data) {
        assert.deepEqual([], data);
        done();
      });
    });

    it('it should return a 501 error because of a malformed query', function(done) {
      accounts.getAccounts({
        query: {
          first_name: ACCT_1.first_name,
          email: ACCT_1.email
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'UnsupportedRequest', 501,
          'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
        done();
      });
    });
  });

  describe('updateAccount(req)', function() {
    var affected_accounts = ACCTS.slice();

    afterEach(function(done) {
      /* eslint-disable no-invalid-this */
      this.timeout(20000);
      /* eslint-enable no-invalid-this */
      Promise.each(affected_accounts, function(acct) {
        return resetAccount(acct);
      }).then(function() {
        affected_accounts = ACCTS.slice();
        done();
      });
    });

    it('it should update an account with all new fields', function(done) {
      var updates = {
        first_name: UPDATED_FIRST,
        last_name: UPDATED_LAST,
        email: UPDATED_EMAIL,
        acct_type: UPDATED_ACCT_TYPE
      };

      affected_accounts = [ACCT_5];

      updateAccountTester(ACCT_5, updates, ADMIN_AUTH0_ID, done);
    });

    it('it should update an account with a new first name', function(done) {
      var updates = {
        first_name: UPDATED_FIRST
      };

      affected_accounts = [ACCT_7];

      updateAccountTester(ACCT_7, updates, ADMIN_AUTH0_ID, done);
    });

    it('it should update an account with a new last name', function(done) {
      var updates = {
        last_name: UPDATED_LAST
      };

      affected_accounts = [ACCT_7];

      updateAccountTester(ACCT_7, updates, ADMIN_AUTH0_ID, done);
    });

    it('it should update an account with a new email', function(done) {
      var updates = {
        email: UPDATED_EMAIL
      };

      affected_accounts = [ACCT_7];

      updateAccountTester(ACCT_7, updates, ADMIN_AUTH0_ID, done);
    });

    it('it should update an account with a new auth level', function(done) {
      var updates = {
        acct_type: UPDATED_ACCT_TYPE
      };

      affected_accounts = [ACCT_7];

      updateAccountTester(ACCT_7, updates, ADMIN_AUTH0_ID, done);
    });

    it('it should return a 501 error because body is missing', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_1.acct_id
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'UnsupportedRequest', 501,
          'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
        auth0.getAuth0Id(ACCT_1.acct_id).then(function(auth0Id) {
          auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
            // check that the auth0 account did not get updated
            assertEqualAuth0DB(auth0Acct, ACCT_1);
            verifyNoAccountChanges(done);
          });
        });
      });
    });

    it('it should 400 because there is an unrecognized update key in the body', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_1.acct_id
        },
        body: {
          unknown: 'foobar'
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'UnsupportedRequest', 501,
          'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
        auth0.getAuth0Id(ACCT_1.acct_id).then(function(auth0Id) {
          auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
            // check that the auth0 account did not get updated
            assertEqualAuth0DB(auth0Acct, ACCT_1);
            verifyNoAccountChanges(done);
          });
        });
      });
    });


    it('should not update if request is missing params section', function(done) {
      accounts.updateAccount({
        body: {
          first_name: UPDATED_FIRST
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'UnsupportedRequest', 501,
          'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
        verifyNoAccountChanges(done);
      });
    });

    it('should not update if request is missing acct_id in params', function(done) {
      accounts.updateAccount({
        params: {
          something_stupid: 7
        },
        body: {
          first_name: UPDATED_FIRST
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'UnsupportedRequest', 501,
          'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
        verifyNoAccountChanges(done);
      });
    });

    it('it should return a 400 if given a non-positive integer account id', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: -1
        },
        body: {
          first_name: UPDATED_FIRST
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'InvalidArgumentError', 400,
          'Given acct_id is of invalid format (e.g. not an integer or negative)');
        verifyNoAccountChanges(done);
      });
    });

    it('it should return a 404 if the account id DNE', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: 999
        },
        body: {
          first_name: UPDATED_FIRST
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'ArgumentNotFoundError', 404,
          'Invalid request: The given acct_id does not exist in the database');
        verifyNoAccountChanges(done);
      });
    });

    it('it should 501 if no updates are provided in the body', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_1.acct_id
        },
        body: {},
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'UnsupportedRequest', 501,
          'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');
        verifyNoAccountChanges(done);
      });
    });

    // TODO: Auth0 API should be throwing an error because of duplicate email ... but it's not
    xit('it should 500 when it encounters an auth0 error and rollback the database updates', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_1.acct_id
        },
        body: {
          email: ACCT_1.email
        },
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'InternalServerError', 500,
            'The server encountered an unexpected condition which prevented it from fulfilling the request');
        verifyNoAccountChanges(done);
      });
    });

    xit('it should return a 403 error because staff cannot update other accounts', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_7.acct_id
        },
        body: {
          first_name: UPDATED_FIRST
        },
        auth: {
          auth0_id: STAFF_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualPermissionsError(err, STAFF);

        auth0.getAuth0Id(ACCT_7.acct_id).then(function(auth0Id) {
          auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
            // check that the auth0 account did not get updated
            assertEqualAuth0DB(auth0Acct, ACCT_7);
            verifyNoAccountChanges(done);
          });
        });
      });
    });

    xit('it should return a 403 error because coaches cannot update other accounts', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_7.acct_id
        },
        body: {
          first_name: UPDATED_FIRST
        },
        auth: {
          auth0_id: COACH_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualPermissionsError(err, COACH);

        auth0.getAuth0Id(ACCT_7.acct_id).then(function(auth0Id) {
          auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
            // check that the auth0 account did not get updated
            assertEqualAuth0DB(auth0Acct, ACCT_7);
            verifyNoAccountChanges(done);
          });
        });
      });
    });

    xit('it should return a 403 error because volunteers cannot update other accounts', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_7.acct_id
        },
        body: {
          first_name: UPDATED_FIRST
        },
        auth: {
          auth0_id: VOLUNTEER_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualPermissionsError(err, VOLUNTEER);

        auth0.getAuth0Id(ACCT_7.acct_id).then(function(auth0Id) {
          auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
            // check that the auth0 account did not get updated
            assertEqualAuth0DB(auth0Acct, ACCT_7);
            verifyNoAccountChanges(done);
          });
        });
      });
    });

    xit('it should return a 403 error because staff cannot update their own type', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_5.acct_id
        },
        body: {
          acct_type: ADMIN
        },
        auth: {
          auth0_id: STAFF_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualPermissionsError(err, STAFF_AUTH0_ID);

        auth0.getAuth0Id(ACCT_5.acct_id).then(function(auth0Id) {
          auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
            // check that the auth0 account did not get updated
            assertEqualAuth0DB(auth0Acct, ACCT_5);
            verifyNoAccountChanges(done);
          });
        });
      });
    });

    xit('it should return a 403 error because coaches cannot update their own type', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_1.acct_id
        },
        body: {
          acct_type: ADMIN
        },
        auth: {
          auth0_id: COACH_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualPermissionsError(err, COACH);

        auth0.getAuth0Id(ACCT_1.acct_id).then(function(auth0Id) {
          auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
            // check that the auth0 account did not get updated
            assertEqualAuth0DB(auth0Acct, ACCT_1);
            verifyNoAccountChanges(done);
          });
        });
      });
    });

    xit('it should return a 403 error because volunteers cannot update their own type', function(done) {
      accounts.updateAccount({
        params: {
          acct_id: ACCT_3.acct_id
        },
        body: {
          acct_type: ADMIN
        },
        auth: {
          auth0_id: VOLUNTEER_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualPermissionsError(err, VOLUNTEER);

        auth0.getAuth0Id(ACCT_3.acct_id).then(function(auth0Id) {
          auth0.getAuth0User(auth0Id).then(function(auth0Acct) {
            // check that the auth0 account did not get updated
            assertEqualAuth0DB(auth0Acct, ACCT_3);
            verifyNoAccountChanges(done);
          });
        });
      });
    });

    it('it should allow volunteers to update their own email and name', function(done) {
      var updates = {
        first_name: UPDATED_FIRST,
        last_name: UPDATED_LAST,
        email: UPDATED_EMAIL
      };

      affected_accounts = [ACCT_3];

      updateAccountTester(ACCT_3, updates, VOLUNTEER_AUTH0_ID, done);
    });

    it('it should allow coaches to update their own email and name', function(done) {
      var updates = {
        first_name: UPDATED_FIRST,
        last_name: UPDATED_LAST,
        email: UPDATED_EMAIL
      };

      affected_accounts = [ACCT_1];

      updateAccountTester(ACCT_1, updates, COACH_AUTH0_ID, done);
    });

    it('it should allow staff to update their own email and name', function(done) {
      var updates = {
        first_name: UPDATED_FIRST,
        last_name: UPDATED_LAST,
        email: UPDATED_EMAIL
      };

      affected_accounts = [ACCT_5];

      updateAccountTester(ACCT_5, updates, COACH_AUTH0_ID, done);
    });
  });

  describe('createAccount(req)', function() {
    afterEach(function(done) {
      /* eslint-disable no-invalid-this */
      this.timeout(10000);
      /* eslint-enable no-invalid-this */
      query('SELECT acct_id, auth0_id FROM Acct WHERE email = ?', [dummyAccount.email]).then(function(ids) {
        if (ids.length == 1) {
          setTimeout(function() {
            auth0.deleteAuth0User(ids[0].auth0_id).then(function() {
              query(accounts.DELETE_ACCT, [ids[0].acct_id]).then(function() {
                done();
              });
            });
          }, 3000);
        } else {
          done();
        }
      });
    });

    it('it should add an Admin account when requested by an existing admin', function(done) {
      var acct = Object.assign({}, dummyAccount);
      createAccountTester(acct, ADMIN_AUTH0_ID, done);
    });

    it('it should add a Staff account when requested by an existing admin', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = STAFF;
      createAccountTester(acct, ADMIN_AUTH0_ID, done);
    });

    it('it should add a volunteer account when requested by an existing admin', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = VOLUNTEER;
      createAccountTester(acct, ADMIN_AUTH0_ID, done);
    });

    it('it should add a coach account when requested by an existing admin', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = COACH;
      createAccountTester(acct, ADMIN_AUTH0_ID, done);
    });

    xit('it should return a 403 error because staff cannot create admin accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      createPermissionErrorTester(acct, STAFF_AUTH0_ID, done);
    });

    xit('it should return a 403 error because Volunteers cannot create admin accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      createPermissionErrorTester(acct, VOLUNTEER_AUTH0_ID, done);
    });

    xit('it should return a 403 error because Coaches cannot create staff accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = STAFF;
      createPermissionErrorTester(acct, COACH_AUTH0_ID, done);
    });

    xit('it should return a 403 error because coaches cannot create admin accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      createPermissionErrorTester(acct, COACH_AUTH0_ID, done);
    });

    xit('it should return a 403 error because volunteers cannot create staff accounts', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = STAFF;
      createPermissionErrorTester(acct, VOLUNTEER_AUTH0_ID, done);
    });

    it('it should return a 400 error because a first_name is missing', function(done) {
      createMissingFieldErrorTester('first_name', ADMIN_AUTH0_ID, done);
    });

    it('it should return a 400 error because a last_name is missing', function(done) {
      createMissingFieldErrorTester('last_name', ADMIN_AUTH0_ID, done);
    });

    it('it should return a 400 error because email is missing', function(done) {
      createMissingFieldErrorTester('email', ADMIN_AUTH0_ID, done);
    });

    it('it should return a 400 error because acct_type is missing', function(done) {
      createMissingFieldErrorTester('acct_type', ADMIN_AUTH0_ID, done);
    });

    it('it should return a 400 error because password is missing', function(done) {
      createMissingFieldErrorTester('password', ADMIN_AUTH0_ID, done);
    });

    it('it should return a 400 error because first_name is empty', function(done) {
      createEmptyFieldErrorTester('first_name', ADMIN_AUTH0_ID, done);
    });

    it('it should return a 400 error because last_name is empty', function(done) {
      createEmptyFieldErrorTester('last_name', ADMIN_AUTH0_ID, done);
    });

    it('it should return a 400 error because acct_type is empty', function(done) {
      createEmptyFieldErrorTester('acct_type', ADMIN_AUTH0_ID, done);
    });

    it('it should return a 400 error because acct_type is invalid', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.acct_type = 'Invalid';
      createAccountErrorTester(acct, ADMIN_AUTH0_ID, 'Bad Request', 400, 'Account type must be one of: Admin, Coach, Staff, Volunteer', done);
    });

    it('it should return a 400 error because the password does not meet requirements', function(done) {
      var acct = Object.assign({}, dummyAccount);
      acct.password = 'weak';
      createAccountErrorTester(acct, ADMIN_AUTH0_ID, 'Bad Request', 400, 'Password is too weak', done);
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
        deletePermissionErrorTester(COACH_AUTH0_ID, done);
      });
    });

    xit('it should 403 when a staff member tries to delete an account', function(done) {
      createDummyAccount().then(function() {
        deletePermissionErrorTester(STAFF_AUTH0_ID, done);
      });
    });

    xit('it should 403 when a volunteer tries to delete an account', function(done) {
      createDummyAccount().then(function() {
        deletePermissionErrorTester(VOLUNTEER_AUTH0_ID, done);
      });
    });

    it('it should delete an account if an admin requests the action', function(done) {
      createDummyAccount().then(function() {
        accounts.deleteAccount({
          params: {
            account_id: createdDBId
          },
          auth: {
            auth0_id: ADMIN_AUTH0_ID
          }
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
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
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
        auth: {
          auth0_id: ADMIN_AUTH0_ID
        }
      }).catch(function(err) {
        assertEqualError(err, 'Not Found', 404, 'No account with id 999 exists in the database.');
        verifyNoAccountChanges(done);
      });
    });
  });
});

'use strict';
const chai = require('chai'); // testing modules
const assert = chai.assert;
const accounts = require('../../routes/accounts'); // endpoint being tested
const utils = require('../../lib/utils');
// seed to reset db before each test
const seed = utils.seed;
// constants specifying the given type of account performing the requets
const accType = require('../../lib/constants');
// query function for getAllAccounts check
const query = utils.query;

const auth0 = require('../../lib/auth0_utils');
const MGMT = auth0.getManagementClient;
const auth0ID = auth0.getAuth0ID;


function getAllAccounts() {
  // Get contents of Accounts table in DB, used for asserts
  return query('SELECT acct_id, first_name, last_name, email, acct_type FROM Acct');
}

function assertEqualAuth0DB(auth0, db) {
  assert.equal(auth0.email, db.email);
  assert.equal(auth0.user_metadata.first_name, db.first_name);
  assert.equal(auth0.user_metadata.last_name, db.last_name);
  assert.equal(auth0.app_metadata.acct_type, db.acct_type);
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

function checkAuth0(userID, expected) {
  // confirms that the user is stored in Auth0s DB as exepcted
  return auth0.getAuth0User(userID).then(function(user) {
    return user && user.email === expected.email &&
      user.user_metadata.first_name === expected.first_name &&
      user.user_metadata.last_name === expected.last_name &&
      user.app_metadata.type === expected.acct_type;
  });
}

function deleteAuth0Acc(accID) {
  // delete the auth0 account for the supplied acct_id
  var params = {id: auth0ID(acc.acct_id)};

  MGMT.users.delete(params, function(err) {
    if (err) {
      console.error('Failed to remove user from Auth0');
      console.error(err);
    }
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

// get original states of the database tables
before(function() {
  // Acct table
  getAllAccounts().then(function(data) {
    initAcc = data;

    return query('SELECT * FROM AcctToProgram');
  });
});

beforeEach(function() {
  return seed();
});

describe('Accounts', function() {
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

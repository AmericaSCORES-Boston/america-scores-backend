// Set the env to test
process.env.NODE_ENV = 'test';

// Require the testing dependencies
var sinon = require('sinon');
var Promise = require('bluebird');
var pool = require('../../config/config').pool;
var config = require('../../config/config');
var chai = require('chai');
var assert = chai.assert;
var accounts = require('../../routes/accounts')

// Accounts testing block
describe('Accounts', function() {
  // before(function() {
  //   // runs before all tests in this block
  // });
  // // $$$ TODO: INSERT THINGS TO DO BEFORE EACH TEST
  // beforeEach(function() {
  //
  // });

  // mysql returns an array of objects(dict) representing each row
  // Test getStudents(req, res)
  describe('getAccounts(req, res)', function() {
    beforeEach(function() {
      app = require('../routes/accounts');
    })
    it('should return an empty array when the database is empty', function () {
      var res = {};

      var result = students.getAccounts(req, res);
      // res body should be an array
      assert.typeOf(result, 'array', 'res body should be an array');
      // res length should be 0
      assert.lengthOf(result, 0, 'res length should be 0');
      // res should have status 200

    });
  });

  describe('getAccount(req, res)', function() {
    var req = {
      account_id : '1234'
    };
    getAccount(req, res);
  })

  describe('updateAccount(req, res)', function() {
    updateAccount(req, res);
  })

  describe('deleteAccount(req, res)', function(){
    deleteAccount(req, res);
  })
});

/* What functions are you testing?

Do we need chai-http?
*/

// Set the env to test
process.env.NODE_ENV = 'test';

// Require the testing dependencies
var sinon = require('sinon'); // how is sinon used? To check if things are called?
var chai = require('chai');
var assert = chai.assert;

var students = require('../../routes/students')

// Students testing block
describe('Students', function() {
  // before(function() {
  //   // runs before all tests in this block
  // });
  // // $$$ TODO: INSERT THINGS TO DO BEFORE EACH TEST
  // beforeEach(function() {
  //
  // });

  // mysql returns an array of objects(dict) representing each row
  // Test getStudents(req, res)
  describe('getStudents(req, res)', function() {
    it('should return an empty array when the database is empty', function () {
      var req = {
        // create fake request here
      };

      var res = {};

      var result = students.getStudents(req, res);

      // res body should be an array
      assert.typeOf(result, 'array', 'res body should be an array');
      // res length should be 0
      assert.lengthOf(result, 0, 'res length should be 0');
      // res should have status 200

    });
  });

  // Test postStudent(req, res)
  describe('postStudent(req, res)', function() {
    it('should add a new students new students', function () {
      var req = {

      };

      var res = {};

      var result = students.postStudent(req, res);


    });
  });

  // Test getStudent(req, res)

  // Test updateStudent(req, res)

  // Test deleteStudent(req, res)



});

/* What functions are you testing?

Do we need chai-http?

Get all the student data

Add/create a new student

Get a specific student

Update a specific student’s info

Delete a specific student

Get all students for a site

Get students in given roster/program

Get student with given first and last name and birthdate
*/

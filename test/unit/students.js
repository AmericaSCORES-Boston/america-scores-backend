// Set the env to test
process.env.NODE_ENV = 'test';

// Require the testing dependencies
var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;

var students = require('../../routes/students');

// Example students
var percy = {
  'student_id': 123,
  'firstname': 'Percy',
  'lastname': 'Jackson',
  'dob': new Date(93, 7, 18)
};

var annabeth = {
  'student_id': 456,
  'firstname': 'Annabeth',
  'lastname': 'Chase',
  'dob': new Date(93, 6, 12)
};

var dave = {
  'student_id': 789,
  'firstname': 'Dave',
  'lastname': 'Strider',
  'dob': new Date(95, 11, 3)
};

// Students testing block
describe('Students', function() {
  // TODO: Do I need a beforeeach?

  describe('getStudents(req)', function() {
    it('should get all the students in the database', function() {
      // GET all doesn't need anything from the request, so pass in empty
      var promise = students.getStudents({});

      // When the promised data is returned, check it against the expected data
      promise.then(function(data) {
        assert.deepEqual({[percy, annabeth], data});
        done();
      });
    });
  });

  describe('postStudent(req)', function() {
    it('should add a new student to the database', function() {
      var req = {dave}; // NOTE: Is this the right form for the request? Double check.

      // NOTE: Should I check that the DB only has percy and annabeth before and
      // that dave wasn't already there?
      var promise = students.postStudent(req);

      promise.then(function() {
        return students.getStudents({}); // NOTE: is it bad form to call this?
        // Unit tests should stand alone and not assume the other functions work.
        // But then...how do I get the data to check that the change was made?
      })
      .then(function(data) {
        // Verify that the student was added
        assert.deepEqual({[percy, annabeth, dave], data});
        assert.length(data, 3);
        done();
      });
    });
  });

  // Test getStudent(req)
  describe('getStudent(req)', function() {
    it('should get a specific student by student_id', function() {
      var req = {

      };

      var promise = students.getStudent(req);

      promise.then(function(data) {
        done();
      });
    });
  });

  // Test updateStudent(req)
  describe('updateStudent(req)', function() {
    it('should update the information for a given student', function() {
      var req = {

      };

      var promise = students.updateStudent(req);

      promise.then(function(data) {

      });
    });
  });

  // Test deleteStudent(req)
  describe('deleteStudent(req)', function() {
    it('should delete a given student from the database', function() {
      var req = {

      };

      var promise = students.deleteStudent(req);

      promise.then(function(data) {

      });
    });
  });
});

/* What functions are you testing?

Get all the student data

Add/create a new student

Get a specific student

Update a specific student’s info

Delete a specific student

Get all students for a site

Get students in given roster/program

Get student with given first and last name and birthdate
*/

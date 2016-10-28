// Set the env to test
process.env.NODE_ENV = 'test';

// Require the testing dependencies
var sinon = require('sinon');
var chai = require('chai');
var assert = chai.assert;

// The file to be tested
var students = require('../../routes/students');

// Get DB connection for use in asserts
// TODO: Replace calls to getStudents in unrelated tests with actual queries
// to the test DB using a DB connection (SELECT * FROM Student)

// A function for getting all the student data in the database
// TODO: Replace this with the SQL call mentioned above so that we don't depend
// on a function written by you in every test
function getAllStudents() {
  return students.getStudents({});
}

// Create example students for expected results
var percy = {
  'student_id': 123,
  'firstname': 'Percy',
  'lastname': 'Jackson',
  'dob': new Date(93, 7, 18)
};

var perseus = {
  'student_id': 123,
  'firstname': 'Perseus',
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
  // NOTE: Do I need a beforeeach?
  describe('getStudents(req)', function() {
    it('should get all the students in the database', function() {
      // GET all doesn't need anything from the request, so pass in empty
      var promise = students.getStudents({});

      // When the promised data is returned, check it against the expected data
      promise.then(function(data) {
        assert.deepEqual([percy, annabeth], data);
        done();
      });
    });
  });

  describe('postStudent(req)', function() {
    it('should add a new student to the database', function() {
      var req = {dave}; // NOTE: Is this the right form for the request? Check.
      var studentCount;
      // Get the contents of the database before calling addStudent
      getAllStudents()
        .then(function(data) {
          // Count the number of students
          studentCount = data.length;
          // Call the function to be tested
          return students.postStudent(req);
        })
        .then(function() {
          // Get the contents of the database after calling postStudent
          return getAllStudents();
        })
        .then(function(data) {
          // Verify that the number of students in the DB increased by one
          assert.length(data, studentCount + 1);
          // Verify that the correct student data was added
          assert.deepEqual([percy, annabeth, dave], data);
          done();
        });
    });

    it('should __(what does SQL do?)_ if the student exists',
    function() {

    });

    // TODO Can you post a student without an ID and have SQL generate it for
    // you? Test!
  });

  describe('getStudent(req)', function() {
    it('should get an existing student by student_id', function() {
      var req = {
        params: {
          // The student_id is contained in the request
          student_id: 789
        }
      };

      var promise = students.getStudent(req);

      promise.then(function(data) {
        // Check that we received the correct student
        assert.deepEqual([dave], data);
        done();
      });
    });

    it('should __do what?__ when given a student_id that\'s not in the DB',
    function() {

    });

    it('should __do what?___ when given a student_id of invalid type',
    function () {

    });
  });

  // Test updateStudent(req)
  describe('updateStudent(req)', function() {
    it('should update the information for a given student', function() {
      var req = {
        params: {
          student_id: 123
        },
        data: {
          updateValues: {
            firstname: 'Perseus'
          }
        }
      };

      var studentCount;
      var oldDB;
      // Check the state of the object before the update
      getAllStudents()
        .then(function(data) {
          // Remember the number of students and the state of data before update
          studentCount = data.length;
          oldDB = data;

          // Call updateStudent
          return students.updateStudent(req);
        })
        .then(function() {
          // Get the DB after the update
          return getAllStudents();
        })
        .then(function(data) {
          // Assert that the number of students is the same as before
          assert.lengthOf(data, studentCount);
          // Assert that the old data and new data aren't the same
          assert.notDeepEqual(oldDB, data);
          // Assert that the new data reflects the update changes
          assert.deepEqual([perseus, annabeth], data);
          done();
        });
    });

    it('should __do what__ on attempt to update student that doesn\'t exist',
    function() {

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

Update a specific student’s info

Delete a specific student

Get all students for a site

Get students in given roster/program

Get student with given first and last name and birthdate
*/

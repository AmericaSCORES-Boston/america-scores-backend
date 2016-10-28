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
  'first_name': 'Percy',
  'last_name': 'Jackson',
  'dob': new Date(93, 7, 18)
};

var perseus = {
  'student_id': 123,
  'first_name': 'Perseus',
  'last_name': 'Jackson',
  'dob': new Date(93, 7, 18)
};

var annabeth = {
  'student_id': 456,
  'first_name': 'Annabeth',
  'last_name': 'Chase',
  'dob': new Date(93, 6, 12)
};

var dave = {
  'student_id': 789,
  'first_name': 'Dave',
  'last_name': 'Strider',
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
      var req = {data: dave};
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

    it('should return an error and not post if the student already exists',
    function() {
      var req = {data: annabeth};

      // Assert that an error is thrown when trying to add student already in DB
      assert.throw(function() {students.postStudent(req)}, Error);
      // Assert that the error message is correct
      var promise = students.postStudent(req);
      promise.then(function(result) {
        assert.equal(result.message,
        'Unable to add student because they already exist in the database');
        done();
      });
    });

    it('should not post a student if the request is missing a last_name',
    function() {
      var req = {
        data: {
          first_name: 'Korra',
          dob: new Date(94, 11, 18)
        }
      };

      // Assert that an error is thrown when last name is missing
      assert.throw(function() {students.postStudent(req)}, Error);
      // Assert that the error message is correct
      var promise = students.postStudent(req);
      promise.then(function(result) {
        assert.equal(result.message,
        // TODO(jacquelineali): for future JIRA, log which field is missing
        'Unable to add student due to missing fields');
        done();
      });
    });

    it('should not post a student if the request is missing a birthdate',
    function() {
      var req = {
        data: {
          first_name: 'Asami',
          last_name: 'Sato'
        }
      };

      // Assert that an error is thrown when fields are missing
      assert.throw(function() {students.postStudent(req)}, Error);
      // Assert that the error message is correct
      var promise = students.postStudent(req);
      promise.then(function(result) {
        assert.equal(result.message,
        // TODO(jacquelineali): for future JIRA, log which fields are missing
        'Unable to add student due to missing fields');
        done();
      });
    });

    it('should not post a student if the request is missing a first_name',
    function() {
      var req = {
        data: {
          last_name: 'Lupin',
          dob: new Date(65, 11, 18)
        }
      };

      // Assert that an error is thrown when fields are missing
      assert.throw(function() {students.postStudent(req)}, Error);
      // Assert that the error message is correct
      var promise = students.postStudent()
      .then(function(result) {
        assert.equal(result.message,
        // TODO(jacquelineali): for future JIRA, log which fields are missing
        'Unable to add student due to missing fields');
        done();
      });
    });
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

    it('should return an error when given a student_id that\'s not in the DB',
    function() {
      var req = {
        params: {
          // The student_id is contained in the request
          student_id: 617
        }
      }

      // Assert that an error is thrown when nonexistent ID is given
      assert.throw(function() {students.getStudent(req)}, Error);
      // Assert that the error message is correct
      var promise = students.getStudent(req);
      promise.then(function(result) {
          assert.equal(result.message,
          'Failed to get: The given student id is not in the database');
          done();
        });
    });

    it('should return an error when given a student_id of invalid type',
    function () {
      var req = {
        params: {
          // The student_id is contained in the request
          student_id: 'superbad'
        }
      }

      // Assert that an error is thrown when an invalid ID type is given
      assert.throw(function() {students.getStudent(req)}, Error);
      // Assert that the error message is correct
      var promise = students.getStudent(req);
      promise.then(function(result) {
        assert.equal(result.message,
        'Failed to get student. Invalid student_id type: must be an integer');
        done();
      });
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
            first_name: 'Perseus'
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

    it('should return an error for attempts to update nonexistent student',
    function() {
      var req = {
        params: {
          student_id: 777
        },
        data: {
          updateValues: {
            first_name: 'Karkat'
          }
        }
      };

      // Assert that an error is thrown when a nonexistent student is given
      assert.throw(function() {students.updateStudent(req)}, Error);
      // Assert that the error message is correct
      var promise = students.updateStudent(req);
      promise.then(function(result) {
        assert.equal(result.message,
        'Unable to update student because they have not yet been added');
        done();
      });



    });
  });

  describe('deleteStudent(req)', function() {
    it('should delete a given student from the database', function() {
      var req = {
        params: {
          student_id: 456
        }
      };

      var studentCount;
      var oldDB;
      // Check the state of the object before the update
      getAllStudents()
        .then(function(data) {
          // Remember the number of students and the state of data before update
          studentCount = data.length;

          // Call deleteStudent
          return students.deleteStudent(req);
        })
        .then(function() {
          // Get the current student data in the database
          return getAllStudents();
        })
        .then(function(data) {
          // Check that the number of students decreased by one
          assert.lengthOf(data, studentCount - 1);
          // Check that the correct student is no longer present
          assert.deepEqual([annabeth], data);
          done();
        });
      });
    });

    it('should _do what_ on attempt to delete student that doesn\'t exist',
    function() {

    });
  });
});

/* TODO: Test the following functions

Get all students for a site

Get students in given roster/program

Get student with given first and last name and birthdate
*/

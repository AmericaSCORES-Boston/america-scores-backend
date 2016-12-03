// Require the testing dependencies
const chai = require('chai');
const assert = chai.assert;

// Require query function for getAllStudents check
const query = require('../../lib/utils').query;

// Require seed to reset database before each test
const seed = require('../../lib/utils').seed;

// Require test accounts
// const constants = require('../../lib/constants');

// The file to be tested
const students = require('../../routes/students');

// Get contents of Students table in DB for use in asserts
function getAllStudents() {
  return query('SELECT * FROM Student');
}

// Save memory of old database
var oldDB;
var studentCount;
var oldPrograms;
var programMatchCount;

// Create example students for expected results
var percy = {
  'student_id': 1,
  'first_name': 'Percy',
  'last_name': 'Jackson',
  'dob': new Date(93, 7, 18)
};

var perseus = {
  'student_id': 1,
  'first_name': 'Perseus',
  'last_name': 'Jackson',
  'dob': new Date(93, 7, 18)
};

var percyNewDob = {
  'student_id': 1,
  'first_name': 'Percy',
  'last_name': 'Jackson',
  'dob': new Date(90, 2, 15)
};

var annabethURL = {
  'first_name': 'Annabeth',
  'last_name': 'Chase',
  'dob': '1993-07-12'
};

var annabeth = {
  'student_id': 2,
  'first_name': 'Annabeth',
  'last_name': 'Chase',
  'dob': new Date(93, 6, 12)
};

var magnus = {
  'student_id': 2,
  'first_name': 'Magnus',
  'last_name': 'Chase',
  'dob': new Date(93, 6, 12)
};

var brian = {
  'student_id': 3,
  'first_name': 'Brian',
  'last_name': 'Smith',
  'dob': new Date(93, 3, 12)
};

var daveURL = {
  'first_name': 'Dave',
  'last_name': 'Strider',
  'dob': '1995-12-03'
};

var dave = {
  'student_id': 5,
  'first_name': 'Dave',
  'last_name': 'Strider',
  'dob': new Date(95, 11, 3)
};

var pam = {
  'student_id': 4,
  'first_name': 'Pam',
  'last_name': 'Ho',
  'dob': new Date(93, 3, 12)
};

var poseidonsson = {
  'student_id': 1,
  'first_name': 'Percy',
  'last_name': 'Poseidonsson',
  'dob': new Date(93, 7, 18)
};

var hazel = {
  'student_id': 1,
  'first_name': 'Hazel',
  'last_name': 'Levesque',
  'dob': new Date(28, 11, 17)
};

// ADD BEFORE EACH TO reseed
beforeEach(function() {
  return seed();
});

// Get the original state of the database
before(function() {
  getAllStudents()
  .then(function(data) {
    // Remember the Student table
    oldDB = data;
    studentCount = data.length;

    return query('SELECT * FROM StudentToProgram');
  })
  .then(function(data) {
    // Remember the StudentToProgram table
    oldPrograms = data;
    programMatchCount = data.length;
  });
});

// Students testing block
describe('Students', function() {
  describe('getStudents(req)', function() {
    it('should get all the students in the database', function(done) {
      var promise = students.getStudents({
        // Express has empty query, params, and body by default in req
        query: {},
        params: {},
        body: {}
      });

      // When the promised data is returned, check it against the expected data
      promise.then(function(data) {
        assert.deepEqual([percy, annabeth, brian, pam], data);
        done();
      });
    });

    it('should be able to get a student using first, last name and birthday',
    function(done) {
      var req = {
        query: {
          first_name: 'Percy',
          last_name: 'Jackson',
          dob: '1993-08-18'
        }
      };

      var promise = students.getStudents(req);

      promise.then(function(data) {
        // Check that we received the correct student
        assert.deepEqual(data, [percy]);
        done();
      });
    });

    it('should give an error if birthdate is not parseable to a date object',
    function(done) {
      var req = {
        query: {
          first_name: 'Percy',
          last_name: 'Jackson',
          dob: '1992-34-54'
        }
      };

      var promise = students.getStudents(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Failed to get student due to invalid birthdate. Try yyyy-mm-dd.');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'dob');
        assert.equal(err.propertyValue, req.query.dob);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if birthdate is in an unexpected date format ' +
    '(e.g. MM-DD-YYYY instead of YYYY-MM-DD)',
    function(done) {
      var req = {
        query: {
          first_name: 'Percy',
          last_name: 'Jackson',
          dob: '08-18-1993'
        }
      };

      var promise = students.getStudents(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Failed to get student due to invalid birthdate. Try yyyy-mm-dd.');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'dob');
        assert.equal(err.propertyValue, req.query.dob);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if the request is not an option listed in ' +
    'the API documentation (unexpected format)', function(done) {
      var req = {
        query: {
          first_name: 'Annabeth'
        }
      };

      var promise = students.getStudents(req);
      promise.catch(function(err) {
        assert.equal(err.message,
          'The API does not support a request of this format. ' +
          ' See the documentation for a list of options.');

          assert.equal(err.name, 'UnsupportedRequest');
          assert.equal(err.status, 501);
          done();
      });
    });
  });

  describe('getStudentsByProgram(req)', function() {
    it('should get all the students for a given program',
    function(done) {
      var req = {
        params: {
          program_id: 1
        }
      };

      var promise = students.getStudentsByProgram(req);

      promise.then(function(data) {
        // Check that we received the correct students
        assert.deepEqual([percy, annabeth, pam], data);
        done();
      });
    });

    it('should give an error if the program_id is negative',
    function(done) {
      var req = {
        params: {
          program_id: -4
        }
      };

      var promise = students.getStudentsByProgram(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given program_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req.params.program_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if the program_id is not an integer',
    function(done) {
      var req = {
        params: {
          program_id: 'SuperbadInput'
        }
      };

      var req2 = {
        params: {
          program_id: 1.22
        }
      };

      var promise = students.getStudentsByProgram(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given program_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req.params.program_id);
        assert.equal(err.status, 400);
      });

      promise = students.getStudentsByProgram(req2);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given program_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req2.params.program_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if the program_id is not in the database',
    function(done) {
      var req = {
        params: {
          program_id: 4231
        }
      };

      var promise = students.getStudentsByProgram(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Invalid request: The given program_id does not exist in the' +
        ' database');

        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req.params.program_id);
        assert.equal(err.status, 404);
        done();
      });
    });
  });

  describe('getStudentsByEvent(req)', function() {
    it('should get all the students associated with a given event',
    function(done) {
      var req = {
        params: {
          event_id: 4
        }
      };

      var promise = students.getStudentsByEvent(req);

      promise.then(function(data) {
        // Check that we received the correct students
        assert.deepEqual([percy, annabeth, pam], data);
        done();
      });
    });

    it('should give an error if the event_id is negative',
    function(done) {
      var req = {
        params: {
          event_id: -4
        }
      };

      var promise = students.getStudentsByEvent(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given event_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'event_id');
        assert.equal(err.propertyValue, req.params.event_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if the event_id is not an integer',
    function(done) {
      var req = {
        params: {
          event_id: 'SuperbadInput'
        }
      };

      var req2 = {
        params: {
          event_id: 5.6
        }
      };

      var promise = students.getStudentsByEvent(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given event_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'event_id');
        assert.equal(err.propertyValue, req.params.event_id);
        assert.equal(err.status, 400);
      });

      promise = students.getStudentsByEvent(req2);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given event_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'event_id');
        assert.equal(err.propertyValue, req2.params.event_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if the event_id is not in the database',
    function(done) {
      var req = {
        params: {
          event_id: 423
        }
      };

      var promise = students.getStudentsByEvent(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Invalid request: The given event_id does not exist in the' +
        ' database');

        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.propertyName, 'event_id');
        assert.equal(err.propertyValue, req.params.event_id);
        assert.equal(err.status, 404);
        done();
      });
    });
  });

  describe('getStudentsBySite(req)', function() {
    it('should get all the students for a given site',
    function(done) {
      var req = {
        params: {
          site_id: 2
        }
      };

      students.getStudentsBySite(req)
      .then(function(data) {
        // Check that we received the correct students
        assert.deepEqual([brian], data);
        done();
      });
    });

    it('should give an error if the site_id is negative',
    function(done) {
      var req = {
        params: {
          site_id: -4
        }
      };

      var promise = students.getStudentsBySite(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given site_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'site_id');
        assert.equal(err.propertyValue, req.params.site_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if the site_id is not an integer',
    function(done) {
      var req = {
        params: {
          site_id: 'ADogNamedSpy'
        }
      };

      var req2 = {
        params: {
          site_id: 3.1
        }
      };

      var promise = students.getStudentsBySite(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given site_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'site_id');
        assert.equal(err.propertyValue, req.params.site_id);
        assert.equal(err.status, 400);
      });

      promise = students.getStudentsBySite(req2);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given site_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'site_id');
        assert.equal(err.propertyValue, req2.params.site_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if the site_id is not in the database',
    function(done) {
      var req = {
        params: {
          site_id: 1234
        }
      };

      var promise = students.getStudentsBySite(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Invalid request: The given site_id does not exist in the' +
        ' database');

        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.propertyName, 'site_id');
        assert.equal(err.propertyValue, req.params.site_id);
        assert.equal(err.status, 404);
        done();
      });
    });
  });

  describe('getStudent(req)', function() {
    it('should get an existing student by id', function(done) {
      var req = {
        params: {
          // The student_id is contained in the request
          student_id: 1
        }
      };

      var promise = students.getStudent(req);

      promise.then(function(data) {
        // Check that we received the correct student
        assert.deepEqual([percy], data);
        done();
      });
    });

    it('should not get if request is missing params section',
    function(done) {
      var req = {};

      students.getStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have a params section with a valid student_id');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not get if request is missing a student_id',
    function(done) {
      var req = {
        params: {

        }
      };

      students.getStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have a params section with a valid student_id');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should give an error if the student_id is negative',
    function(done) {
      var req = {
        params: {
          // The student_id is contained in the request
          student_id: -2
        }
      };

      var promise = students.getStudent(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given student_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'student_id');
        assert.equal(err.propertyValue, req.params.student_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should give an error if the student_id is not an integer',
    function(done) {
      var req = {
        params: {
          // The student_id is contained in the request
          student_id: 'superbad'
        }
      };

      var req2= {
        params: {
          // The student_id is contained in the request
          student_id: 867.5309
        }
      };

      var promise = students.getStudent(req);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given student_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'student_id');
        assert.equal(err.propertyValue, req.params.student_id);
        assert.equal(err.status, 400);
      });

      promise = students.getStudent(req2);
      promise.catch(function(err) {
        assert.equal(err.message,
        'Given student_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'student_id');
        assert.equal(err.propertyValue, req2.params.student_id);
        assert.equal(err.status, 400);
        done();
      });
    });

    it('should return an empty array if the student_id is not in the database',
    function(done) {
      var req = {
        params: {
          student_id: 5736
        }
      };

      students.getStudent(req)
      .then(function(data) {
        assert.deepEqual(data, []);
        assert.lengthOf(data, 0);
        done();
      });
    });
  });

  describe('createStudent(req)', function() {
    it('should add a new student to the database', function(done) {
      var req = {
        params: {
          program_id: 2
        },
        body: daveURL
      };

      students.createStudent(req)
      .then(function(data) {
        // Check that the new student is returned
        assert.deepEqual(data, [dave]);
        // Get the contents of the database after calling createStudent
        return getAllStudents();
      })
      .then(function(data) {
        // Verify that the number of students in the DB increased by one
        assert.lengthOf(data, studentCount + 1);
        // Verify that the correct student data was added
        assert.deepEqual([percy, annabeth, brian, pam, dave], data);
        // Verify the old data wasn't received
        assert.notDeepEqual(oldDB, data);

        return query('SELECT program_id FROM StudentToProgram ' +
        'WHERE student_id=5');
      })
      .then(function(data) {
        assert.deepEqual(data, [{
          program_id: req.params.program_id
        }]);
        done();
      });
    });

    it('should return an error and not post if the student already exists',
    function(done) {
      var req = {
        params: {
          program_id: 1
        },
        body: annabethURL
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Unable to create student: the student is already in ' +
          'the database');

        assert.equal(err.name, 'DatabaseConflictError');
        assert.equal(err.status, 409);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post if request is missing a body', function(done) {
      var req = {
        params: {
          program_id: 1
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have body and params sections. Within params, a ' +
          'valid program_id must be given. Within body, a valid first_name, ' +
          'last_name, and birthdate (dob) must be given.');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post if request is missing params section', function(done) {
      var req = {
        body: {
          first_name: 'Asami',
          last_name: 'Sato',
          dob: '1994-05-23'
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have body and params sections. Within params, a ' +
          'valid program_id must be given. Within body, a valid first_name, ' +
          'last_name, and birthdate (dob) must be given.');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post if request is missing a program_id', function(done) {
      var req = {
        params: {

        },
        body: {
          first_name: 'Asami',
          last_name: 'Sato',
          dob: '1994-05-23'
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have body and params sections. Within params, a ' +
          'valid program_id must be given. Within body, a valid first_name, ' +
          'last_name, and birthdate (dob) must be given.');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post a student if request is missing a last name',
    function(done) {
      var req = {
        params: {
          program_id: 1
        },
        body: {
          first_name: 'Korra',
          dob: '1994-11-18'
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have body and params sections. Within params, a ' +
          'valid program_id must be given. Within body, a valid first_name, ' +
          'last_name, and birthdate (dob) must be given.');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post a student if request is missing a birthdate',
    function(done) {
      var req = {
        params: {
          program_id: 1
        },
        body: {
          first_name: 'Asami',
          last_name: 'Sato'
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have body and params sections. Within params, a ' +
          'valid program_id must be given. Within body, a valid first_name, ' +
          'last_name, and birthdate (dob) must be given.');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post a student if the request is missing a first name',
    function(done) {
      var req = {
        params: {
          program_id: 2
        },
        body: {
          last_name: 'Lupin',
          dob: '1965-02-13'
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have body and params sections. Within params, a ' +
          'valid program_id must be given. Within body, a valid first_name, ' +
          'last_name, and birthdate (dob) must be given.');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post if the program_id not a positive integer',
    function(done) {
      var req = {
        params: {
          program_id: -2
        },
        body: {
          first_name: 'Hermione',
          last_name: 'Granger',
          dob: '1979-09-19'
        }
      };

      var req2 = {
        params: {
          program_id: 'badInput'
        },
        body: {
          first_name: 'Hermione',
          last_name: 'Granger',
          dob: '1979-09-19'
        }
      };

      var req3 = {
        params: {
          program_id: 1.5
        },
        body: {
          first_name: 'Hermione',
          last_name: 'Granger',
          dob: '1979-09-19'
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Given program_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req.params.program_id);
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
      });

      students.createStudent(req2)
      .catch(function(err) {
        assert.equal(err.message,
        'Given program_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req2.params.program_id);
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
      });

      students.createStudent(req3)
      .catch(function(err) {
        assert.equal(err.message,
        'Given program_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req3.params.program_id);
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post a student if the program_id is not in the database',
    function(done) {
      var req = {
        params: {
          program_id: 1234
        },
        body: {
          first_name: 'Hermione',
          last_name: 'Granger',
          dob: '1979-09-19'
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Invalid request: The given program_id does not exist' +
        ' in the database');

        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req.params.program_id);
        assert.equal(err.status, 404);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post if birthdate is not parseable to a date object',
    function(done) {
      var req = {
        params: {
          program_id: 1
        },
        body: {
          first_name: 'Hermione',
          last_name: 'Granger',
          dob: 'NotADate'
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Failed due to invalid birthdate. Try yyyy-mm-dd.');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'dob');
        assert.equal(err.propertyValue, req.body.dob);
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not post if birthdate is in an unexpected date format ' +
    '(e.g. MM-DD-YYYY instead of YYYY-MM-DD)', function(done) {
      var req = {
        params: {
          program_id: 1
        },
        body: {
          first_name: 'Hermione',
          last_name: 'Granger',
          dob: '10-05-1945'
        }
      };

      students.createStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Failed due to invalid birthdate. Try yyyy-mm-dd.');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'dob');
        assert.equal(err.propertyValue, req.body.dob);
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });
  });

  describe('updateStudent(req)', function() {
    it('should update the first_name for a given student', function(done) {
      var req = {
        params: {
          student_id: 1
        },
        body: {
          first_name: 'Perseus'
        }
      };

      students.updateStudent(req)
      .then(function(data) {
        // Check that the updated student is returned
        assert.deepEqual(data, [perseus]);

        // Get the DB after the update
        return getAllStudents();
      })
      .then(function(data) {
        // Assert that the number of students is the same as before
        assert.lengthOf(data, studentCount);
        // Assert that the old data and new data aren't the same
        assert.notDeepEqual(oldDB, data);
        // Assert that the new data reflects the update changes
        assert.deepEqual([perseus, annabeth, brian, pam], data);
        done();
      });
    });

    it('should update the last_name for a given student', function(done) {
      var req = {
        params: {
          student_id: 1
        },
        body: {
          last_name: 'Poseidonsson'
        }
      };

      students.updateStudent(req)
      .then(function(data) {
        // Check that the updated student is returned
        assert.deepEqual(data, [poseidonsson]);

        // Get the DB after the update
        return getAllStudents();
      })
      .then(function(data) {
        // Assert that the number of students is the same as before
        assert.lengthOf(data, studentCount);
        // Assert that the old data and new data aren't the same
        assert.notDeepEqual(oldDB, data);
        // Assert that the new data reflects the update changes
        assert.deepEqual([poseidonsson, annabeth, brian, pam], data);
        done();
      });
    });

    it('should update the birthdate for a given student', function(done) {
      var req = {
        params: {
          student_id: 1
        },
        body: {
          dob: '1990-03-15'
        }
      };

      students.updateStudent(req)
      .then(function(data) {
        // Check that the updated student is returned
        assert.deepEqual(data, [percyNewDob]);

        // Get the DB after the update
        return getAllStudents();
      })
      .then(function(data) {
        // Assert that the number of students is the same as before
        assert.lengthOf(data, studentCount);
        // Assert that the old data and new data aren't the same
        assert.notDeepEqual(oldDB, data);
        // Assert that the new data reflects the update changes
        assert.deepEqual([percyNewDob, annabeth, brian, pam], data);
        done();
      });
    });

    it('should update multiple fields for a given student', function(done) {
      var req = {
        params: {
          student_id: 1
        },
        body: {
          first_name: 'Hazel',
          last_name: 'Levesque',
          dob: '1928-12-17'
        }
      };

      students.updateStudent(req)
      .then(function(data) {
        // Check that the updated student is returned
        assert.deepEqual(data, [hazel]);

        // Get the DB after the update
        return getAllStudents();
      })
      .then(function(data) {
        // Assert that the number of students is the same as before
        assert.lengthOf(data, studentCount);
        // Assert that the old data and new data aren't the same
        assert.notDeepEqual(oldDB, data);
        // Assert that the new data reflects the update changes
        assert.deepEqual([{
          'student_id': 1,
          'first_name': 'Hazel',
          'last_name': 'Levesque',
          'dob': new Date(28, 11, 17)
        }, annabeth, brian, pam], data);
        done();
      });
    });

    it('should not update if request is missing a body', function(done) {
      var req = {
        params: {
          student_id: 1
        }
      };

      students.updateStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have body and params sections. Within params, a ' +
          'valid student_id must be given. Body should contain updated ' +
          'values for fields to be updated.');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });

    it('should not update if request is missing params section', function(done) {
      var req = {
        body: {
          first_name: 'Stiles',
          last_name: 'Stilinski'
        }
      };

      students.updateStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have body and params sections. Within params, a ' +
          'valid student_id must be given. Body should contain updated ' +
          'values for fields to be updated.');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });

    it('should not update if request is missing student_id', function(done) {
      var req = {
        params: {
          program_id: 2
        },
        body: {
          first_name: 'Stiles',
          last_name: 'Stilinski'
        }
      };

      students.updateStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have body and params sections. Within params, a ' +
          'valid student_id must be given. Body should contain updated ' +
          'values for fields to be updated.');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });

    it('should return an error if birthdate is not in valid format',
    function(done) {
      var req = {
        params: {
          student_id: 1
        },
        body: {
          dob: '1994-33-22'
        }
      };

      students.updateStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Failed due to invalid birthdate. Try yyyy-mm-dd.');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'dob');
        assert.equal(err.propertyValue, req.body.dob);
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });

    it('should give an error if the student_id is not a positive integer',
    function(done) {
      var req = {
        params: {
          student_id: -2
        },
        body: {
          dob: '1994-33-22'
        }
      };

      students.updateStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Given student_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'student_id');
        assert.equal(err.propertyValue, req.params.student_id);
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });

    it('should give an error if the student_id is not in the database',
    function(done) {
      var req = {
        params: {
          student_id: 777
        },
        body: {
          first_name: 'Karkat'
        }
      };

      students.updateStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Invalid request: The given student_id does not exist' +
        ' in the database');

        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.propertyName, 'student_id');
        assert.equal(err.propertyValue, req.params.student_id);
        assert.equal(err.status, 404);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });

    it('should update a student\'s program', function(done) {
      var req = {
        params: {
          student_id: 2,
          program_id: 3
        },
        body: {
        }
      };

      students.updateStudent(req)
      .then(function(data) {
        // Check that the updated student is returned
        assert.deepEqual(data, [annabeth]);

        // Get the DB after the update
        return getAllStudents();
      })
      .then(function(data) {
        // Assert that the number of students is the same as before
        assert.lengthOf(data, studentCount);
        // Assert that the old data and new student data are the same
        assert.deepEqual(oldDB, data);

        // Check that program was updated
        return query('SELECT program_id FROM StudentToProgram ' +
        'WHERE student_id=' + req.params.student_id);
      })
      .then(function(data) {
        // Assert that the program_id is the same as the update request.
        assert.deepEqual(data, [{program_id: req.params.program_id}]);
        done();
      });
    });

    it('should update a student\'s program and other fields', function(done) {
      var req = {
        params: {
          student_id: 2,
          program_id: 3
        },
        body: {
          first_name: 'Magnus'
        }
      };

      students.updateStudent(req)
      .then(function(data) {
        // Check that the updated student is returned
        assert.deepEqual(data, [magnus]);

        // Get the DB after the update
        return getAllStudents();
      })
      .then(function(data) {
        // Assert that the number of students is the same as before
        assert.lengthOf(data, studentCount);
        // Assert that the old data and new data aren't the same
        assert.notDeepEqual(oldDB, data);
        // Assert that the new data reflects the update changes
        assert.deepEqual([percy, magnus, brian, pam], data);

        // Check that program was updated
        return query('SELECT program_id FROM StudentToProgram ' +
        'WHERE student_id=' + req.params.student_id);
      })
      .then(function(data) {
        // Assert that the program_id is the same as the update request.
        assert.deepEqual(data, [{program_id: req.params.program_id}]);
        done();
      });
    });

    it('should give an error if the program_id is not a positive integer',
    function(done) {
      var req = {
        params: {
          student_id: 2,
          program_id: -1
        },
        body: {
          dob: '1994-07-22'
        }
      };

      students.updateStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Given program_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req.params.program_id);
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });

    it('should give an error if the program_id is not in the database',
    function(done) {
      var req = {
        params: {
          student_id: 1,
          program_id: 323
        },
        body: {
          first_name: 'Karkat'
        }
      };

      students.updateStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Invalid request: The given program_id does not exist' +
        ' in the database');

        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.propertyName, 'program_id');
        assert.equal(err.propertyValue, req.params.program_id);
        assert.equal(err.status, 404);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });
  });

  describe('deleteStudent(req)', function() {
    it('should delete a given student from the database', function(done) {
      var req = {
        params: {
          student_id: 2
        }
      };

      students.deleteStudent(req)
      .then(function(data) {
        // Check that the updated student is returned
        assert.deepEqual(data, [annabeth]);

        // Get the current student data in the database
        return getAllStudents();
      })
      .then(function(data) {
        // Check that the number of students decreased by one
        assert.lengthOf(data, studentCount - 1);
        // Check that the data is not equal to the old DB state
        assert.notDeepEqual(oldDB, data);
        // Check that the correct student is no longer present
        assert.deepEqual([percy, brian, pam], data);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        // The rows for the student in StudentToProgram should be deleted
        assert.notDeepEqual(oldPrograms, data);
        assert.lengthOf(data, programMatchCount - 1);
        assert.deepEqual(data, [{
          id: 1,
          student_id: 1,
          program_id: 1
        },
        {
          id: 3,
          student_id: 4,
          program_id: 1
        },
        {
          id: 4,
          student_id: 3,
          program_id: 2
        }]);

        return query('SELECT * FROM Measurement');
      })
      .then(function(data) {
        // The matching rows in Measurement should also be deleted
        assert.deepEqual(data, [{
          measurement_id: 1,
          student_id: 1,
          event_id: 1,
          height: 5,
          weight: 5,
          pacer: 5
        },
        {
          measurement_id: 2,
          student_id: 1,
          event_id: 2,
          height: 7,
          weight: 7,
          pacer: 7
        },
        {
          measurement_id: 6,
          student_id: 4,
          event_id: 2,
          height: 4,
          weight: 12,
          pacer: 421
        }]);
        done();
      });
    });

    it('should not get if request is missing params section',
    function(done) {
      var req = {};

      students.deleteStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have a params section with a valid student_id');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should not get if request is missing a student_id',
    function(done) {
      var req = {
        params: {

        }
      };

      students.deleteStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
          'Request must have a params section with a valid student_id');

        assert.equal(err.name, 'MissingFieldError');
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        done();
      });
    });

    it('should give an error if student_id is not a positive integer',
    function(done) {
      var req = {
        params: {
          student_id: 1.33
        }
      };

      students.deleteStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Given student_id is of invalid format (e.g. not an integer or' +
        ' negative)');

        assert.equal(err.name, 'InvalidArgumentError');
        assert.equal(err.propertyName, 'student_id');
        assert.equal(err.propertyValue, req.params.student_id);
        assert.equal(err.status, 400);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });

    it('should give an error if the student_id is not in the database',
    function(done) {
      var req = {
        params: {
          student_id: 617
        }
      };

      students.deleteStudent(req)
      .catch(function(err) {
        assert.equal(err.message,
        'Invalid request: The given student_id does not exist' +
        ' in the database');

        assert.equal(err.name, 'ArgumentNotFoundError');
        assert.equal(err.propertyName, 'student_id');
        assert.equal(err.propertyValue, req.params.student_id);
        assert.equal(err.status, 404);

        return getAllStudents();
      })
      .then(function(data) {
        // Check that nothing changed
        assert.deepEqual(oldDB, data);
        assert.lengthOf(data, studentCount);

        return query('SELECT * FROM StudentToProgram');
      })
      .then(function(data) {
        assert.deepEqual(oldPrograms, data);
        assert.lengthOf(oldPrograms, programMatchCount);
        done();
      });
    });
  });
});
// TODO: Future-JIRA Factor out the "Is database unchanged?" check into
// a separate method to avoid repeated code

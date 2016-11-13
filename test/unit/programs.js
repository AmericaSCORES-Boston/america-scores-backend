process.env.NODE_ENV = 'test';
var programs = require('../../routes/programs');
const chai = require('chai');
const assert = chai.assert;


const program1 = { program_id: 1, site_id: 1, program_name: 'test program' };
const program2 = { program_id: 2, site_id: 2, program_name: 'test program 2' };
const program3 = { program_id: 3, site_id: 10, program_name: 'test program 3' };
const program4 = { program_id: 4, site_id: 11, program_name: 'test program 4' };
var allPrograms = [program1, program2, program3, program4];

var programsDeleted = [program2, program3, program4];
const newProgram = { program_id: 5, site_id: 5, program_name: 'new test program' };
var programsNew = [program1, program2, program3, program4, newProgram];
const updatedProgram = { program_id: 1, site_id: 1, program_name: 'updated program' };

describe('GET', function(done) {
  it('/programs', function(done) {
    var req = {
      params : {

      },
    };
    var promise = programs.getPrograms(req);
    promise.then(function(data) {
      assert.deepEqual(allPrograms, data);
      done();
    });
  });
  it('/programs/:program_id', function(done) {
    var req = {
      params : {
        program_id : 1
      },
    };
    var promise = programs.getProgram(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      done();
    });
  });
  it('/programs/:program_id (nonexistent)', function(done) {
    var req = {
      params : {
        program_id : -1
      },
    };
    var promise = programs.getProgram(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/sites/:site_id/programs', function(done) {
    var req = {
      params : {
        site_id : 1
      },
    };
    var promise = programs.getPrograms(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      done();
    });
  });
  it('/sites/:site_id/programs (nonexistent)', function(done) {
    var req = {
      params : {
        site_id : -1
      },
    };
    var promise = programs.getPrograms(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  xit('/students/:student_id/programs', function(done) {
    var req = {
      params : {
        student_id : 2
      },
    };
    var promise = programs.getPrograms(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      done();
    });
  });
  xit('/accounts/:account_id/programs', function(done) {
    var req = {
      params : {
        account_id : 7
      },
    };
    var promise = programs.getPrograms(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      done();
    });
  });
});

describe('POST', function() {
  xit('/sites/:site_id/programs', function(done) {
    var req = {
      params : {
        site_id: 5,
      },
      body : {
        name : 'new test program'
      }
    };
    var promise = programs.createProgram(req);
    promise.then(function(data) {
      assert.deepEqual(programsNew, programs.getPrograms({}).then(function(data) {
        return data;
      }))
      assert.deepEqual([newProgram], data);
    });
  });
  xit('/sites/:site_id/programs', function(done) {
    var req = {
      params : {
        site_id: -1,
      },
      body : {
        name : 'new test program'
      }
    };
    var promise = programs.createProgram(req);
    promise.then(function(data) {
      assert.deepEqual(allPrograms, programs.getPrograms({}).then(function(data) {
        return data;
      }))
      assert.deepEqual([], data);
    });
  });
});

describe('PUT', function() {
  xit('/programs/:program_id', function(done) {
    var req = {
      params : {
        program_id: 1,
      },
      body : {
        name : 'updatedProgram'
      }
    };
    var promise = programs.updateProgram(req);
    promise.then(function(data) {
      assert.deepEqual([updatedProgram], data);
      programs.getProgram({params : {program_id : 1}}).then(function (data) {
        assert.equal(data.name, req.body.name);
      })
      done();
    });
  });
  xit('/programs/:program_id', function(done) {
    var originalName = programs.getProgram({params : {program_id : 1}}).then(function(data) {
      return data;
    });
    var req = {
      params : {
        program_id: -1,
      },
      body : {
        name : 'updatedProgram'
      }
    };
    var promise = programs.updateProgram(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      programs.getProgram({params : {program_id : 1}}).then(function (data) {
        assert.equal(data.name, originalName);
      })
      done();
    });
  });
});

describe('DELETE', function() {
  xit('/programs/:program_id', function(done) {
    var req = {
      params : {
        program_id: 1,
      },
    };
    var promise = programs.deleteProgram(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      programs.getPrograms({}).then(function (data) {
        assert.deepEqual(programsDelete, data);
      });
      done();
    });
  });
  xit('/programs/:program_id (nonexistent)', function(done) {
    var req = {
      params : {
        program_id: -1,
      },
    };
    var promise = programs.deleteProgram(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
});

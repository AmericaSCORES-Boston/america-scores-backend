process.env.NODE_ENV = 'development';
const programs = require('../../routes/programs');
const seed = require('../../lib/utils').seed;
const chai = require('chai');
const assert = chai.assert;

const program1 = {program_id: 1, site_id: 1, program_name: 'LMElementaryBoys'};
const program2 = {program_id: 2, site_id: 2, program_name: 'YawkeyGirls'};
const program3 = {program_id: 3, site_id: 10, program_name: 'PHElementaryBoys'};
const program4 = {program_id: 4, site_id: 11, program_name: 'YMCAGirls'};
const allPrograms = [program1, program2, program3, program4];
const programsDeleted = [program2, program3, program4];
const newProgram = {program_id: 5, site_id: 5, program_name: 'New'};
const programsNew = [program1, program2, program3, program4, newProgram];
const updatedProgram = {program_id: 1, site_id: 1, program_name: 'Updated'};
const programsUpdated = [updatedProgram, program2, program3, program4];

describe('GET', function(done) {
  it('/programs', function(done) {
    var req = {
      params: {
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
      params: {
        program_id: 1
      },
    };
    var promise = programs.getProgram(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      done();
    });
  });
  it('/programs/:program_id (nonexistent program_id)', function(done) {
    var req = {
      params: {
        program_id: -1
      },
    };
    var promise = programs.getProgram(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/programs/:program_id (invalid program_id)', function(done) {
    var req = {
      params: {
        program_id: 'id'
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
      params: {
        site_id: 1
      },
    };
    var promise = programs.getProgramsBySite(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      done();
    });
  });
  it('/sites/:site_id/programs (nonexistent site_id)', function(done) {
    var req = {
      params: {
        site_id: -1
      },
    };
    var promise = programs.getProgramsBySite(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/sites/:site_id/programs (invalid site_id)', function(done) {
    var req = {
      params: {
        site_id: 'id'
      },
    };
    var promise = programs.getProgramsBySite(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/students/:student_id/programs', function(done) {
    var req = {
      params: {
        student_id: 2
      },
    };
    var promise = programs.getProgramsByStudent(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      done();
    });
  });
  it('/students/:student_id/programs (nonexistent student_id)', function(done) {
    var req = {
      params: {
        student_id: -1
      },
    };
    var promise = programs.getProgramsByStudent(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/students/:student_id/programs (invalid student_id)', function(done) {
    var req = {
      params: {
        student_id: 'id'
      },
    };
    var promise = programs.getProgramsByStudent(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/accounts/:account_id/programs', function(done) {
    var req = {
      params: {
        account_id: 7
      },
    };
    var promise = programs.getProgramsByAccount(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      done();
    });
  });
  it('/accounts/:account_id/programs (nonexistent account_id)', function(done) {
    var req = {
      params: {
        account_id: -1
      },
    };
    var promise = programs.getProgramsByAccount(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/accounts/:account_id/programs (invalid account_id)', function(done) {
    var req = {
      params: {
        account_id: 'id'
      },
    };
    var promise = programs.getProgramsByAccount(req);
    promise.then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
});

describe('POST', function() {
  before(function(done) {
    seed().then(function() {
      done();
    });
  });
  afterEach(function(done) {
    seed().then(function() {
      done();
    });
  });
  it('/sites/:site_id/programs', function(done) {
    var req = {
      params: {
        site_id: 5,
      },
      body: {
        program_name: 'New'
      }
    };
    var promise = programs.createProgram(req);
    promise.then(function(data) {
      programs.getPrograms().then(function(data) {
        assert.deepEqual(programsNew, data);
      });
      assert.deepEqual([newProgram], data);
      done();
    });
  });
  it('/sites/:site_id/programs (invalid site_id)', function(done) {
    var req = {
      params: {
        site_id: 'id',
      },
      body: {
        program_name: 'New'
      }
    };
    programs.createProgram(req).catch(function(err) {
      assert.equal(err.status, 400);
      done();
    });
  });
  it('/sites/:site_id/programs (nonexistent site_id)', function(done) {
    var req = {
      params: {
        site_id: -1,
      },
      body: {
        program_name: 'New'
      }
    };
    programs.createProgram(req).catch(function(err) {
      assert.equal(err.status, 404);
      done();
    });
  });
  it('/sites/:site_id/programs (invalid body)', function(done) {
    var req = {
      params: {
        site_id: 1,
      },
      body: {
      }
    };
    programs.createProgram(req).catch(function(err) {
      assert.equal(err.status, 400);
      done();
    });
  });
});

describe('PUT', function() {
  before(function(done) {
    seed().then(function() {
      done();
    });
  });
  afterEach(function(done) {
    seed().then(function() {
      done();
    });
  });
  it('/programs/:program_id', function(done) {
    var req = {
      params: {
        program_id: 1,
      },
      body: {
        program_name: 'Updated'
      }
    };
    var promise = programs.updateProgram(req);
    promise.then(function(data) {
      programs.getProgram({params: {program_id: 1}}).then(function(data) {
        assert.equal(data.name, req.body.name);
      });
      programs.getPrograms().then(function(data) {
        assert.deepEqual(programsUpdated, data);
      });
      assert.deepEqual([updatedProgram], data);
      done();
    });
  });
  it('/programs/:program_id (nonexistent program_id)', function(done) {
    var req = {
      params: {
        program_id: -1,
      },
      body: {
        program_name: 'Updated'
      }
    };
    programs.updateProgram(req).then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/programs/:program_id (invalid program_id)', function(done) {
    var req = {
      params: {
        program_id: 'ID',
      },
      body: {
        program_name: 'Updated'
      }
    };
    programs.updateProgram(req).then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/programs/:program_id (invalid body)', function(done) {
    var req = {
      params: {
        program_id: 1,
      },
      body: {
      }
    };
    programs.updateProgram(req).then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
});

describe('DELETE', function() {
  before(function(done) {
    seed().then(function() {
      done();
    });
  });
  afterEach(function(done) {
    seed().then(function() {
      done();
    });
  });
  it('/programs/:program_id', function(done) {
    var req = {
      params: {
        program_id: 1,
      },
    };
    var promise = programs.deleteProgram(req);
    promise.then(function(data) {
      programs.getPrograms().then(function(data) {
        assert.deepEqual(programsDeleted, data);
      });
      done();
    });
  });
  it('/programs/:program_id (nonexistent program_id)', function(done) {
    var req = {
      params: {
        program_id: -1,
      },
    };

    programs.deleteProgram(req).then(function(data) {
      assert.deepEqual([], data);
      done();
    });
  });
  it('/programs/:program_id (invalid program_id)', function(done) {
    var req = {
      params: {
        program_id: 'id'
      },
    };
    programs.deleteProgram(req).catch(function(err) {
      assert.equal(err.status, 400);
      done();
    });
  });
});

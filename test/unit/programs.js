process.env.NODE_ENV = 'development';
const programs = require('../../routes/programs');
const seed = require('../../lib/utils').seed;
const chai = require('chai');
const assert = chai.assert;

const program1 = {program_id: 1, site_id: 1, program_name: 'LMElementaryBoys'};
const program2 = {program_id: 2, site_id: 2, program_name: 'YawkeyGirls'};
const program3 = {program_id: 3, site_id: 10, program_name: 'PHElementaryBoys'};
const program4 = {program_id: 4, site_id: 11, program_name: 'YMCAGirls'};
var allPrograms = [program1, program2, program3, program4];

var programsDeleted = [program2, program3, program4];
const newProgram = {program_id: 5, site_id: 5, program_name: 'new test program'};
var programsNew = [program1, program2, program3, program4, newProgram];
const updatedProgram = {program_id: 1, site_id: 1, program_name: 'updated program'};

describe('GET', function(done) {
  it('/programs', function(done) {
    var req = {
      params: {
      },
    };
    var promise = programs.getPrograms(req);
    promise.then(function(data) {
      console.log(data);
      assert.deepEqual(allPrograms, data);
      done();
    });
  });
  xit('/programs/:program_id', function(done) {
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
  // xit('/programs/:program_id (invalid program_id)', function(done) {
  //   var req = {
  //     params: {
  //       program_id: -1
  //     },
  //   };
  //   var promise = programs.getProgram(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([], data);
  //     done();
  //   });
  // });
  // xit('/programs/:program_id (invalid program_id)', function(done) {
  //   var req = {
  //     params: {
  //       program_id: 'id'
  //     },
  //   };
  //   var promise = programs.getProgram(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([], data);
  //     done();
  //   });
  // });
  // it('/programs/:program_id (nonexistent program_id)', function(done) {
  //   var req = {
  //     params: {
  //       program_id: 9999
  //     },
  //   };
  //   var promise = programs.getProgram(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([], data);
  //     done();
  //   });
  // });
  xit('/sites/:site_id/programs', function(done) {
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
  // xit('/sites/:site_id/programs (invalid site_id)', function(done) {
  //   var req = {
  //     params: {
  //       site_id: -1
  //     },
  //   };
  //   var promise = programs.getPrograms(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([], data);
  //     done();
  //   });
  // });
  // xit('/sites/:site_id/programs (invalid site_id)', function(done) {
  //   var req = {
  //     params: {
  //       site_id: 'id'
  //     },
  //   };
  //   var promise = programs.getPrograms(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([], data);
  //     done();
  //   });
  // });
  // xit('/sites/:site_id/programs (nonexistent site_id)', function(done) {
  //   var req = {
  //     params: {
  //       site_id: 9999
  //     },
  //   };
  //   var promise = programs.getPrograms(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([], data);
  //     done();
  //   });
  // });
  xit('/students/:student_id/programs', function(done) {
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
  // xit('/students/:student_id/programs (invalid student_id)', function(done) {
  //   var req = {
  //     params: {
  //       student_id: -1
  //     },
  //   };
  //   var promise = programs.getPrograms(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([program1], data);
  //     done();
  //   });
  // });
  // xit('/students/:student_id/programs (invalid student_id)', function(done) {
  //   var req = {
  //     params: {
  //       student_id: 'id'
  //     },
  //   };
  //   var promise = programs.getPrograms(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([program1], data);
  //     done();
  //   });
  // });
  // xit('/students/:student_id/programs (nonexistent student_id)', function(done) {
  //   var req = {
  //     params: {
  //       student_id: 9999
  //     },
  //   };
  //   var promise = programs.getPrograms(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([program1], data);
  //     done();
  //   });
  // });
  xit('/accounts/:account_id/programs', function(done) {
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
  // xit('/accounts/:account_id/programs (invalid account_id)', function(done) {
  //   var req = {
  //     params: {
  //       account_id: -1
  //     },
  //   };
  //   var promise = programs.getPrograms(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([], data);
  //     done();
  //   });
  // });
  // xit('/accounts/:account_id/programs (invalid account_id)', function(done) {
  //   var req = {
  //     params: {
  //       account_id: 'id'
  //     },
  //   };
  //   var promise = programs.getPrograms(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([], data);
  //     done();
  //   });
  // });
  // xit('/accounts/:account_id/programs (nonexistent account_id)', function(done) {
  //   var req = {
  //     params: {
  //       account_id: 9999
  //     },
  //   };
  //   var promise = programs.getPrograms(req);
  //   promise.then(function(data) {
  //     assert.deepEqual([], data);
  //     done();
  //   });
  // });
});

describe('POST', function() {
  afterEach(function(done) {
    seed().then(function(done) {
      done();
    });
  });
  xit('/sites/:site_id/programs', function(done) {
    var req = {
      params: {
        site_id: 5,
      },
      body: {
        name: 'new test program'
      }
    };
    var promise = programs.createProgram(req);
    promise.then(function(data) {
      assert.deepEqual(programsNew, programs.getPrograms({}).then(function(data) {
        return data;
      }));
      assert.deepEqual([newProgram], data);
    });
  });
  xit('/sites/:site_id/programs (invalid site_id)', function(done) {
    var req = {
      params: {
        site_id: -1,
      },
      body: {
        name: 'new test program'
      }
    };
    var promise = programs.createProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not create new program: Given program_id is invalid (e.g. not an integer or negative)');
      assert.equal(err.name, 'InvalidArgumentError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.program_id);
      assert.equal(err.status, 400);
      done();
    });
  });
  xit('/sites/:site_id/programs (invalid site_id)', function(done) {
    var req = {
      params: {
        site_id: 'id',
      },
      body: {
        name: 'new test program'
      }
    };
    var promise = programs.createProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not create new program: Given program_id is invalid (e.g. not an integer or negative)');
      assert.equal(err.name, 'InvalidArgumentError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.program_id);
      assert.equal(err.status, 400);
      done();
    });
  });
  xit('/sites/:site_id/programs (invalid body)', function(done) {
    var req = {
      params: {
        site_id: 'id',
      },
      body: {
      }
    };
    var promise = programs.createProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not create new program: Given body is invalid (e.g. does not have a name field)');
      assert.equal(err.name, 'InvalidArgumentError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.program_id);
      assert.equal(err.status, 400);
      done();
    });
  });
  xit('/sites/:site_id/programs (nonexistent site_id)', function(done) {
    var req = {
      params: {
        site_id: 9999
      },
      body: {
        name: 'new test program'
      }
    };
    var promise = programs.createProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not create new program: Given program_id does not exist in the database');
      assert.equal(err.name, 'ArgumentNotFoundError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.event_id);
      assert.equal(err.status, 404);
      done();
    });
  });
});

describe('PUT', function() {
  afterEach(function(done) {
    seed().then(function(done) {
      done();
    });
  });
  xit('/programs/:program_id', function(done) {
    var req = {
      params: {
        program_id: 1,
      },
      body: {
        name: 'updatedProgram'
      }
    };
    var promise = programs.updateProgram(req);
    promise.then(function(data) {
      assert.deepEqual([updatedProgram], data);
      programs.getProgram({params: {program_id: 1}}).then(function(data) {
        assert.equal(data.name, req.body.name);
      });
      done();
    });
  });
  xit('/programs/:program_id (invalid program_id)', function(done) {
    var req = {
      params: {
        program_id: -1,
      },
      body: {
        name: 'updatedProgram'
      }
    };
    var promise = programs.updateProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not update program: Given program_id is invalid (e.g. not an integer or negative)');
      assert.equal(err.name, 'InvalidArgumentError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.program_id);
      assert.equal(err.status, 400);
      done();
    });
  });
  xit('/programs/:program_id (invalid program_id)', function(done) {
    var req = {
      params: {
        program_id: 'id',
      },
      body: {
        name: 'updatedProgram'
      }
    };
    var promise = programs.updateProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not update program: Given program_id is invalid (e.g. not an integer or negative)');
      assert.equal(err.name, 'InvalidArgumentError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.program_id);
      assert.equal(err.status, 400);
      done();
    });
  });
  xit('/programs/:program_id (invalid body)', function(done) {
    var req = {
      params: {
        program_id: 1,
      },
      body: {
      }
    };
    var promise = programs.updateProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not update program: Given body is invalid (e.g. does not have a name field)');
      assert.equal(err.name, 'InvalidArgumentError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.program_id);
      assert.equal(err.status, 400);
      done();
    });
  });
  xit('/programs/:program_id (nonexistent program_id)', function(done) {
    var req = {
      params: {
        program_id: 9999,
      },
      body: {
        name: 'updatedProgram'
      }
    };
    var promise = programs.updateProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not update program: Given program_id does not exist in the database');
      assert.equal(err.name, 'ArgumentNotFoundError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.event_id);
      assert.equal(err.status, 404);
      done();
    });
  });
});

describe('DELETE', function() {
  afterEach(function(done) {
    seed().then(function(done) {
      done();
    });
  });
  xit('/programs/:program_id', function(done) {
    var req = {
      params: {
        program_id: 1,
      },
    };
    var promise = programs.deleteProgram(req);
    promise.then(function(data) {
      assert.deepEqual([program1], data);
      programs.getPrograms({}).then(function(data) {
        assert.deepEqual(programsDeleted, data);
      });
      done();
    });
  });
  xit('/programs/:program_id (invalid program_id)', function(done) {
    var req = {
      params: {
        program_id: -1,
      },
    };
    var promise = programs.deleteProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not delete program: Given program_id is invalid (e.g. not an integer or negative)');
      assert.equal(err.name, 'InvalidArgumentError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.program_id);
      assert.equal(err.status, 400);
      done();
    });
  });
  xit('/programs/:program_id (invalid progam_id)', function(done) {
    var req = {
      params: {
        program_id: 'id',
      },
    };
    var promise = programs.deleteProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not delete program: Given program_id is invalid (e.g. not an integer or negative)');
      assert.equal(err.name, 'InvalidArgumentError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.program_id);
      assert.equal(err.status, 400);
      done();
    });
  });
  xit('/programs/:program_id (nonexistent program_id)', function(done) {
    var req = {
      params: {
        program_id: 9999,
      },
    };
    var promise = programs.deleteProgram(req);
    promise.catch(function(err) {
      assert.equal(err.message, 'Could not delete program: Given program_id does not exist in the database');
      assert.equal(err.name, 'ArgumentNotFoundError');
      assert.equal(err.propertyName, 'program_id');
      assert.equal(err.propertyValue, req.params.event_id);
      assert.equal(err.status, 404);
      done();
    });
  });
});

'use strict';

const env = 'development';
const config = require('./config/config.js')[env];

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request')
var app = express();

// Routes
var students = require('./routes/students');
var sites = require('./routes/sites');
var programs = require('./routes/programs');

// parse application/json and look for raw text
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

// exchange access_token for user info
app.use(function(req, res, next) {
  if (!req.hasOwnProperty('authorization')) {
    res.status(400);
    res.send('authorization field not found in request');
  }

  var options = { method: 'GET',
 	 url: 'https://asbadmin.auth0.com/userinfo',
   headers: { authorization: 'Bearer ' + req.authorization }
  };

  request(options, function (err, response, body) {
    if(err) {
      //unsure if this is how we want to
      //throw new Error(error);
      res.status = response.status;
      res.send('Unable to retrieve user info from Auth0');
    } else {
        parsedBody = JSON.parse(body);
        req.user = parsedBody;
        if(body.has)
        next();
    }
  });
});

app.get('/', function(req, res) {
  res.status(405);
  res.send('Route not implemented');
});

function makeResponse(res, promise) {
  promise.then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.status(err.status).send(err);
  });
}

// Students
app.route('/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudents(req));
  });

app.route('/students/:student_id')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudent(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, students.deleteStudent(req));
  })
  .put(function(req, res, next) {
    makeResponse(res, students.updateStudent(req));
  });

app.route('/students/:student_id/programs/:program_id')
  .put(function(req, res, next) {
    makeResponse(res, students.updateStudent(req));
  });

app.route('/programs/:program_id/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudentsByProgram(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, students.createStudent(req));
  });

app.route('/sites/:site_id/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudentsBySite(req));
  });

app.route('/events/:event_id/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudentsByEvent(req));
  });

// Sites
app.route('/sites')
  .get(function(req, res, next) {
    makeResponse(res, sites.getSites(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, sites.createSites(req));
  });

app.route('/sites/:site_id')
  .get(function(req, res, next) {
    makeResponse(res, sites.getSite(req));
  })
  .put(function(req, res, next) {
    makeResponse(res, sites.updateSites(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, sites.deleteSite(req));
  });

// Programs
app.route('/programs')
  .get(function(req, res, next) {
    makeResponse(res, programs.getPrograms(req));
  });

app.route('/programs/:program_id')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgram(req));
  })
  .put(function(req, res, next) {
    makeResponse(res, programs.updateProgram(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, programs.deleteProgram(req));
  });

app.route('/sites/:site_id/programs')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgramsBySite(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, programs.createProgram(req));
  });

app.route('/students/:student_id/programs')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgramsByStudent(req));
  });

app.route('/account/:account_id/programs')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgramsByAccount(req));
  });

app.listen(config.server.port);
console.log('Listening on port ' + config.server.port);

module.exports = app;  // for testing

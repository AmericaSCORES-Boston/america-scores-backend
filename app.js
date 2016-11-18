'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Routes
var students = require('./routes/students');
var sites = require('./routes/sites');

// parse application/json and look for raw text
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.status(405);
  res.send('Route not implemented');
});

function makeResponse(res, promise) {
  return promise.then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.status(err.status).send(err);
  });
}

app.get('/api/test', function(req, res) {
  res.send('testing');
});


app.get('/test', function(req, res) {
  res.send('no api test');
});

// Students
app.route('/api/students')
  .get(function(req, res, next) {
    console.log('in students');
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

app.route('/programs/:program_id/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudents(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, students.createStudent(req));
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

app.route('/sites/:site_id/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudents(req));
  });

app.route('/events/:event_id/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudents(req));
  });

app.listen(config.server.port);
console.log('Listening on port ' + config.server.port);

module.exports = app;  // for testing

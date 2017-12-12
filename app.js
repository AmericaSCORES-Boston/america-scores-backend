'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
// const rsaValidation = require('auth0-api-jwt-rsa-validation');
const makeResponse = require('./lib/utils').makeResponse;
const jwksRsa = require('jwks-rsa');
const app = express();


// Routes
const students = require('./routes/students');
const sites = require('./routes/sites');
const programs = require('./routes/programs');
const events = require('./routes/events');
const seasons = require('./routes/seasons');
const stats = require('./routes/stats');
const accounts = require('./routes/accounts');
const reports = require('./routes/reports');

var jwtCheck = jwt({
    // secret: rsaValidation(),
    // algorithms: ['RS256'],
    // issuer: 'https://asbadmin.auth0.com/',
    // audience: 'https://asbadmin.auth0.com/api/v2/'
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 50,
        jwksUri: 'https://asbadmin.auth0.com/.well-known/jwks.json'
    }),

    // Validate the audience and the issuer.
    audience: 'https://asbadmin.auth0.com/api/v2/',
    issuer: 'https://asbadmin.auth0.com/',
    algorithms: ['RS256','HS256']
});


// parse application/json and look for raw text
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(jwtCheck);

// If we do not get the correct credentials, we’ll return an appropriate message
app.use(function(err, req, res, next) {
    console.log('jwtcheck')
/*    console.log(req.headers)
    console.log('error is')*/
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({message: 'UnAuthorized Access'});
    }
});

app.get('/', function(req, res) {
  res.status(405);
  res.send('Route not implemented');
});

app.get('/docs', function(req, res) {
  app.use(express.static('docs/apidoc'));
  res.sendFile(path.join(__dirname, 'docs/apidoc/index.html'));
});

// Students
app.route('/students')
  .get(function(req, res, next) {
    makeResponse(res, students.getStudents(req));
  });

app.route('/students/:student_id')
  .get( function(req, res, next) {
    makeResponse(res, students.getStudent(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, students.deleteStudent(req));
  })
  .put(function(req, res, next) {
    makeResponse(res, students.updateStudent(req));
  });

app.route('/students/:student_id/programs/:program_id')
  .put( function(req, res, next) {
    makeResponse(res, students.updateStudent(req));
  });

app.route('/programs/:program_id/students')
  .get( function(req, res, next) {
    makeResponse(res, students.getStudentsByProgram(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, students.createStudent(req));
  });

app.route('/sites/:site_id/students')
  .get( function(req, res, next) {
    makeResponse(res, students.getStudentsBySite(req));
  });

app.route('/events/:event_id/students')
  .get( function(req, res, next) {
    makeResponse(res, students.getStudentsByEvent(req));
  });

// Accounts
app.route('/accounts')
  .get( function(req, res, next) {
    makeResponse(res, accounts.getAccounts(req));
  }).post(function(req, res, next) {
    makeResponse(res, accounts.createAccount(req));
  });

app.route('/accounts/:account_id')
  .put(function(req, res, next) {
    makeResponse(res, accounts.updateAccount(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, accounts.deleteAccount(req));
  });

// Sites
app.route('/sites')
  .get(jwtCheck, function(req, res, next) {
    makeResponse(res, sites.getSites(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, sites.createSite(req));
  });

app.route('/accounts/:account_id/sites')
  .get( function(req, res, next) {
    makeResponse(res, sites.getSitesByAccount(req));
  });

app.route('/sites/:site_id')
  .get( function(req, res, next) {
    makeResponse(res, sites.getSite(req));
  })
  .put(function(req, res, next) {
    makeResponse(res, sites.updateSite(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, sites.deleteSite(req));
  });

// Programs
app.route('/programs')
  .get( function(req, res, next) {
    makeResponse(res, programs.getPrograms(req));
  });

app.route('/programs/:program_id')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgram(req));
  })
  .put( function(req, res, next) {
    makeResponse(res, programs.updateProgram(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, programs.deleteProgram(req));
  });

app.route('/sites/:site_id/programs')
  .get( function(req, res, next) {
    makeResponse(res, programs.getProgramsBySite(req));
  })
  .post(function(req, res, next) {
    makeResponse(res, programs.createProgram(req));
  });

app.route('/students/:student_id/programs')
  .get( function(req, res, next) {
    makeResponse(res, programs.getProgramsByStudent(req));
  });

app.route('/accounts/:account_id/programs')
  .get( function(req, res, next) {
    makeResponse(res, programs.getProgramsByAccount(req));
  });

// Events
app.route('/events')
  .get(function(req, res, next) {
    makeResponse(res, events.getEvents(req));
  });

app.route('/events/:event_id')
  .get( function(req, res, next) {
    makeResponse(res, events.getEvent(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, events.deleteEvent(req));
  });

app.route('/students/:student_id/events')
  .get( function(req, res, next) {
    makeResponse(res, events.getEventsByStudent(req));
  });

app.route('/programs/:program_id/events')
  .get( function(req, res, next) {
    makeResponse(res, events.getEventsByProgram(req));
  });

app.route('/programs/:program_id/events')
  .post(function(req, res, next) {
    makeResponse(res, events.createEvent(req));
  });

// Seasons
app.route('/seasons/')
  .get(function(req, res, next) {
    makeResponse(res, seasons.getSeasons(req));
  });

// Stats
app.route('/stats')
  .get(function(req, res, next) {
    makeResponse(res, stats.getStats(req));
  });

app.route('/sites/:site_id/stats')
  .get(function(req, res, next) {
    makeResponse(res, stats.getStatsBySite(req));
  });

app.route('/programs/:program_id/stats')
  .get(function(req, res, next) {
    makeResponse(res, stats.getStatsByProgram(req));
  });

app.route('/events/:event_id/stats')
  .get(function(req, res, next) {
    makeResponse(res, stats.getStatsByEvent(req));
  });

app.route('/students/:student_id/stats')
  .get(function(req, res, next) {
    makeResponse(res, stats.getStatsByStudent(req));
  });

app.route('/events/:event_id/stats/pacer')
  .put(function(req, res, next) {
    makeResponse(res, stats.uploadPacerStats(req));
  });

app.route('/events/:event_id/stats/bmi')
  .put(function(req, res, next) {
    makeResponse(res, stats.uploadBMIStats(req));
  });

// Reports
app.route('/reports')
  .get(function(req, res, next) {
    makeResponse(res, reports.getReport(req));
  });

var server = app.listen(config.server.port);
console.log('Listening on port ' + config.server.port);

module.exports = server;  // for testing

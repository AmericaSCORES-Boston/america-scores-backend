'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];

const express = require('express');
const bodyParser = require('body-parser');
const makeResponse = require('./lib/utils').makeResponse;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
// var cors = require('cors');
const app = express();
// app.use(cors());

// Routes
const students = require('./routes/students');
const sites = require('./routes/sites');
const programs = require('./routes/programs');
const events = require('./routes/events');
const stats = require('./routes/stats');
dotenv.load();

// parse application/json and look for raw text
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({extended: true}));

// middleware to exchange access_token for user info
function checkUser(req, res, next) {
  if (req.method === 'POST' && req.path === '/accounts') {
    return next();
  }

  var err;
  // verify authorization and connection suppiled in request
  if (!req.headers.hasOwnProperty('authorization')) {
    err = new Error('Access denied: No authorization provided');
    err.status = 403;
    return next(err);
  }

  var client_secret;
  var client_id;
  // set parameters for JWT check depending upon connection type supplied
  if (req.headers.connection === 'mobile') {
    client_secret = process.env.AUTH0_MOBILE_SECRET;
    // android and mobile do not share same client_id (stored in 'aud').
    // update accordingly.
    var unverified = jwt.decode(req.headers.authorization);
    client_id = unverified.aud === process.env.AUTH0_IOS_CLIENT_ID ? process.env.AUTH0_IOS_CLIENT_ID : process.env.AUTH0_ANDROID_CLIENT_ID;
  } else if (req.headers.connection === 'web_app') {
    client_secret = process.env.AUTH0_WEBAPP_SECRET;
    client_id = process.env.AUTH0_WEBAPP_CLIENT_ID;
  } else {
    err = new Error('Bad connection type supplied');
    err.status = 400;
    return next(err);
  }

  // convert secret into a base64 encoded buffer
  client_secret = new Buffer(client_secret, 'base64');

  // set options for verify function to check within jwt
  var options = {
    algorithms: 'HS256',
    audience: client_id,
    issuer: 'https://' + process.env.AUTH0_DOMAIN + '/',
    ignoreExpiration: false
  };

  try {
    // verify token with provided parameters
    var decoded = jwt.verify(req.headers.authorization, client_secret, options);
    if (decoded.email_verified !== true) {
      console.log('hi');
      err = new Error('Access denied: Must verify email.');
      err.status = 401;
      return next(err);
    }

    req.user = {
      authorization: decoded.app_metadata.type,
      f_name: decoded.first_name,
      l_name: decoded.last_name,
      email: decoded.email,
      auth0_id: decoded.user_id
    };
    next();
  } catch(err) {
    err.status = 401;
    return next(err);
  }
};

// add authentication middleware to all routes other than POST /accounts
app.all('*', checkUser);

// app.options('*', cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', function(req, res) {
  res.status(405);
  res.send('Route not implemented');
});

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
    makeResponse(res, sites.createSite(req));
  });

app.route('/accounts/:account_id/sites')
  .get(function(req, res, next) {
    makeResponse(res, sites.getSitesByAccount(req));
  });

app.route('/sites/:site_id')
  .get(function(req, res, next) {
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

app.route('/accounts/:account_id/programs')
  .get(function(req, res, next) {
    makeResponse(res, programs.getProgramsByAccount(req));
  });

// Events
app.route('/events')
  .get(function(req, res, next) {
    makeResponse(res, events.getEvents(req));
  });

app.route('/events/:event_id')
  .get(function(req, res, next) {
    makeResponse(res, events.getEvent(req));
  })
  .delete(function(req, res, next) {
    makeResponse(res, events.deleteEvent(req));
  });

app.route('/students/:student_id/events')
  .get(function(req, res, next) {
    makeResponse(res, events.getEventsByStudent(req));
  });

app.route('/programs/:program_id/events')
  .get(function(req, res, next) {
    makeResponse(res, events.getEventsByProgram(req));
  });

app.route('/programs/:program_id/events')
  .post(function(req, res, next) {
    makeResponse(res, events.createEvent(req));
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

var server = app.listen(config.server.port);
console.log('Listening on port ' + config.server.port);

module.exports = server;  // for testing

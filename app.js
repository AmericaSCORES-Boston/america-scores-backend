var express = require('express');
var net = require('net');
var config = require('./config/config'); //we load the db location from the JSON files
var morgan = require('morgan');
var app = express();
var mysql = require('mysql')
var port = 7777;

//Routes
var students = require('./routes/students');
var stats = require('./routes/stats');
var programs = require('./routes/programs');
var sites = require('./routes/sites');
var events = require('./routes/events');
var accounts = require('./routes/accounts');

// //don't show the log when it is test
// if(config.util.getEnv('NODE_ENV') !== 'test') {
//     //use morgan to log at command line
//     app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
// }

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

app.get("/", function(req, res) {
	res.json({message : "Uh."});
});

function makeResponse(res, promise) {
	promise.then(function(data) {
		res.send(data);
	})
	.catch(function(err) {
		res.status(err.status).send(err);
	});
}

//Students
app.route("/students")
    .get(function(req, res, next) {
    	makeResponse(res, students.getStudents(req));
    });
    	
app.route("/students/:student_id")
    .get(function(req, res, next) {
    	makeResponse(res, students.getStudent(req));
    })
    .delete(function(req, res, next) {
    	makeResponse(res, students.deleteStudent(req));
    })
    .put(function(req, res, next) {
    	makeResponse(res, students.updateStudent(req));
    });

app.route("/students/:student_id/stats")
	.get(function(req, res, next) {
    	makeResponse(res, stats.getStats(req));
    })
app.route("/students/:student_id/events")
	.get(function(req, res, next) {
    	makeResponse(res, events.getEvents(req));
    })
app.route("/students/:student_id/programs")
	.get(function(req, res, next) {
    	makeResponse(res, programs.getPrograms(req));
    })

//Programs
app.route("/programs")
	.get(function(req, res, next) {
    	makeResponse(res, programs.getPrograms(req));
    });

app.route("/programs/:program_id")
    .get(function(req, res, next) {
    	makeResponse(res, programs.getProgram(req));
    })
    .delete(function(req, res, next) {
    	makeResponse(res, programs.deleteProgram(req));
    })
    .put(function(req, res, next) {
    	makeResponse(res, programs.updateProgram(req));
    });

app.route("/programs/:program_id/students")
	.get(function(req, res, next) {
    	makeResponse(res, students.getStudents(req));
    })
	.post(function(req, res, next) {
    	makeResponse(res, students.createStudent(req));
    })

app.route("/programs/:program_id/events")
	.get(function(req, res, next) {
    	makeResponse(res, events.getEvents(req));
    })
	.post(function(req, res, next) {
    	makeResponse(res, events.createEvent(req));
    })

app.route("/programs/:program_id/accounts")
	.get(function(req, res, next) {
    	makeResponse(res, accounts.getAccounts(req));
    })

app.route("/programs/:program_id/stats")
	.get(function(req, res, next) {
    	makeResponse(res, stats.getStats(req));
    })

app.route("/programs/:program_id/report")
	.get(function(req, res, next) {
    	makeResponse(res, report.getReports(req));
    })

//Stats
app.route("/stats")
    .get(function(req, res, next) {
    	makeResponse(res, stats.getStats(req));
    });

app.route("/stats/:stat_id")
    .get(function(req, res, next) {
    	makeResponse(res, stats.getStat(req));
    });
    .put(function(req, res, next) {
    	makeResponse(res, stats.updateStat(req));
    });
    .delete(function(req, res, next) {
    	makeResponse(res, stats.deleteStat(req));
    });

//Sites
app.route("/sites")
    .get(function(req, res, next) {
    	makeResponse(res, sites.getSites(req));
    });
    .post(function(req, res, next) {
    	makeResponse(res, sites.createSites(req));
    });

app.route("/sites/:site_id")
    .get(function(req, res, next) {
    	makeResponse(res, sites.getSite(req));
    });
    .put(function(req, res, next) {
    	makeResponse(res, sites.updateSites(req));
    });
    .delete(function(req, res, next) {
    	makeResponse(res, sites.deleteSite(req));
    });
    
app.route("/sites/:site_id/programs")
	.get(function(req, res, next) {
    	makeResponse(res, programs.getPrograms(req));
    });
	.post(function(req, res, next) {
    	makeResponse(res, programs.createProgram(req));
    });

app.route("/sites/:site_id/students")
	.get(function(req, res, next) {
    	makeResponse(res, students.getStudents(req));
    });

app.route("/sites/:site_id/events")
	.get(function(req, res, next) {
    	makeResponse(res, event.getEvents(req));
    });

app.route("/sites/:site_id/stats")
	.get(function(req, res, next) {
    	makeResponse(res, stats.getStats(req));
    });

app.route("/sites/:site_id/accounts")
	.get(function(req, res, next) {
    	makeResponse(res, accounts.getAccounts(req));
    });

//Events
app.route("/events")
	.get(function(req, res, next) {
    	makeResponse(res, events.getEvents(req));
    });

app.route("/events/:event_id")
	.get(function(req, res, next) {
    	makeResponse(res, events.getEvent(req));
    });
    .put(function(req, res, next) {
    	makeResponse(res, events.updateEvent(req));
    });
    .delete(function(req, res, next) {
    	makeResponse(res, events.deleteEvent(req));
    });

app.route("/events/:event_id/students")
	.get(function(req, res, next) {
    	makeResponse(res, students.getStudents(req));
    });

app.route("/events/:event_id/stats")
	.get(function(req, res, next) {
    	makeResponse(res, stats.getStats(req));
    });

app.route("/events/:event_id/students/:student_id/stats")
	.post(function(req, res, next) {
    	makeResponse(res, stats.createStat(req));
    });

//Accounts
app.route("/accounts")
	.get(function(req, res, next) {
    	makeResponse(res, accounts.getAccounts(req));
    });
    .post(function(req, res, next) {
    	makeResponse(res, accounts.createAccount(req));
    });

app.route("/accounts/:account_id")
	.put(function(req, res, next) {
    	makeResponse(res, accounts.updateAccount(req));
    });
    .delete(function(req, res, next) {
    	makeResponse(res, accounts.deleteAccount(req));
    });

app.route("/accounts/:accunt_id/programs")
	.get(function(req, res, next) {
    	makeResponse(res, programs.getPrograms(req));
    });

//Report
app.route("/report")
	.get(function(req, res, next) {
    	makeResponse(res, report.getReports(req));
    });

app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing

// var server = net.createServer(function(socket) {
//     socket.end('Hello!\n');
// });

// server.listen(7777);

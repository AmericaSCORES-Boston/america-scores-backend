const utils = require('../lib/utils');
const query = utils.query;
const defined = utils.defined;
const isValidDate = utils.isValidDate;

function getEvents(req) {
  return query('SELECT * FROM Event');
}

function getEvent(req) {
  var id = req.params.event_id;
  return query('SELECT * FROM Event WHERE event_id = ?', [id]);
}

function getEventsByStudent(req) {
  var id = req.params.student_id;
  return query('SELECT * FROM Event WHERE event_id IN (Select event_id FROM Measurement WHERE student_id = ?)', [id]);
}

function getEventsByProgram(req) {
  var id = req.params.program_id;
  return query('SELECT * FROM Event WHERE program_id = ?', [id]);
}

function createEvent(req) {
  var account_id = req.params.account_id;
  var program_id = req.params.program_id;
  var event_date = req.body.event_date;
  if(!defined(event_date)) {
    return Promise.reject({status: 400, message: 'Missing event_date'});
  }
  if(!isValidDate(event_date)) {
    return Promise.reject({status: 400, message: 'Malformed date YYYY-MM-DD'});
  }
  return query('SELECT * FROM AcctToProgram WHERE program_id = ? AND acct_id = ?', [program_id, account_id])
  .then(function(data) {
    if (data.length == 1 && data[0].acct_id == account_id && data[0].program_id) {
      return query('INSERT INTO Event (program_id, acct_id, event_date) VALUES (?, ?, DATE(?))', [program_id, account_id, event_date])
      .then(function(data) {
        return query('SELECT * FROM Event WHERE event_id = ?', [data.insertId]);
      });
    }
    return Promise.resolve([]);
  });
}

function deleteEvent(req) {
  var event_id = req.params.event_id;
  return query('SELECT * FROM Event WHERE event_id = ?', [event_id])
  .then(function(data) {
    if (data.length == 1 && data[0].event_id == event_id) {
      return query('DELETE FROM Measurement WHERE event_id = ?', [event_id])
      .then(function() {
        return query('DELETE FROM Event WHERE event_id = ?', [event_id]);
      })
      .then(function() {
        return data;
      });
    }
    return Promise.resolve([]);
  });
};

module.exports = {
  getEvents,
  getEvent,
  getEventsByStudent,
  getEventsByProgram,
  createEvent,
  deleteEvent
};

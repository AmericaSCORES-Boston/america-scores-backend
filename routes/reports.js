'use strict';
const stats = require('./stats');
const events = require('./events');
const programs = require('./programs');
const students = require('./students');
const Promise = require('bluebird');

// Get all stats
function getReports(req) {
  var getStats = stats.getStats();

  return getStats.then(function(data) {
    return csvAlg(data);
  });
}

function getReportByProgram(req) {
  var getStats = stats.getStatsByProgram(req);

  return getStats.then(function(data) {
    if (data.length > 0) {
      return csvAlg(data);
    } else {
      return [];
    }
  });
}

function csvAlg(all_data) {
  var csv = 'Player: Player Name, Data Entry Group: Data Entry Group Name, Player Data ID, PRE-Measurement Date, ' +
        'PRE-Height (in), PRE-Weight (lbs), PRE-PACER Score, POST-Measurement Date, POST-Height (in), ' +
        'POST-Weight (lbs), POST-PACER Score\n';

  var studentList = {};
  var event;
  var csvList = [];
  var linePerStudent = {};
  var eventPerStudent = {};
  return Promise.map(all_data, (eachStat) => {
    // if student's stats has not been already checked yet
    if (!(eachStat.student_id in studentList)) {
      studentList[eachStat.student_id] = eachStat.student_id;
      linePerStudent[eachStat.student_id] = {};
      eventPerStudent[eachStat.student_id] = {};
      return students.getStudent({
        params: {
          student_id: eachStat.student_id
        }
      })
      .then(function(data) {
        for (var s in data) {
          if (data[s] != null) {
            if (data[s].student_id = eachStat.student_id)
              linePerStudent[eachStat.student_id]['full_name'] = data[0].first_name + ' ' + data[0].last_name;
          }
        }
        return Promise.resolve([]);
      })
      .then(function(data) {
        var listOfStats = [];
        for (var ss in all_data) {
          if (all_data[ss].student_id == eachStat.student_id) {
            listOfStats.push(all_data[ss]);
          }
        }
        return listOfStats;
      })
      .then(function(data) {
        if (data.length > 1) {
          // loop for each stat of one student
          return Promise.map(data, (val) => {
            var i = 0;
            var allEvents = {};
            event = val.event_id;
            return events.getEvent({
              params: {
                event_id: event
              }
            })
            .then(function(data) {
              i+= 1;
              return allEvents[i] = data[0];
            });
          })
          .then(function(data) {
            for (var j in data) {
              if (data[j] != null) {
                eventPerStudent[eachStat.student_id]['getDate'] = new Date(data[j].event_date);
                // if there is no earliest date yet, set it
                if (eventPerStudent[eachStat.student_id]['preEvent'] == null) {
                  eventPerStudent[eachStat.student_id]['preEvent'] = data[j];
                  eventPerStudent[eachStat.student_id]['preDate'] = eventPerStudent[eachStat.student_id].getDate;
                } else { // compare to see if new date is earlier
                  eventPerStudent[eachStat.student_id]['getDate'] = new Date(eventPerStudent[eachStat.student_id].preEvent.event_date); // set the current date to be the pre-date
                  eventPerStudent[eachStat.student_id]['getDate2'] = new Date(data[j].event_date); // set date2 to be the new event
                  // if new date is earlier
                  if (eventPerStudent[eachStat.student_id].getDate2 < eventPerStudent[eachStat.student_id].getDate) {
                    // check if there is a post event yet
                    if (eventPerStudent[eachStat.student_id].postEvent == null) {
                      // if not, set the previous predate as the new postdate
                      eventPerStudent[eachStat.student_id]['postEvent'] = eventPerStudent[eachStat.student_id].preEvent;
                      eventPerStudent[eachStat.student_id]['postDate'] = eventPerStudent[eachStat.student_id].preDate;
                    }
                    eventPerStudent[eachStat.student_id]['preEvent'] = data[j];
                    eventPerStudent[eachStat.student_id]['preDate'] = eventPerStudent[eachStat.student_id].getDate2;
                  } else { // now compare the new date with the current postdate
                    // if post event is empty, just throw it in
                    if (eventPerStudent[eachStat.student_id].postEvent == null) {
                      eventPerStudent[eachStat.student_id]['postEvent'] = data[j];
                      eventPerStudent[eachStat.student_id]['postDate'] = eventPerStudent[eachStat.student_id].getDate2;
                    } else { // otherwise, compare the 2
                      eventPerStudent[eachStat.student_id]['getDate'] = new Date(eventPerStudent[eachStat.student_id].postEvent.event_date);
                      if (eventPerStudent[eachStat.student_id].getDate < eventPerStudent[eachStat.student_id].getDate2) { // if the new date is later, throw it in
                        eventPerStudent[eachStat.student_id]['postEvent'] = data[j];
                        eventPerStudent[eachStat.student_id]['postDate'] = eventPerStudent[eachStat.student_id].getDate2;
                      }
                    }
                  }
                }
              }
            }
            linePerStudent[eachStat.student_id]['pre_date'] = dateFormatter(eventPerStudent[eachStat.student_id].preDate.getMonth() + 1) + '/' + dateFormatter(eventPerStudent[eachStat.student_id].preDate.getDate()) + '/' + eventPerStudent[eachStat.student_id].preDate.getFullYear();
            linePerStudent[eachStat.student_id]['post_date'] = dateFormatter(eventPerStudent[eachStat.student_id].postDate.getMonth() + 1) + '/' + dateFormatter(eventPerStudent[eachStat.student_id].postDate.getDate()) + '/' + eventPerStudent[eachStat.student_id].postDate.getFullYear();
            return Promise.resolve([]);
          })
          .then(function(data) {
            return stats.getStatsByEvent({
              params: {
                event_id: eventPerStudent[eachStat.student_id].preEvent.event_id
              }
            });
          })
          .then(function(data) {
            for (var each in data) {
              if (data[each].student_id == eachStat.student_id) {
                linePerStudent[eachStat.student_id]['pre_height'] = data[each].height;
                linePerStudent[eachStat.student_id]['pre_weight'] = data[each].weight;
                linePerStudent[eachStat.student_id]['pre_pacer'] = data[each].pacer;
              }
            }
            return Promise.resolve([]);
          })
          .then(function(data) {
            return stats.getStatsByEvent({
              params: {
                event_id: eventPerStudent[eachStat.student_id].postEvent.event_id
              }
            });
          })
          .then(function(data) {
            for (var each in data) {
              if (data[each].student_id == eachStat.student_id) {
                linePerStudent[eachStat.student_id]['post_height'] = data[each].height;
                linePerStudent[eachStat.student_id]['post_weight'] = data[each].weight;
                linePerStudent[eachStat.student_id]['post_pacer'] = data[each].pacer;
              }
            }
            return Promise.resolve([]);
          })
          .then(function(data) {
            return programs.getProgramsByStudent({
              params: {
                student_id: eachStat.student_id
              }
            });
          })
          .then(function(data) {
            linePerStudent[eachStat.student_id]['program_name'] = data[0].program_name;
            var newRow = linePerStudent[eachStat.student_id].full_name + ', ' + linePerStudent[eachStat.student_id].program_name + ', , ' + linePerStudent[eachStat.student_id].pre_date + ', ' +
              linePerStudent[eachStat.student_id].pre_height + ', ' + linePerStudent[eachStat.student_id].pre_weight + ', ' + linePerStudent[eachStat.student_id].pre_pacer + ', ' +
              linePerStudent[eachStat.student_id].post_date + ', ' + linePerStudent[eachStat.student_id].post_height + ', ' + linePerStudent[eachStat.student_id].post_weight + ', ' +
              linePerStudent[eachStat.student_id].post_pacer + '\n';
            csvList.push(newRow);
            return Promise.resolve([]);
          });
        } else {
          return Promise.resolve([]);
        }
      });
    } else {
      return Promise.resolve([]);
    }
  })
  .then(function(data) {
    csvList.sort();
    for (var k = 0; k < csvList.length; k++) {
      csv += csvList[k];
    }
    return {
      report: csv
    };
  });
}

function dateFormatter(integer) {
  if (integer < 10) {
    return '0' + integer;
  } else {
    return integer;
  }
}
module.exports = {
  getReports,
  getReportByProgram,
};

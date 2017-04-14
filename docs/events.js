/**
 * @api {get} /events Get all events
 * @apiName GetEvents
 * @apiGroup Events
 *
 * @apiSuccess {Object[]} events The events
 * @apiUse Event
 * 
 * @apiSuccessExample {Object[]} Success-Response
 * [
 *  {
 *    "event_id": 1,
 *    "program_id": 1,
 *    "season_id": 1,
 *    "event_date": "2017-01-16T00:00:00.000Z",
 *    "pre_season": 1
 *  },
 *  {
 *    "event_id": 2,
 *    "program_id": 1,
 *    "season_id": 1,
 *    "event_date": "2017-04-13T00:00:00.000Z",
 *    "pre_season": 0
 *  },
 *  {
 *    "event_id": 3,
 *    "program_id": 2,
 *    "season_id": 1,
 *    "event_date": "2017-02-01T00:00:00.000Z",
 *    "pre_season": 1
 *  }
 * ]
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /events/:event_id Get an event by id
 * @apiName GetEvent
 * @apiGroup Events
 *
 *
 * @apiSuccess {Object} event The event identified by the given id
 * @apiUse Event
 *
 * @apiSuccessExample {Object} Success-Response
 * {
 *   "event_id": 3,
 *   "program_id": 2,
 *   "season_id": 1,
 *   "event_date": "2017-02-01T00:00:00.000Z",
 *   "pre_season": 1
 * }
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {delete} /events/:event_id Delete an event by id
 * @apiName DeleteEvent
 * @apiGroup Events
 * @apiDescription Deletes an event and all its associated stats from the database.
 *
 * TODO: Currently does NOT return any indication of success and does not error if given an invalid id.
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /students/:student_id/events Get events for a student
 * @apiName GetEventByStudent
 * @apiGroup Events
 *
 * @apiSuccess {Object[]} events The events for a student
 * @apiUse Event
 * 
 * @apiSuccessExample {Object[]} Success-Response
 * [
 *  {
 *    "event_id": 5,
 *    "program_id": 3,
 *    "season_id": 1,
 *    "event_date": "2017-02-27T00:00:00.000Z",
 *    "pre_season": 1
 *  }
 * ]
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /programs/:program_id/events Get events for a program
 * @apiName GetEventsByProgram
 * @apiGroup Events
 *
 * @apiSuccess {Object[]} events The events for a program
 * @apiUse Event
 *
 * @apiSuccessExample {Object[]} Success-Response
 * 
 * [
 *  {
 *    "event_id": 1,
 *    "program_id": 1,
 *    "season_id": 1,
 *    "event_date": "2017-01-16T00:00:00.000Z",
 *    "pre_season": 1
 *  },
 *  {
 *    "event_id": 2,
 *    "program_id": 1,
 *    "season_id": 1,
 *    "event_date": "2017-04-13T00:00:00.000Z",
 *    "pre_season": 0
 *  }
 * ]
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {post} /programs/:program_id/events Add an event
 * @apiName CreateEvent
 * @apiGroup Events
 * 
 * @apiParam {String} event_date Event date in the form 'YYYY-MM-DD'
 * @apiParam {Boolean} pre_season Flag indicating if the event is pre-season (true) or post-season (false)
 * @apiExample {js} Example request
 * {
 *  event_date: '2017-01-01',
 *  pre_season: false
 * }
 *
 * @apiUse MalformedDateError
 * @apiUse MissingFieldError
 *
 * @apiSuccess {Object[]} The created event
 * @apiUse Event
 *
 * @apiSuccessExample {Object[]} Success-Response
 * [
 *  {
 *    "event_id": 7,
 *    "program_id": 1,
 *    "season_id": 2,
 *    "event_date": "2017-01-01T00:00:00.000Z",
 *    "pre_season": 0
 *  }
 * ]
 * 
 * @apiVersion 1.0.0
 */

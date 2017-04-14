/**
 * @apiDefine Error400 Error 400
 */

/**
 * @apiDefine Error404 Error 404
 */

/**
 * @apiDefine Error500 Error 500
 */

/**
 * @apiDefine Error501 Error 501
 */

/**
 * @apiDefine InvalidArgumentError
 * @apiError (Error400) InvalidArgumentError Given a non-positive integer field
 */

/**
 * @apiDefine MissingFieldError
 * @apiError (Error400) MissingField Request was missing event_date or pre_season flag
 */

/**
 * @apiDefine MalformedDateError
 * @apiError (Error400) MalformedDateError Date was not of the form 'YYYY-MM-DD'
 */

/**
 * @apiDefine InternalServerError
 * @apiError (Error500) The server encountered an unexpected error
 */

/**
 * @apiDefine Student1
 * @apiSuccess {Integer} student.student_id The unique student id
 * @apiSuccess {String} student.first_name The student's first name
 * @apiSuccess {String} student.last_name The student's last name
 * @apiSuccess {Date} student.dob The student's date of birth
 */

/**
 * @apiDefine Student
 * @apiSuccess {Object[]} students The students
 * @apiSuccess {Integer} student.student_id The unique student id
 * @apiSuccess {String} student.first_name The student's first name
 * @apiSuccess {String} student.last_name The student's last name
 * @apiSuccess {Date} student.dob The student's date of birth
 */

/**
 * @apiDefine StudentsResult
 * @apiSuccessExample {Object[]} Success-Response
 * [
 *  {
 *    "student_id": 1,
 *    "first_name": "Alice",
 *    "last_name": "Cooper",
 *    "dob": "1999-05-18T00:00:00.000Z"
 *  },
 *  {
 *    "student_id": 2,
 *    "first_name": "Danny",
 *    "last_name": "Hannigan",
 *    "dob": "1998-12-13T00:00:00.000Z"
 *  }
 * ]
 */

/**
 * @apiDefine Account
 * @apiSuccess {Integer} acct_id The unique account id
 * @apiSuccess {String} auth0_id The unique auth0 id
 * @apiSuccess {String} first_name The account owner's first name
 * @apiSuccess {String} last_name The account owner's last name
 * @apiSuccess {String} email The account owner's email address
 * @apiSuccess {String} acct_type 'Admin', 'Staff', 'Coach', or 'Volunteer'
 */

/**
 * @apiDefine AccountResult
 * @apiSuccessExample {Object[]} Success-Response
 * [
 *  {
 *   "acct_id": 1,
 *   "auth0_id": "auth0|abc123def456',
 *   "first_name": "Harry",
 *   "last_name": "Belvidere",
 *   "email": "h.belvidere@email.com",
 *   "acct_type": "Coach"
 *  }
 * ]
 */

/**
 * @apiDefine Event
 * @apiSuccess {Integer} event.event_id The unique event id
 * @apiSuccess {Integer} event.program_id The program that this event belongs to
 * @apiSuccess {Integer} event.season_id The season that this event belongs to
 * @apiSuccess {Date} event.event_date The date of the event
 * @apiSuccess {Boolean} event.pre_season Whether this event was held pre-season (true) or post-season (false)
 */

/**
 * @apiDefine Season
 * @apiSuccess {Integer} season.season_id The unique season id
 * @apiSuccess {String} season.season 'Fall' or 'Spring'
 * @apiSuccess {Integer} season.year The season year
 */

/**
 * @apiDefine Stat
 * @apiSuccess {Object[]} stats The stats
 * @apiSuccess {Integer} measurement_id The stat id
 * @apiSuccess {Integer} student_id The student for this stat
 * @apiSuccess {Integer} event_id The event where this stat was recorded
 * @apiSuccess {Integer} height The height (inches)
 * @apiSuccess {Integer} weight The weight (pounds)
 * @apiSuccess {Integer} pacer The PACER test result (level)
 */

/**
 * @apiDefine StatsResult
 * @apiSuccessExample {Object[]} Success-Response
 * [
 *  {
 *    "measurement_id": 1,
 *    "student_id": 1,
 *    "event_id": 5,
 *    "height": 65,
 *    "weight": 140,
 *    "pacer": 9
 *  },
 *  {
 *    "measurement_id": 2,
 *    "student_id": 2,
 *    "event_id": 5,
 *    "height": 61,
 *    "weight": 123,
 *    "pacer": 10
 *  }
 * ]
 */

/**
 * @api {get} /reports Get all stats for a specific season
 * @apiName GetReport
 * @apiGroup Reports
 *
 * @apiParam {String} season 'Fall' or 'Spring'
 * @apiParam {Integer} year The year of the season
 *
 * @apiExample {js} Example request
 * {
 *  season: 'Fall',
 *  year: 2016
 * }
 *
 * @apiSuccess {Object[]} statsList The season stats
 * @apiSuccess {Integer} stat.student_id The student the stat belongs to
 * @apiSuccess {String} stat.first_name The first name of the student
 * @apiSuccess {String} stat.last_name The last name of the student
 * @apiSuccess {String} stat.program_name The program that the student belongs to
 * @apiSuccess {String} stat.site_name The site of the program
 * @apiSuccess {Date} stat.pre_date The date of the pre-season data collection
 * @apiSuccess {Integer} stat.pre_height The student's pre-season height (inches)
 * @apiSuccess {Integer} stat.pre_weight The student's pre-season weight (pounds)
 * @apiSuccess {Integer} stat.pacer The student's pre-season PACER level
 * @apiSuccess {Date} stat.post_date The date of the post-season data collection
 * @apiSuccess {Integer} stat.post_height The student's post-season height (inches)
 * @apiSuccess {Integer} stat.post_weight The student's post-season weight (pounds)
 * @apiSuccess {Integer} stat.pacer The student's post-season PACER level
 *
 * @apiSuccessExample {Object[]} Success-Response
 * [
 *  {
 *    "student_id": 13,
 *    "first_name": "Amaya",
 *    "last_name": "Heywood",
 *    "site_name": "Baker Elementary School",
 *    "program_name": "Baker Girls ES",
 *    "pre_date": "2017-01-16T00:00:00.000Z",
 *    "pre_height": 49,
 *    "pre_weight": 91,
 *    "pre_pacer": 5,
 *    "post_date": "2017-04-13T00:00:00.000Z",
 *    "post_height": 49,
 *    "post_weight": 90,
 *    "post_pacer": 5
 *  },
 *  {
 *    "student_id": 14,
 *    "first_name": "Ray",
 *    "last_name": "Jackson",
 *    "site_name": "Baker Elementary School",
 *    "program_name": "Baker Boys ES",
 *    "pre_date": "2017-02-01T00:00:00.000Z",
 *    "pre_height": 44,
 *    "pre_weight": 91,
 *    "pre_pacer": 6,
 *    "post_date": "2017-06-17T00:00:00.000Z",
 *    "post_height": 44,
 *    "post_weight": 89,
 *    "post_pacer": 7
 *  },
 * ]
 *
 * @apiUse MissingFieldError
 * @apiError (Error404) SeasonNotFound The requested season does not exist
 *
 * @apiVersion 1.0.0
 */

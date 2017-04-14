/**
 * @api {get} /stats Get all stats
 * @apiName GetStats
 * @apiGroup Stats
 *
 * @apiUse Stat
 * @apiUse StatsResult
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /sites/:site_id/stats Get the stats by site
 * @apiName GetStatsBySite
 * @apiGroup Stats
 *
 * @apiUse Stat
 * @apiUse StatsResult
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /programs/:program_id/stats Get the stats by program
 * @apiName GetStatsByProgram
 * @apiGroup Stats
 *
 * @apiUse Stat
 * @apiUse StatsResult
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /events/:event_id/stats Get the stats by event
 * @apiName GetStatsByEvent
 * @apiGroup Stats
 *
 * @apiUse Stat
 * @apiUse StatsResult
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /students/:student_id/stats Get the stats by student
 * @apiName GetStatsByStudent
 * @apiGroup Stats
 *
 * @apiUse Stat
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
 *    "measurement_id": 7,
 *    "student_id": 1,
 *    "event_id": 9,
 *    "height": 66,
 *    "weight": 138,
 *    "pacer": 10
 *  }
 * ]
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {put} /events/:event_id/stats/pacer Update PACER results
 * @apiName UploadPacerStats
 * @apiGroup Stats
 *
 * @apiDescription Given set of student ids and PACER results, updates the existing stats for the given student/event or creates them if they don't already exist. For created events, height and weight will remain null.
 *
 * @apiParam {Object[]} statsList The PACER results
 * @apiParam {Integer} stats.student_id The student the stat belongs to
 * @apiParam {Integer} stats.pacer The PACER result (level)
 *
 * @apiUse InvalidArgumentError
 * @apiUse MissingFieldError
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {put} /events/:event_id/stats/bmi Update BMI results
 * @apiName UploadBMIStats
 * @apiGroup Stats
 *
 * @apiDescription Given set of student ids, heights, and weights, updates the existing stats for the given student/event or creates them if they don't already exist. For created events, PACER will remain null.
 *
 * @apiParam {Object[]} statsList The BMI results
 * @apiParam {Integer} stats.student_id The student the stat belongs to
 * @apiParam {Integer} stats.height The student's height (inches)
 * @apiParam {Integer} stats.weight The student's weight (inches)
 *
 * @apiUse InvalidArgumentError
 * @apiUse MissingFieldError
 *
 * @apiVersion 1.0.0
 */

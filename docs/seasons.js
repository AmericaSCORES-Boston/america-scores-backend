/**
 * @api {get} /seasons Get all seasons
 * @apiName GetSeasons
 * @apiGroup Seasons
 *
 * @apiSuccess {Object[]} seasons The seasons
 * @apiUse Season
 *
 * @apiSuccessExample {Object[]} Success-Response
 * [
 *  {
 *    "season_id": 1,
 *    "season": "Spring",
 *    "year": 2017
 *  },
 *  {
 *    "season_id": 2,
 *    "season": "Fall",
 *    "year": 2016
 *  }
 * ]
 *
 * @apiVersion 1.0.0
 */

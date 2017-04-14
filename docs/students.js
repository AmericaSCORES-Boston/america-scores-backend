/**
 * @api {get} /students Get all students
 * @apiName GetStudents
 * @apiGroup Students
 *
 * @apiUse Student
 * @apiUse StudentsResult
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /students Get student by name/dob
 * @apiName GetStudent
 * @apiGroup Students
 *
 * @apiParam {String} first_name Student's first name
 * @apiParam {String} last_name Student's last name
 * @apiParam {String} dob Date of birth 'YYYY-MM-DD'
 *
 * @apiExample {js} Example request
 * {
 *  first_name: 'Sally',
 *  last_name: 'Douglas',
 *  dob: '2000-01-01'
 * }
 *
 * @apiUse Student
 * @apiSuccessResponse {Object[]} Success-Response
 * [
 *  {
 *   "student_id": "1",
 *   "first_name": "Sally",
 *   "last_name": "Douglas",
 *   "dob": "1999-05-18T00:00:00.000Z"
 *  }
 * ]
 *
 * @apiError (Error400) InvalidArgumentError Birth date not of the form 'YYYY-MM-DD
 * @apiError (Error501) UnsupportedRequestError Invalid combination of params
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /students/:student_id Get a student by id
 * @apiName GetStudent
 * @apiGroup Students
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {delete} /students/:student_id Delete a student
 * @apiName DeleteStudent
 * @apiGroup Students
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {put} /students/:student_id Update a student
 * @apiName UpdateStudent
 * @apiGroup Students
 * 
 * @apiVersion 1.0.0
 */

/**
 * @api {put} /students/:student_id/programs/:program_id Update a student's program
 * @apiName UpdateStudentProgram
 * @apiGroup Students
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /programs/:program_id/students Get all students for a program
 * @apiName GetStudentsByProgram
 * @apiGroup Students
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {post} /programs/:program_id/students Create a student
 * @apiName CreateStudent
 * @apiGroup Students
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /events/:event_id/students
 * @apiName GetStudentsByEvent
 * @apiGroup Students
 *
 * @apiVersion 1.0.0
 */

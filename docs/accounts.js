/**
 * @api {get} /accounts Get all accounts
 * @apiName GetAccounts
 * @apiGroup Accounts
 *
 * @apiSuccess {Object[]} accts The accounts
 * @apiUse Account
 *
 * @apiUse AccountResult
 * 
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /accounts Get account by Auth0 id
 * @apiName GetAccountByAuth0Id
 * @apiGroup Accounts
 * 
 * @apiSuccess {Object[]} accts The accounts
 * @apiUse Account
 *
 * @apiExample {js} Example request
 * {
 *  auth0_id: 'auth0|abc123def456'
 * }
 *
 * @apiUse AccountResult
 * 
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /accounts Get accounts by type
 * @apiName GetAccountsByType
 * @apiGroup Accounts
 *
 * @apiSuccess {Object[]} accts The accounts
 * @apiUse Account
 *
 * @apiExample {js} Example request
 * {
 *  acct_type: 'Coach'
 * }
 * 
 * @apiUse AccountResult
 * 
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /accounts Get account by id
 * @apiName GetAccountById
 * @apiGroup Accounts
 *
 * @apiSuccess {Object[]} accts The accounts
 * @apiUse Account
 * 
 * @apiExample {js} Example request
 * {
 *  acct_id: 1
 * }
 * 
 * @apiUse AccountResult
 * 
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /accounts Get account by name/email
 * @apiName GetAccountByName
 * @apiGroup Accounts
 *
 * @apiSuccess {Object[]} accts The accounts
 * @apiUse Account
 * 
 * @apiExample {js} Example request
 * {
 *  first_name: 'Harry',
 *  last_name: 'Belvidere',
 *  email: 'h.belvidere@email.com'
 * }
 *
 * @apiUse AccountResult
 * 
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /accounts Get accounts by program
 * @apiName GetAccountsByProgram
 * @apiGroup Accounts
 *
 * @apiSuccess {Object[]} accts The accounts
 * @apiUse Account
 * 
 * @apiError (Error501) UnsupportedRequestError Invalid param passed
 * 
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /accounts Get accounts by site
 * @apiName GetAccountsBySite
 * @apiGroup Accounts
 *
 * @apiSuccess {Object[]} accts The accounts
 * @apiUse Account
 * 
 * @apiExample {js} Example request
 * {
 *  site_id: 3
 * }
 * 
 * @apiUse AccountResult
 * 
 * @apiVersion 1.0.0
 */

/**
 * @api {post} /accounts Create an account
 * @apiName CreateAccount
 * @apiGroup Accounts
 *
 * @apiDescription Creates an account in the backend database and in the Auth0 client. The username must be between 4 and 15 characters and be unique from usernames already existing for the Auth0 instance. The email must be valid and unique from emails already registered with the Auth0 instance. The password must be at least eight characters and include uppercase and lowercase letters and numbers. The account type must be one of 'Admin', 'Staff', 'Coach', or 'Volunteer'.
 *
 * @apiParam {String} first_name Account first name
 * @apiParam {String} last_name Account last name
 * @apiParam {String} username Account username
 * @apiParam {String} email Account email
 * @apiParam {String} acct_type Account type ('Admin', 'Staff', 'Coach', 'Volunteer')
 * @apiParam {String} password Account password
 *
 * @apiExample {js} Example request
 * {
 *  first_name: "Danny",
 *  last_name: "Porter",
 *  username: "d_porter",
 *  email: "d.porter@email.com",
 *  acct_type: "Volunteer",
 *  password: "passw0rd"
 * }
 *
 * @apiError (Error400) InvalidAccountType Account type must be Admin/Staff/Coach/Volunteer
 * @apiError (Error400) MissingFieldError Request was missing a parameter
 * @apiError (Error400) EmptyFieldError Request had an empty parameter
 * @apiError (Error400) PasswordTooWeek Password does not meet requirements
 * @apiUse InternalServerError
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {put} /accounts/:account_id Update an account
 * @apiName UpdateAccount
 * @apiGroup Accounts
 *
 * @apiParam {String} first_name First name for update
 * @apiParam {String} last_name Last name for update
 * @apiParam {String} email Email for update
 * @apiParam {String} acct_type Account type ('Admin', 'Staff', 'Coach', 'Volunteer')
 *
 * @apiSuccess {Object[]} accts The accounts
 * @apiUse Account
 *
 * @apiExample {js} Example request
 * {
 *  first_name: "Sarah",
 *  acct_type: "Coach"
 * }
 *
 * @apiSuccessExample {Object[]} Success-Result
 * [
 *  {
 *   "acct_id": 4,
 *   "auth0_id": "auth0|987zyx654wvu",
 *   "first_name": "Sarah",
 *   "last_name": "Washington",
 *   "email": "wash_s@email.com",
 *   "acct_type": "Coach"
 *  }
 * ]
 * 
 * @apiUse InvalidArgumentError
 * @apiError (Error501) UnsupportedRequestError No valid update fields given
 * @apiUse InternalServerError
 *
 * @apiVersion 1.0.0
 */

/**
 * @api {delete} /accounts/:account_id Delete an account
 * @apiName DeleteAccount
 * @apiGroup Accounts
 *
 * @apiDescription Deletes an account from the backend database and from the Auth0 instance. If one deletion fails, a rollback will be performed so that the backend and Auth0 remain in sync.
 *
 * @apiError (Error404) ResourceNotFound No account with given id
 * @apiError (Error400) MissingFieldError Request was missing a parameter
 * @apiError (Error400) EmptyFieldError Request had an empty parameter
 * @apiUse InternalServerError
 *
 * @apiVersion 1.0.0
 */

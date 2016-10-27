'use strict';

var mysql = require('promise-mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'example.org',
  user: 'bob',
  password: 'secret',
  database: 'my_db'
});

module.exports = {
  pool
};

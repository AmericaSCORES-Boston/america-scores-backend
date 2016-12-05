'use strict';

const mysql = require('mysql');
const Promise = require('bluebird');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

Promise.promisifyAll(mysql);
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

const pool = mysql.createPool({
  connectionLimit: 10,
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.db
});

function getSqlConnection() {
  return pool.getConnectionAsync()
    .disposer(function(connection) {
      connection.release();
    });
}

module.exports = {
  getSqlConnection
};

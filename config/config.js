'use strict';

require('dotenv').config();

const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
const Pool = require('mysql/lib/Pool');
const Promise = require('bluebird');

Promise.promisifyAll([
  Connection,
  Pool
]);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const getConnection = () => {
  return pool
    .getConnectionAsync()
    .then((connection) => {
      return connection;
    })
    .disposer((connection) => {
      console.log(connection);
      return connection.releaseAsync();
    });
};

module.exports = {
  getConnection
};

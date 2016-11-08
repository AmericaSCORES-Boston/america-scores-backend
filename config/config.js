'use strict';

require('dotenv').config();

const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
const Pool = require('mysql/lib/Pool');
const Promise = require('bluebird');

Promise.promisifyAll([
  Connection
]);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const createConnection = () => {
  return connection
    .connectAsync()
    .then((result) => {
      return connection;
    })
    .disposer(() => {
      return connection.endAsync();
    });
};

module.exports = {
  createConnection
};

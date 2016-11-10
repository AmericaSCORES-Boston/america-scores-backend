'use strict';

const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
const Promise = require('bluebird');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

Promise.promisifyAll([
  Connection
]);

const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.db
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

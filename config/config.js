'use strict';

const creds = require('./creds');

module.exports = {
  development: {
    database: {
      host: creds.development.database.host,
      port: creds.development.database.port,
      db: creds.development.database.db,
      user: creds.development.database.user,
      password: creds.development.database.password
    },

    server: {
      host: '127.0.0.1',
      port: '8888'
    }
  },

  production: {
    database: {
      host: creds.production.database.host,
      port: creds.production.database.port,
      db: creds.production.database.db,
      user: creds.production.database.user,
      password: creds.production.database.password
    },

    server: {
      host: '127.0.0.1',
      port: '8888'
    }
  }
};

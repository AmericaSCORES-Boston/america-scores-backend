'use strict';

const creds = require('/amscores/config/creds.js');

module.exports = {
  development: {
    database: {
      host: '127.0.0.1',
      port: '3306',
      db: 'america_scores',
      user: creds.development.database.user,
      password: creds.development.database.password
    },

    server: {
      host: '127.0.0.1',
      port: '7777'
    }
  },

  production: {
    database: {
      host: '127.0.0.1',
      port: '3306',
      db: '',
      user: creds.production.database.user,
      password: creds.production.database.password
    },

    server: {
      host: '127.0.0.1',
      port: '7778'
    }
  }
};

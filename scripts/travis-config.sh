echo "'use strict';

module.exports = {
  development: {
    database: {
      host: '127.0.0.1',
      port: '3306',
      db: 'america_scores',
      user: 'travis',
      password: ''
    }
  },

  production: {
    database: {
      host: '127.0.0.1',
      port: '3306',
      db: 'america_scores',
      user: 'travis',
      password: ''
    }
  }
};
" > config/creds.js

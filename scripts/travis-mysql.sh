echo "'use strict';

module.exports = {
  development: {
    database: {
      user: 'travis',
      password: ''
    }
  },

  production: {
    database: {
      user: 'travis',
      password: ''
    }
  }
};
" > config/creds.js

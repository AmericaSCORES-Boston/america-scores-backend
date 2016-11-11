const net = require('net');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];

const query = require('./lib/utils.js').query;

const server = net.createServer(function(socket) {
  query('SHOW TABLES;').then(function(data) {
    socket.end(JSON.stringify(data) + '\n');
  });
});

server.listen(config.server.port);

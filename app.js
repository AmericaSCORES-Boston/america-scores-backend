const net = require('net');
const mysql = require('mysql');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.js')[env];

const conn = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.db
});

const server = net.createServer(function(socket) {
  conn.query('SHOW TABLES;', function(err, rows) {
    if (err) {
      socket.end(err);
    }

    socket.end(JSON.stringify(rows));
  });
});

server.listen(config.server.port);

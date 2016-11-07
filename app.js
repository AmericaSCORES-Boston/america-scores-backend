var net = require('net');

var server = net.createServer(function(socket) {
    socket.end('Hello!\n');
});

//server.listen(7777);
server.listen(7776);

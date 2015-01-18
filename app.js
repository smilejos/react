var express = require('express');
var io = require('socket.io');

var mongod = require('./db');
var app = express();

app.use(express.static(__dirname + '/'));
app.set('title', 'React Sample');
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3001);
var socketServer = io.listen(server);

socketServer.on('connection', function (socketClient) {

    console.log('a user connected');

    socketClient.on('sendComment', function (comment) {
        console.log('receive comment');
        socketServer.emit('receiveComment', comment);
    });

    socketClient.on('disconnect', function () {
        console.log('user disconnected');
    });
});
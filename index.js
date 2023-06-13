const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    socket.on('set nickname', (nickname) => {
        users[socket.id] = nickname;

        socket.broadcast.emit('chat message', {
            nickname: 'Make Chat',
            message: `${nickname} has connected`
        });
    });

    socket.on('chat message', (data) => {
        const { nickname, message } = data;
        io.emit('chat message', { nickname, message });
    });

    socket.on('typing', () => {
        const nickname = users[socket.id];
        socket.broadcast.emit('typing', nickname);
    });

    socket.on('disconnect', () => {
        const nickname = users[socket.id];
        delete users[socket.id];


        socket.broadcast.emit('chat message', {
            nickname: 'Make Chat',
            message: `${nickname} has disconnected`
        });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
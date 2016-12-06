"use strict";

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

const channelUsers = [];

io.on('connection', function(socket){
    console.log('user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
        channelUsers.forEach((users, channel) => {
            let idx = users.indexOf(socket);
            if (idx > -1) {
                users.splice(idx, 1);
            }
        });
    });
    socket.on('channel.join', msg => {
        console.log(`${msg.nickname} joined ${msg.channel}`);
        if (!channelUsers[msg.channel]) {
            channelUsers[msg.channel] = [];
        }
        channelUsers[msg.channel].push(socket);
        channelUsers[msg.channel].forEach(socket=>{
            socket.emit('channel.joined', msg)
        });
    });
    socket.on('chat.message', function(msg){
        console.log(`${msg.nickname} posted in ${msg.channel}: ${msg.text}`);
        channelUsers[msg.channel].forEach(socket=>{
            socket.emit('chat.message', msg)
        });
    });
});
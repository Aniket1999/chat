const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage,generateImgMessage,generateVidMessage,generateAttMessage,generateAdminMessage,generateAdminLMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newAdminMessage', generateAdminMessage('Admin', ' Hi, welcome to PrivateChat!Go ahead and send a message. 😄'));
    socket.broadcast.to(params.room).emit('newAdminMessage', generateAdminMessage('Admin', `${params.name} has joined the room.`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)) {
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
      var user = users.getUser(socket.id);
      if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
      }
    });
  
  socket.on('createImgMessage', (msg) => {
    var user = users.getUser(socket.id);
    if(user) {
    io.to(user.room).emit('newImgMessage', generateImgMessage(user.name, msg.img));
    }
  });
  
  socket.on('createVidMessage', (msg) => {
    var user = users.getUser(socket.id);
    if(user) {
    io.to(user.room).emit('newVidMessage', generateVidMessage(user.name, msg.vid));
    }
  });
  
  socket.on('createAttMessage', (msg) => {
    var user = users.getUser(socket.id);
    if(user) {
    io.to(user.room).emit('newAttMessage', generateAttMessage(user.name, msg.att));
    }
  });
  
  // socket.on('user image', function (msg) {
  //     console.log(msg);
  //     socket.broadcast.emit('user image', socket.nickname, msg);
  //   });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    console.log(user);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newAdminLMessage', generateAdminLMessage('Admin', `${user.name} has left the room.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

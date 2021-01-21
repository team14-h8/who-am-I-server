const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 5002

// a comment to start development branch
const message = "welcome to Tic-Tac-Toe!"

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit("init", data)

  socket.on('updateLeaderboards', (payload) => {
      console.log(payload, "<<dari server nihh");
      socket.broadcast.emit('sendLeaderboardsToOther', payload);
  })

  socket.on('loseMessage', (payload) => {
      console.log(payload, "<<dari server nihh");
      socket.broadcast.emit('sendLoseToOther', payload);
  })

  socket.on('newMessage', (payload) => {
      console.log(payload, "<<dari server nihh");
      socket.broadcast.emit('sendMessageToOther', payload);
  })

  
});

server.listen(PORT, () => {
  console.log('Tic-Tac-Toe running on port: ' + PORT)
})

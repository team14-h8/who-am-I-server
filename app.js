const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 5002

// a comment to start development branch
const newPlayerMessage = "a new challenger has entered the game!"

const users = []

io.on('connection', function (socket) {
  ID = socket.id
  // client connect, masuk ke sini
  console.log('Socket.io client connected')
  // server akan membalas dengan ini
  socket.emit('init', users)


  socket.on('newPlayer', function (payload) {
    payload.id = ID
    users.push(payload)
    io.emit('getAllUsers', users) // send to other users expect the client
    io.emit('newPlayer', { message: newPlayerMessage })
    //io.emit // send to everyone including the client
  })
})

server.listen(PORT, () => {
  console.log('Tic-Tac-Toe running on port: ' + PORT)
})

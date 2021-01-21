const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 5002

const message = "welcome to Tic-Tac-Toe!"

io.on('connection', function (socket) {
  // client connect, masuk ke sini
  console.log('Socket.io client connected')
  // server akan membalas dengan ini
  socket.emit('init', { message })

  socket.on('newMessage', function (payload) {
    //socket.broadcast.emit // send to other users expect the client
    //io.emit // send to everyone including the client
  })
})

server.listen(PORT, () => {
  console.log('Tic-Tac-Toe running on port: ' + PORT)
})

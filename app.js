const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 5002

// a comment to start development branch
const message = "welcome to Tic-Tac-Toe!"
const questions = [
  {
    image_url: 'https://i.ibb.co/SvS3F0z/najwa-pixelated.png',
    answer: 'najwa shihab'
  },
  {
    image_url: 'https://i.ibb.co/KsZz0bj/jokowi-pixelated.png',
    answer: 'joko widodo'
  },
  {
    image_url: 'https://i.ibb.co/VpCCG6q/anya-pixelated.png',
    answer: 'anya geraldine'
  },
  {
    image_url: 'https://i.ibb.co/QNrPhpK/ahmad-dhani-pixelated.png',
    answer: 'ahmad dhani'
  },
  {
    image_url: 'https://i.ibb.co/T8HPG6B/agnes-mo-pixelated.png',
    answer: 'agnes monica'
  },
  {
    image_url: 'https://i.ibb.co/ynkRNR5/raff-ahmad-pixelated.png',
    answer: 'raffi ahmad'
  }
]

const rooms = [
  {
    id: 'default',
    isStarted: false,
    scores: []
  }
]

const newPlayerMessage = "a new challenger has entered the game!"

const users = []

io.on('connection', (socket) => {
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

    let filteredRooms = rooms.filter(room => {
      return !room.isStarted
    })

    socket.emit('getAllRooms', filteredRooms)
  })

  console.log('a user connected');
  socket.emit("init", message)

  socket.on('joinRoom', (user, roomId) => {
    let room = rooms.find( el => el.id === roomId)
    room.scores.push({
      id: socket.id,
      user: user,
      score: 0
    })

    socket.join(roomId)
    socket.emit('initQuiz', questions)
  })

  socket.on('createRoom', (user, roomId) => {
    console.log('create room', roomId)
    let room = rooms.find( el => el.id === roomId)

    if (!room) {
      rooms.push({
        id: roomId,
        isStarted: false,
        scores: [{
          id: socket.id,
          user: user,
          score: 0
        }]
      })
    } else {
      room.scores.push({
        id: socket.id,
        user: user,
        score: 0
      })
    }

    socket.join(roomId)
    socket.emit('initQuiz', questions)
  })

  socket.on('playerStartGame', (roomId) => {
    console.log('Player start game ', roomId)
    let room = rooms.find( el => el.id === roomId)

    room.isStarted = true
    console.log(rooms)

    io.in(roomId).emit('updateScores', room.scores)
    io.in(roomId).emit('startGame')

  })

  socket.on('correctAnswer', (userId, roomId) => {
    let room = rooms.find( el => el.id === roomId)
    let score = room.scores.find( el => el.id === socket.id)

    if (score) {
      score.score += 100
    } else {
      room.scores.push({
        id: socket.id,
        user: userId,
        score: 100
      })
    }

    console.log(room.scores)
    io.in(roomId).emit('updateScores', room.scores)
  })

  socket.on('playerWin', (userId, roomId) => {
    let room = rooms.find( el => el.id === roomId)

    room.isStarted = false
    room.scores = []

    socket.to(roomId).emit('playerLose')
  })

});

server.listen(PORT, () => {
  console.log('Tic-Tac-Toe running on port: ' + PORT)
})

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
    // scores: [
    //   {
    //     user: '1',
    //     score: 100
    //   }
    // ]
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
  })

  console.log('a user connected');
  socket.emit("init", message)

  // Join room and get questions list
  socket.join('default')
  socket.emit('initQuiz', questions)

  socket.on('playerStartGame', (roomId) => {
    console.log('Player start game ', roomId)
    let room = rooms.find( el => el.id === roomId)

    room.isStarted = true
    console.log(rooms)

    io.in('default').emit('startGame')

  })

  socket.on('correctAnswer', (userId, roomId) => {
    let room = rooms.find( el => el.id === roomId)
    let score = room.scores.find( el => el.user === userId)

    if (score) {
      score.score += 100
    } else {
      room.scores.push({
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

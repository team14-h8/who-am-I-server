const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 5002

// a comment to start development branch
const message = "welcome to Tic-Tac-Toe!"
const questions = [
  {
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png',
    answer: 'phone'
  },
  {
    image_url: 'https://www.talkwalker.com/images/2020/blog-headers/image-analysis.png',
    answer: 'eye'
  },
  {
    image_url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
    answer: 'tree'
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

io.on('connection', (socket) => {
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

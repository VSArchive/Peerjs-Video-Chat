const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const ejs = require('ejs')
const {v4: uuid} = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    const roomID = uuid()
    res.redirect(`/${roomID}`)
})

app.get('/:roomID', (req, res) => {
    res.render('room', {roomID: req.params.roomID})
})

io.on('connection', socket => {
    socket.on('join-room', (roomID, userId) => {
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomID).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000)


// Server imports
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

// Peer Server imports
const peerExpress = require('express')
const peerApp = peerExpress()
const peerServer = require('http').createServer(peerApp);
const { ExpressPeerServer } = require('peer')

const { v4: uuidV4 } = require('uuid')

const PORT = process.env.PORT || 4000
const PEER_PORT = process.env.PEER_PORT || 4001

app.set('view engine', 'ejs')
app.use(express.static('public'))

peerApp.use('/peerJs', ExpressPeerServer(peerServer))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('message', (message) => {
            io.to(roomId).emit('createMessage', message)
        })

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(PORT)
peerServer.listen(PEER_PORT)
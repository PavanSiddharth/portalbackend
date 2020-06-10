const express = require('express');
const http = require('http')
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app)
const io = socketio(server)
const router = express.Router();

console.log("you are in chatjs route")
router.get('/chats',async (req, res) => {
    try{
    io.on('connection', (socket) => {
        console.log('New WebSocket connection')
        console.log("socketid: "+socket.id)

        socket.emit('message', 'Welcome!')

        //Sends this message to all connected clients except this one.
        socket.broadcast.emit('message', 'A new user has joined!')

        socket.on('sendMessage', (message, callback) => {

            io.emit('message', message)
            callback()
        })

        socket.on('disconnect', () => {
            io.emit('message', 'A user has left!')
        })
    })
}catch(error){
    console.log(error)
}
})

module.exports = router;

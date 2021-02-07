const express = require('express');
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const reload = require('reload')

//port for express server
const port = process.env.PORT || 3000

//server middleware
app.use(express.static('public'))

//socket server handles incoming 
//players and playing the game
require('./socket')(io)

//reload frontend on save here
reload(app)
.then(function (reloadReturned) {

    //reload started, start web server
    http.listen(port, function () {
        console.log('Web server listening on port ' + port)
    })
}).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
})
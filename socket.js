const fs = require('fs')
const {Game} = require('./game')

const game = new Game()

let players = []
let answerIndex = 0

module.exports = function (io) {
    io.on('connection', socket => {

        socket.on('add', name => {
            const newPlayers = game.addPlayer(name, players, 0)
            players = newPlayers
            io.emit('players', players)
        })

        socket.on('answer', arg => {
            // console.log(arg);
            const newPlayers = game.answer(arg.name, players, arg.answer, answerIndex++)
            players = newPlayers
            io.emit('players', players)
        })

        socket.on('disconnect', () => {
            // game.removePlayer()
        })
    })
}
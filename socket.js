const fs = require('fs')
const {Game} = require('./game')

const game = new Game()

let global_players = []
let globalAnswerIndex = 0

const actions = {
    "add" : function(args){
        return game.addPlayer(args.id, args.name, global_players, 0)
    },
    'answer': function(args) {
        console.log('answering...')
       return game.answer(args.id, args.name, global_players, args.answer, globalAnswerIndex++)
    },
    'disconnect': function (args) {
        return game.removePlayer(args.id, global_players)
        
    }
}

const runAction = (eventString, args, io) => {
    const newPlayers = actions[eventString](args)
    global_players = newPlayers
    sendToClients(io, 'players', newPlayers)
}

const sendToClients = (io, eventString, arg) => {
    io.emit(eventString, arg)
}

//to abstract below...
//make function
//get args based on event String passed in
//always to runAction with eventString, args, io


const exposeSocketListeners = (io, socket) => {
    socket.on('add', name => {
        const args = {
            name: name,
            id: socket.id
        }
        runAction('add', args, io)
    })

    socket.on('answer', args => {
        args.id = socket.id
        runAction('answer', args, io)
    })

    socket.on('disconnect', () => {
        const args = { id: socket.id }
        runAction('disconnect', args, io)
    })
}

const socketServer = (io) => {
    io.on('connection', (socket) => exposeSocketListeners(io, socket))
}

module.exports = socketServer
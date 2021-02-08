const fs = require('fs')
const {Game} = require('./game')

const game = new Game()

let global_players = []
let globalAnswerIndex = 0

const actions = {
    "add" : {
        getArgs: function(id, incoming) {
            const args = {
                id: id,
                name: incoming
            }
            return args
        },
        action: function(args){
            console.log('Adding player...');
            return game.addPlayer(args.id, args.name, global_players, 0)
        }
    },
    'answer': {
        getArgs: function (id, incoming) {
            const args = {id: id, ...incoming}
            return args
        },
        action: function (args) {
            console.log('Player answering...')
            console.log(args);
            return game.answer(args.id, args.name, global_players, args.answer, globalAnswerIndex++)
        }
    },
    'disconnect': {
        getArgs: function (id, incoming) {
            const args = { id: id }
            return args
        },
        action: function (args) {
            console.log('Player leaving...');
            return game.removePlayer(args.id, global_players)
        }
    }
}

const sendToClients = (io, eventString, arg) => {
    io.emit(eventString, arg)
}

const runAction = (eventString, args, io) => {
    const newPlayers = actions[eventString].action(args)
    global_players = newPlayers
    sendToClients(io, 'players', newPlayers)
}

//get args based on event String passed in
const getArgs = (eventString, id, incoming) => {
    return actions[eventString].getArgs(id, incoming)
}

const getArgsRunAction = (eventString, io, id, incomingData) => {
    const args = getArgs(eventString, id, incomingData)
    runAction(eventString, args, io)
}

const handleIncomingPacket = (packet, io, id) => {
    const [eventString, data] = packet.data
    getArgsRunAction(eventString, io, id, data)
  }

const exposeSocketListeners = (io, socket) => {
    socket.on('*', packet => handleIncomingPacket(packet, io, socket.id))

    socket.on('disconnect', () => getArgsRunAction('disconnect', io, socket.id, null))
}

const socketServer = io => {
    io.on('connection', socket => exposeSocketListeners(io, socket))
}

module.exports = socketServer
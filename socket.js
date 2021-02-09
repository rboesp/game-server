const fs = require('fs')
const {Game} = require('./game')

const game = new Game()

let global_players = []

class GameAction {
    constructor(actionCB) {
        this.actionCB = actionCB
    }
    action(args){
        return this.actionCB(args) //packaged here in arg
    }
}

const eventStringsTiedToGameActions = [
    {name: 'add', action: game.addPlayer},
    {name: 'answer', action: game.answer},
    {name: 'disconnect', action : game.removePlayer}
]


/**entry point */
//chec kfor better way, if cant find check ramda
const actions = {}
eventStringsTiedToGameActions.forEach(action => {
    actions[action.name] = new GameAction(action.action)
})

const getArgsRunAction = (eventString, data, id) => {
    const args = { 
        id: id, 
        players: global_players,
        ...data
    } //packaged here
    const newPlayers = actions[eventString].action(args)
    if(newPlayers[newPlayers.length - 1] === 'score') {
        newPlayers.pop()
    }
    global_players = newPlayers
    return newPlayers
}

const handleIncomingPacket = (id, packet, io) => {
    const [eventString, data] = packet.data
    const newPlayers = getArgsRunAction(eventString, data, id)
    io.emit('players', newPlayers)
}

const exposeSocketListeners = (io, socket) => {
    socket.on('*', packet => handleIncomingPacket(socket.id, packet, io))
    socket.on('disconnect', () => getArgsRunAction('disconnect', io, socket.id, null))
}

const socketServer = io => {
    io.on('connection', socket => exposeSocketListeners(io, socket))
}

module.exports = socketServer
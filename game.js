class Player {
    constructor(id, name, score) {
        this.id = id
        this.name = name
        this.score = score
    }
}

class Game {
    constructor() {
        this.answers = ['bloop', 'blep', 'blap'] //change this to closure
    }
    addScore(id, playerName, players, amount = 15) {
        const score = this.getScore(playerName, players)
        const left = players.filter(p => p.name !== playerName)
        const newPlayers = this.addPlayer(id, playerName, left, amount+score)
        return newPlayers
    }
    getScore(playerName, players) {
        return players.filter(p => p.name === playerName)[0].score
    }
    // fillPlayers(playerNames, startingScore = 0) {
    //     return playerNames.map(name => new Player(id, name, startingScore))
    // } //wont work because of ids for now ^
    addPlayer(id, playerName, players, startingScore = 0) {
        return [...players, new Player(id, playerName, startingScore)]
    }
    removePlayer(id, players) {
        return players.filter(player => player.id !== id)
    }
    answer(id, playerName, players, answer, currentAnswerIndex) {
        return (answer !== this.answers[currentAnswerIndex]) ? players : this.addScore(id, playerName, players)
    }
    endGame(players) {
        return players.sort((x,y) => x.score <= y.score ? 1 : -1)
    }
}

module.exports.Game = Game

/*ENTRY POINT */
// const game = new Game()
// const playerNames = ["Robert", "Charles", "Jessica"]
// const players = game.fillPlayers(playerNames)
// console.log(players);

// const newPlayers1 = game.addPlayer('Carlos', players)
// console.log(newPlayers1);

// const newPlayers2 = game.addScore('Jessica', newPlayers1, 15)
// console.log(newPlayers2);

// const newPlayers3 = game.removePlayer('Carlos', newPlayers2)
// console.log(newPlayers3);


// class command{
//     constructor(name, args, callback) {
//         this.name = name
//         this.args = args
//         this.callback = callback
//     }
//     getName(){}
//     getArgs(){}
//     getCallback(){}
//     run() {}
// }

// const commands = []

// function evaluate(players = [], commands) {
//     if(!commands.length) return
//     //run command
//     const nextCommand = commands.pop()
//     const newPlayers = nextCommand.run()
//     evaluate(newPlayers, commands)
// }
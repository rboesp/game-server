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
        this.scoreIncrease = 15
    }
    addScore = (args) => {
        const score = this.getScore(args.playerName, args.players)
        const left = args.players.filter(p => p.name !== args.playerName)
        const newArgs = {
            players : left,
            id : args.id,
            playerName: args.playerName,
        }
        const newPlayers = this.addPlayer(newArgs, score + this.scoreIncrease)
        newPlayers.push('score')
        return newPlayers
    }
    getScore(playerName, players) {
        return players.filter(p => p.name === playerName)[0].score
    }
    // fillPlayers(playerNames, startingScore = 0) {
    //     return playerNames.map(name => new Player(id, name, startingScore))
    // } //wont work because of ids for now ^
    addPlayer(args, score = 0) {
        return [...args.players, new Player(args.id, args.playerName, score)]
    }
    removePlayer(args) {
        return args.players.filter(player => player.id !== args.id)
    }
    answer = (args) => {
        return (
            (args.answer !== this.answers[args.currentAnswerIndex]) 
            ? args.players 
            : this.addScore(args)
        )
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
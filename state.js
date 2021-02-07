class PlayingState {
    constructor() {
        this.players = []
    }
    play(players) {
        console.log('Were playing');
        this.players.concat(players)
        console.log(this.players);
    }
}

class WaitingState {
    constructor(nextStateCB) {
        this.name = 'waiting'
        this.players = []
        this.next = nextStateCB
    }
    addPlayer(player) {
        console.log('Another waiter!!');
        this.players.push(player)
        if(this.players.length < 2) return 'Not ready!'
        this.next() 
    }
    empty() {
        this.players = []
    }
}

class GameManager {
    constructor() {
        this.x = new WaitingState(this.changeState),
        this.y = new PlayingState()
        this.states = [
            this.x,
            this.y
        ]
        this.state = 'waiting'
    }
    incomingPlayer(playerName) {
        switch (this.state) {
            case 'playing':
                console.log('We are playing but you will be in next!');
                break;
        
            default:
                console.log('We"re starting soon!');
                break;
        }
        this.states[0].addPlayer(playerName)
    }
    changeState = () => {
        switch (this.state) {
            case 'waiting':
                console.log('hi');
                this.state = 'playing'
                this.states[1].play(this.x.players)
                this.x.empty()
                break;
            
            case 'playing':
                this.state = 'waiting'
            default:
                break;
        }
    }
}



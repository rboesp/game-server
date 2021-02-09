//imports
const io = require('socket.io-client')
const inquirer = require('inquirer')

//create server
const socket = io('http://localhost:3000')

//setup questions for user
const askName = [{
    type: 'input',
    name: 'name',
    message: "What is your name?"
}]
const answerInput = [{
    type: 'input',
    name: 'cmd',
    message: "******\n"
}]
const prompt = inquirer.createPromptModule()



/*FUNCTIONS */
const getName = () => {
    return new Promise((done) => {
        prompt(askName)
        .then((input) => {
            sendName(input)
            done(input.name)
        })
    })
}
const sendName = (userInput) => {
    const {name} = userInput
    socket.emit('add', { playerName : name })
}
//todo: emit the correct object 


const getNextCmd = (username) => {
    prompt(answerInput)
    .then((input) => {
        const {cmd} = input
        next(cmd, username)
    })
}

const next = (cmd, username) => {
    socket.emit('answer', {
        playerName: username, 
        answer: cmd
    }) //next get it with inquirer
    getNextCmd(username)
}

/*SOCKET CONNECTIONS / EVENTS */
//when user connects
socket.on('connect', async () => {
    console.log(socket.id)

    //get name from user
    const username = await getName()
    getNextCmd(username)

    //when player joins, this is handled here,
    //later encapsulate somewhere else
    socket.on('players', players=> {
        console.log('\tScores:')
        players.forEach(player => {
            console.log(`\t${player.name} ${player.score}`)
        });
        console.log(">>>");
    })
})
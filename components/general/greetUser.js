

// Random logon message
function greetUser(){

    var botDev = "466199217199775754";

    var helloChannel = botDev;

    var greetMessage;

    switch (Math.floor(Math.random() * 5)) {

    case 0:
        greetMessage = 'Me not that kind of orc!'
        break;

    case 1:
        greetMessage = 'Zug Zug'
        break;

    case 2:
        greetMessage = 'Work Work'
        break;

    case 3:
        greetMessage = 'Something need doing?'
        break;

    case 4:
        greetMessage = 'Yes?'
        break;
    }

    return { greetMessage, helloChannel };
}

module.exports.greetUser = greetUser;

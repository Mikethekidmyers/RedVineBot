// https://izy521.github.io/discord.io-docs/Discord.Client.html#editChannelInfo
//Dev mode
    const config = require('./config.js');
    const clientId = config.clientId;
    const clientSecret = config.clientSecret;
    const botUsername = config.botUsername;
    const botToken = config.botToken;
    const APIkey = config.APIkey;
//Dev mode

//Live mode
    // const clientId = process.env.clientId;
    // const clientSecret = process.env.clientSecret;
    // const botUsername = process.env.botUsername;
    // const botToken = process.env.botToken;
    // const APIkey = process.env.APIkey;
//Live mode

const Discord = require('discord.io');
const axios = require('axios');
const help = require('./core/help.js');
const gulag = require('./components/general/banishPlayer.js');
const greetUser = require('./components/general/greetUser.js');
const emojiPicker = require('./components/general/getEmoji.js');
const chooseCaptain = require('./components/general/chooseCaptain.js');
const presence = require('./components/general/botPresence.js');
const gameModeSwitch = require('./components/pubg/gameMode.js');
const dropZone = require('./components/pubg/dropZone.js');
const getSeasons = require('./components/pubg/getSeasons.js');
const seasonStats = require('./components/pubg/seasonStats.js');
const lastMatch = require('./components/pubg/lastMatch.js');
const getMatchData = require('./components/pubg/getMatchData.js');
const inspectGame = require('./components/pubg/inspectGame.js');
const inspectKD = require('./components/pubg/inspectKD.js');
const lastCustom = require('./components/pubg/lastCustom.js');

const fs = require('fs');

let lastSeason = "test";

//https://izy521.gitbooks.io/discord-io/content/Client.html

let greeting = greetUser.greetUser();

// Events
//https://izy521.gitbooks.io/discord-io/content/Events/Client.html
const bot = new Discord.Client({
    token: botToken, // Used for bot login
    autorun: true, // Connect immediately
});

// When the bot starts
bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
    initialPresence();
    getSeasons.getSeasons(axios, APIkey);

    bot.sendMessage({
        to: greeting.helloChannel,
        message: greeting.greetMessage,
    });
});

// dc handler

bot.on('disconnect', (errMsg, code) => {
    if(errMsg) console.log(errMsg, code)
    bot.connect();
});

// message handler

bot.on('message', (data) => {
    if(data.type !== 'message'){
        return;
    }
    handleMessage(data.text);
});

function initialPresence(){
    bot.setPresence({
        game: {
            type: 1,
            name: presence.presenceRotator(),
        }
    });
}

setInterval( function setPresence(){
    var presenceVar = presence.presenceRotator();
    bot.setPresence({
        game: {
            type: 1,
            name: presenceVar,
        }
    });
}, 120000);


// When chat messages are received
bot.on("message", function (user, userID, channelID, message, rawEvent)
{
    let parameters = message.split(" ");

    var shortHand = bot.servers[bot.channels[channelID].guild_id];

    if(userID == '142373989770199040'){
        //if the user is marcus, moves him to the afk channel
        gulag.banishPlayer(shortHand, userID);
    } else if (parameters[0] == "pubg"){
        var playerName = parameters[1]; // store the command for cleaner code/reading

        lastMatch.lastMatch(bot, axios, APIkey, channelID, playerName);
    } else if(parameters[0] == "inspect"){
        var playerName = parameters[1];

        inspectGame.inspectGame(bot, axios, APIkey, channelID, playerName);
    } else if(parameters[0] == "KD"){
        var playerName = parameters[1];

        inspectKD.inspectKD(bot, axios, APIkey, channelID, playerName);
    } else if(parameters[0] == "custom"){
        //checks if the player played a custom match as his last match
        if(parameters[1] == "id"){

            var playerName = parameters[2];
            var returnID = true;

            lastCustom.lastCustom(bot, axios, APIkey, channelID, playerName, returnID);

        } else {

            var playerName = parameters[2];
            var returnID = false;

            lastCustom.lastCustom(bot, axios, APIkey, channelID, playerName, returnID);

        }
    } else if(parameters[0] == "season"){
            if(parameters[1] == "solo"){
                var gameMode = parameters[1];
                var playerName = parameters[2];
                seasonStats.seasonStats(bot, axios, APIkey, channelID, playerName, gameMode);

            } else if(parameters[1] == "duo"){
                var gameMode = parameters[1];
                var playerName = parameters[2];
                seasonStats.seasonStats(bot, axios, APIkey, channelID, playerName, gameMode);

            } else if(parameters[1] == "squad"){
                var gameMode = parameters[1];
                var playerName = parameters[2];
                seasonStats.seasonStats(bot, axios, APIkey, channelID, playerName, gameMode);
        }
    } else if (parameters[0] == "drop"){
        var mapName = parameters[1];

        dropZone.dropZone(bot, channelID, mapName);

    } else if(parameters[0] == "captain"){

        chooseCaptain.chooseCaptain(bot, channelID, userID);

    } else if (parameters[0] == "help"){

        help.help(bot, channelID);

    }
});

// end of file

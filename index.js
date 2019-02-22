// https://izy521.github.io/discord.io-docs/Discord.Client.html#editChannelInfo

//Dev mode env config
    // const config = require('./config.js');
    // const clientId = config.clientId;
    // const clientSecret = config.clientSecret;
    // const botUsername = config.botUsername;
    // const botToken = config.botToken;
    // const APIkey = config.APIkey;
// Live mode env config
    const clientId = process.env.clientId;
    const clientSecret = process.env.clientSecret;
    const botUsername = process.env.botUsername;
    const botToken = process.env.botToken;
    const APIkey = process.env.APIkey;

// require the different components into the index file
const Discord = require('discord.io');
const axios = require('axios');
const fs = require('fs');

// these are the discord specific components
const help = require('./core/help.js');
const gulag = require('./components/general/banishPlayer.js');
const greetUser = require('./components/general/greetUser.js');
const emojiPicker = require('./components/general/getEmoji.js');
const chooseCaptain = require('./components/general/chooseCaptain.js');
const presence = require('./components/general/botPresence.js');

// these are pubg specific components
const gameModeSwitch = require('./components/pubg/gameMode.js');
const dropZone = require('./components/pubg/dropZone.js');
const getSeasons = require('./components/pubg/getSeasons.js');
const seasonStats = require('./components/pubg/seasonStats.js');
const lastMatch = require('./components/pubg/lastMatch.js');
const getMatchData = require('./components/pubg/getMatchData.js');
const inspectGame = require('./components/pubg/inspectGame.js');
const inspectKD = require('./components/pubg/inspectKD.js');
const lastCustom = require('./components/pubg/lastCustom.js');

// Global variables
var lastSeason = "test";
var greeting = greetUser.greetUser();

// Events
const bot = new Discord.Client({
    token: botToken, // Used for bot identity
    autorun: true, // Connect immediately
});

// When the bot starts
bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
    initialPresence();
    const currentSeason = getSeasons.getSeasons(axios, APIkey);

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

// sets the bots inital presence
function initialPresence(){
    bot.setPresence({
        game: {
            type: 1,
            name: presence.presenceRotator(),
        }
    });
}

// rotates the bots presence every 3 minutes
setInterval( function setPresence(){
    var presenceVar = presence.presenceRotator();
    bot.setPresence({
        game: {
            type: 1,
            name: presenceVar,
        }
    });
}, 180000);

// When chat messages are received
bot.on("message", function (user, userID, channelID, message, rawEvent)
{
    //split the command on each space and put it into an array
    var parameters = message.split(" ");

    //puts all the info about the server the bot is in into a variable
    var shortHand = bot.servers[bot.channels[channelID].guild_id];

    if (parameters[0] == "pubg"){
        var playerName = parameters[1]; // store the command for cleaner code/reading
        lastMatch.lastMatch(bot, axios, APIkey, channelID, playerName);
    }
    else if(parameters[0] == "inspect"){
        var playerName = parameters[1];
        inspectGame.inspectGame(bot, axios, APIkey, channelID, playerName);
    }
    else if(parameters[0] == "KD"){
        var playerName = parameters[1];
        inspectKD.inspectKD(bot, axios, APIkey, channelID, playerName);
    }
    else if(parameters[0] == "custom"){
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
    }
    else if(parameters[0] == "season"){
            if(parameters[1] == "solo"){
                var gameMode = parameters[1];
                var playerName = parameters[2];
                seasonStats.seasonStats(bot, axios, APIkey, channelID, playerName, currentSeason, gameMode);
            }
            else if(parameters[1] == "duo"){
                var gameMode = parameters[1];
                var playerName = parameters[2];
                seasonStats.seasonStats(bot, axios, APIkey, channelID, playerName, currentSeason, gameMode);
            }
            else if(parameters[1] == "squad"){
                var gameMode = parameters[1];
                var playerName = parameters[2];
                seasonStats.seasonStats(bot, axios, APIkey, channelID, playerName, currentSeason, gameMode);
        }
    }
    else if (parameters[0] == "drop"){
        var mapName = parameters[1];
        dropZone.dropZone(bot, channelID, mapName);
    }
    else if(parameters[0] == "captain"){
        chooseCaptain.chooseCaptain(bot, channelID, userID);
    }
    else if (parameters[0] == "redvine" && parameters[1] == "help"){
        help.help(bot, channelID);
    }
});

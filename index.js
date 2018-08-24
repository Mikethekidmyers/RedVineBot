// https://izy521.github.io/discord.io-docs/Discord.Client.html#editChannelInfo

var config = require('./config.js');

const clientId = config.clientId;
const clientSecret = config.clientSecret;
const botUsername = config.botUsername;
const botToken = config.botToken;
const APIkey = config.APIkey;

const Discord = require('discord.io');
const axios = require('axios');
const greetUser = require('./components/greetUser.js');
const switchCase = require('./components/getEmoji.js');
const presence = require('./components/botPresence.js');
const gameCase = require('./components/gameMode.js');

var lastSeason = "test";

//https://izy521.gitbooks.io/discord-io/content/Client.html
const bot = new Discord.Client({
    token: botToken, // Used for bot login
    autorun: true, // Connect immediately
});

let greeting = greetUser.greetUser();

// Events
//https://izy521.gitbooks.io/discord-io/content/Events/Client.html

// When the bot starts
bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
    initialPresence();
    getSeasons();
    bot.sendMessage({
        to: greeting.helloChannel,
        message: greeting.greetMessage,
    });
});

function getSeasons(){
    var self = this;

    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/seasons`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

        var seasonArray = res.data.data;

        lastSeason = res.data.data[seasonArray.length -1].id;
    })
    .catch(error =>{
        console.log('2', error);
    })
}

// dc handler

bot.on('disconnect', (errMsg, code) => {
    if(errMsg) console.log(errMsg, code)
    bot.connect();
});
// bot is the discord.Client instance

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
    //http://www.w3schools.com/jsref/jsref_substring.asp
    if (message.substring(0, 4) == "pubg"){
        var playerName = message.substring(5); // store the command for cleaner code/reading

        lastMatch(channelID, playerName);
    } else if(message.substring(0, 7) == "inspect"){
        var playerName = message.substring(8);

        inspectGame(channelID, playerName);
    } else if(message.substring(0, 2) == "KD"){
        var playerName = message.substring(3);

        inspectKD(channelID, playerName);
    } else if(message.substring(0, 6) == "custom"){
        if(message.substring(7, 9) == "id"){

            var playerName = message.substring(10);
            var returnID = true;
            lastCustom(channelID, playerName, returnID);

        } else {

            var playerName = message.substring(7);
            var returnID = false;
            lastCustom(channelID, playerName, returnID);

        }
    } else if(message.substring(0, 6) == "season"){
            if(message.substring(7, 11) == "solo"){
                var gameMode = message.substring(7, 11);
                var playerName = message.substring(12);
                seasonStats(channelID, playerName, gameMode);

            } else if(message.substring(7,10) == "duo"){
                var gameMode = message.substring(7, 10);
                var playerName = message.substring(11);
                seasonStats(channelID, playerName, gameMode);

            } else if(message.substring(7, 12) == "squad"){
                var gameMode = message.substring(7, 12);
                var playerName = message.substring(13);
                seasonStats(channelID, playerName, gameMode);

        }
    } else if (message.substring(0, 4) == "drop"){
        var mapName = message.substring(5);

        dropZone(channelID, mapName);
    } else if (message.substring(0, 4) == "help"){

        bot.sendMessage({
            to: channelID,
            embed: {
                title: `Redvine Bot Commands:` ,
                description: 'Swap the value of $value with a corresponding name to get the described response.',
                fields: [
                    {
                        name: `pubg $value`,
                        value: `Write the ingame name of a player to get a small summary of their last game`,
                        inline: true,
                    },
                    {
                        name: `inspect $value`,
                        value: `Write the ingame name of a player to get a detailed summary of their last game`,
                        inline: true,
                    },
                    {
                        name: `drop $value`,
                        value: `Write a map name to get a random place to drop`,
                        inline: true,
                    },
                    {
                        name: `custom $value`,
                        value: `Write the name of a player to get a detailed match summary of his or hers last custom game.`,
                        inline: true,
                    },
                    {
                        name: 'custom id $value',
                        value: 'Write the name of a player to get the match id for his or hers last custom game.',
                        inline: true,
                    },
                    {
                        name: 'season $gamemode $value',
                        value: 'Write the gamemode you want to see, and name of a player to get a detailed view of their season this far. Example: season duo MikeMyers',
                        inline: true,
                    }
                ],
                footer: {
                    text: '',
                },
            }
        });
    }

});

function dropZone(channelID, mapName){
    var phraseArray = ["We're heading to ", "We're going to ", "It's hot drop time in ", "It's been a long time since we were in ", "", "Ready, set, ", "Oh how I've missed you ", "Fuck me I hate landing in ", "Let's drop in "];
    var landingPhrase = phraseArray[Math.floor(Math.random() * phraseArray.length)];

    switch(mapName){

        case "miramar":
        case "Miramar":
            var miramarArray = ['Alcantara', 'La Cobreria', 'Water Treatment', 'Torre Ahumada', 'Campo Militar', 'Tierra Bronca', 'Cruz Del Valle', 'El Azahar', 'Hacienda del Patron', 'San Martin', 'El Pozo', 'Monte Nuevo', 'Power Grid', 'Graveyard', 'Minas Generales', 'Junkyard', 'Impala', 'La Bendita', 'Pecado', 'Ladrillera', 'Chumacera', 'Los Leones', 'Puerto Paraiso', 'Los Higos', 'Valle del Mar', 'Prison', 'Minas del sur', 'Crater Fields'];
            var rand = miramarArray[Math.floor(Math.random() * miramarArray.length)];
            bot.sendMessage({
                to: channelID,
                message: `${landingPhrase} ${rand}`,
                tts: true,
            })
        break;

        case "erangel":
        case "Erangel":
            var erangelArray = ['Zharki', 'Shooting Range', 'Severny', 'Stalber', 'Yasnaya Polyana', 'Kameshki', 'Mansion', 'Lipovka', 'Prison', 'Shelter', 'School', 'Mylta Power', 'Rozhok', 'Ruins', 'Mylta', 'Farm', 'Novorepnoye', 'Military Factory', 'Military Police station', 'Military Barracks', 'Military Radio Station', 'Ferry Pier', 'Primorsk', 'Quarry', 'Gatka', 'North Georgopol', 'South Georgopol', 'Pochinki', 'Water Town'];
            var rand = erangelArray[Math.floor(Math.random() * erangelArray.length)];
            bot.sendMessage({
                to: channelID,
                message: `${landingPhrase} ${rand}`,
                tts: true,
            })
        break;

        case "sanhok":
        case "Sanhok":
            var sanhokArray = ['Camp Alpha', 'Ha Tinh', 'Tat Mok', 'Khao', 'Mongnai', 'Paradise Resort', 'Camp Bravo', 'Ruins', 'Bootcamp', 'Lakawi', 'Kampong', 'Quarry', 'Camp Charlie', 'Ban Tai', 'Docks', 'Sahmee', 'Na Kham', 'Tambang', 'Pai Nan', 'Bhan'];
            var rand = sanhokArray[Math.floor(Math.random() * sanhokArray.length)];
            bot.sendMessage({
                to: channelID,
                message: `${landingPhrase} ${rand}`,
                tts: true,
            })
        break;

        default:
        bot.sendMessage({
            to: channelID,
            message: `Looks like we got a typo in here somewhere`,
        })
        break;
    }
}

// get season stats
function seasonStats(channelID, playerName, gameMode){

    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=${playerName}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

    const accountID = res.data.data[0].id;

    getPlayerSeason(channelID, playerName, accountID, gameMode);

    })
    .catch(error =>{
        console.log('1', error);
    })
}

function getPlayerSeason(channelID, playerName, accountID, gameMode){

    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/players/${accountID}/seasons/${lastSeason}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {
        switch(gameMode){
        case "solo":
        var season = res.data.data.attributes.gameModeStats['solo-fpp']
        break;

        case "duo":
        var season = res.data.data.attributes.gameModeStats['duo-fpp']
        break;

        case "squad":
        var season = res.data.data.attributes.gameModeStats['squad-fpp']
        break;

        default:
        var season = res.data.data.attributes.gameModeStats['squad-fpp']
        break;
        }

        var kills = season.kills;
        var assists = season.assists;
        var daysPlayed = season.days;
        var headShots = season.headshotKills;
        var longestKill = Math.round(season.longestKill * 100) / 100;
        var timeSurvived = season.timeSurvived;
        var wins = season.wins;
        var rounds = season.roundsPlayed;
        var kdRatio = Math.round(kills / rounds * 100) / 100;
        var avgSeconds = Math.round(timeSurvived / rounds * 100) / 100;
        var avgMinutes = Math.round(avgSeconds / 60 * 100) / 100;
        var hoursPlayed = Math.round(timeSurvived / 60 / 60 * 10)/10;
        var damageDealt = season.damageDealt;
        var avgDamage = Math.round(damageDealt / rounds);
        var suicides = season.suicides;
        var teamKills = season.teamKills;
        var topTen = season.top10s;


        // avg distance
        var distanceTraveled = season.rideDistance + season.walkDistance;

        var avgDistance = Math.round(distanceTraveled / rounds)/1000;

        // time survived
        var avgTimeSurvived = timeSurvived / rounds;
        var minutes = Math.floor(avgTimeSurvived / 60);
        var seconds = Math.round(avgTimeSurvived - minutes * 60);

        //winrate calc
        var winRate = wins / rounds * 100;
        var winPercent = Math.round(winRate);

        //one kill per... calculation
        var avgTimePerKill = timeSurvived / kills;
        var killMinutes = Math.floor(avgTimePerKill / 60);
        var killSeconds = Math.round(avgTimePerKill - killMinutes * 60);

        bot.sendMessage({
        to: channelID,
        embed: {
            title: `Detailed season stats for ${playerName}.`,
            description: `${playerName} has played at least one ${gameMode} game, ${daysPlayed} days this season, and has an impressive ${hoursPlayed} hours spread across those days.`,
            fields:[
                {
                    name: "Kills:",
                    value: `${kills}`,
                    inline: true,
                },
                {
                    name: "Assists: ",
                    value: `${assists}`,
                    inline: true,
                },
                {
                    name: "Headshots: ",
                    value: `${headShots}`,
                    inline: true,
                },
                {
                    name: "Longest Kill: ",
                    value: `${longestKill}m`,
                    inline: true,
                },
                {
                    name: "Season K/D Ratio: ",
                    value: `${kdRatio}`,
                    inline: true,
                },
                {
                    name: "Win Rate: ",
                    value: `${winPercent}%`,
                    inline: true,
                },
                {
                    name: "Games Played: ",
                    value: `${rounds}`,
                    inline: true,
                },
                {
                    name: "Wins: ",
                    value: `${wins}`,
                    inline: true,
                },
                {
                    name: "Top 10: ",
                    value: `${topTen}`,
                    inline: true,
                },
                {
                    name: "Average Time Survived:",
                    value: `${minutes}m ${seconds}s`,
                    inline: true,
                },
                {
                    name: "Average Damage Dealt: ",
                    value: `${avgDamage}`,
                    inline: true,
                },
                {
                    name: "Average Distance Traveled",
                    value: `${avgDistance} km`,
                    inline: true,
                },
            ],
            footer: {
                text: `With ${kills} kills across ${rounds} games in ${hoursPlayed} hours, ${playerName} can be expected to kill a player once every ${killMinutes} m ${killSeconds} s.`,
            },
          }
      });


    })
    .catch(error =>{
        console.log('3', error);
        bot.sendMessage({
            to: channelID,
            message: 'Oops, looks like something went wrong, please try again',
        });
    })
}
// get last 20 games KD

function inspectKD(channelID, playerName){
    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=${playerName}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

        // Find match ID
        const attributes = res.data.data[0].relationships.matches.data;

        // const latestMatchID = res.data.data[0].relationships.matches.data[0].id;


        // Limit Match ID array to return 20
        if(attributes.length >= 20){
            var twentyAttr = attributes.slice(0, 20);
        } else if (attributes.length <= 20){
            var twentyAttr = attributes;
        };

        var idArray = [];

        var j = 0;

        for(var i = 0; i < twentyAttr.length; i++){
            idArray.push(twentyAttr[j].id);
            var latestMatchID = twentyAttr[j].id;
            getKD(latestMatchID, playerName);
            j += 1;
        };
    })
    .catch(error =>{
        console.log('4', error);
        bot.sendMessage({
            to: channelID,
            message: 'Oops, looks like something went wrong, please try again',
        });
    })
}

// get KD

function getKD(latestMatchID, playerName, channelID){
    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/matches/${latestMatchID}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

        var self = this;
        var placement = "";
        var damageDealt = "";
        var kills = "";

        res.data.included.forEach(function(player){
            if(player.type == 'participant'){
                var name = player.attributes.stats.name;
                var playerId = player.id;

                if(name == playerName){
                    var placement = player.attributes.stats.winPlace;
                    var damageDealt = player.attributes.stats.damageDealt;
                    var kills = player.attributes.stats.kills;
                    self.damageDealt = Math.floor(damageDealt);
                    self.kills = kills;
                    console.log(kills + " kills", "#" + placement, "Damage Dealt: " + self.damageDealt);
                }
            }
        });
    })
    .catch(error =>{
        console.log('5', error);
        bot.sendMessage({
            to: channelID,
            message: 'Oops, looks like something went wrong, please try again',
        });
    })
}

// get last match stats

function lastMatch(channelID, playerName){
    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=${playerName}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

        const latestMatchID = res.data.data[0].relationships.matches.data[0].id;

        getMatchData(latestMatchID, playerName, channelID);

    })
    .catch(error =>{
        console.log('6', error);
        bot.sendMessage({
            to: channelID,
            message: 'Oops, looks like something went wrong, please try again',
        });
    })
}

function getMatchData(latestMatchID, playerName, channelID){
    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/matches/${latestMatchID}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

        var statMessage = "";
        var self = this;

        res.data.included.forEach(function(player){
            if(player.type == 'participant'){
                var placement = player.attributes.stats.winPlace;
                var name = player.attributes.stats.name;
                var playerId = player.id;
                var knocks = player.attributes.stats.DBNOs;
                var assists = player.attributes.stats.assists;
                var boosts = player.attributes.stats.boosts;
                var damageDealt = player.attributes.stats.damageDealt;
                var kills = player.attributes.stats.kills;
                var longestKill = player.attributes.stats.longestKill;
                var headShots = player.attributes.stats.headshotKills;

                //time calc

                var timeSurvived = player.attributes.stats.timeSurvived;
                var minutes = Math.floor(timeSurvived / 60);
                var seconds = Math.round(timeSurvived - minutes * 60);

                if(name == playerName){
                    if(headShots == 0){
                        self.statMessage = playerName + " placed as #" + placement + " last game. He survived for " + minutes + "m" + seconds + "s and killed " + kills + " players.";
                    } else {
                        self.statMessage = playerName + " placed as #" + placement + " last game. He survived for " + minutes + "m" + seconds + "s and killed " + kills + " players, " + headShots + " of which were headshots.";
                    }
                }
            }
        });

        bot.sendMessage({
        to: channelID,
        message: `${self.statMessage}`,
        });

    })
    .catch(error =>{
        console.log('7', error);
        bot.sendMessage({
            to: channelID,
            message: 'Oops, looks like something went wrong, please try again',
        });
    })

}

function inspectGame(channelID, playerName){
    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=${playerName}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

        const latestMatchID = res.data.data[0].relationships.matches.data[0].id;

        getDetailedMatchData(latestMatchID, playerName, channelID);

    })
    .catch(error =>{
        console.log('8', error);
        bot.sendMessage({
            to: channelID,
            message: 'Oops, looks like something went wrong, please try again',
        });
    })
}

function getDetailedMatchData(latestMatchID, playerName, channelID){
    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/matches/${latestMatchID}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

        var self = this;
        var placement = "";
        var knocks = "";
        var assists = "";
        var damageDealt = "";
        var kills = "";
        var longestKill = "";
        var headShots = "";
        var minutes = "";
        var seconds = "";
        var travelDistance = "";
        var descriptionEmoji = "";
        var matchData = res.data.data.attributes;
        var gameMode = res.data.data.attributes.gameMode;

        res.data.included.forEach(function(player){
            if(player.type == 'participant'){
                var name = player.attributes.stats.name;
                var playerId = player.id;


                //time calc

                var timeSurvived = player.attributes.stats.timeSurvived;
                var minutes = Math.floor(timeSurvived / 60);
                var seconds = Math.round(timeSurvived - minutes * 60);

                if(name == playerName){
                    var placement = player.attributes.stats.winPlace;
                    var knocks = player.attributes.stats.DBNOs;
                    var assists = player.attributes.stats.assists;
                    var damageDealt = player.attributes.stats.damageDealt;
                    var kills = player.attributes.stats.kills;
                    var longestKill = player.attributes.stats.longestKill;
                    var headShots = player.attributes.stats.headshotKills;
                    var walkDistance = player.attributes.stats.walkDistance;
                    var rideDistance = player.attributes.stats.rideDistance;
                    var swimDistance = player.attributes.stats.swimDistance;
                    var travelDistance = swimDistance + rideDistance + walkDistance;

                    self.travelDistance = Math.round((travelDistance*100)/1000) /100;
                    self.placement = "#" + placement;
                        if(placement == 1){ self.placement = ':trophy:';}
                        else if(placement >= 25){ self.placement = "#" + placement + ":shit:";}
                    self.knocks = knocks;
                    self.assists = assists;
                    self.damageDealt = Math.floor(damageDealt);
                    self.kills = kills;
                    self.longestKill = Math.floor(longestKill);
                    self.headShots = headShots;
                    self.minutes = minutes;
                    self.seconds = seconds;
                }
            }
        });

    var caseVar = self.kills

    var descriptionEmoji = switchCase.getEmoji(caseVar);

    var gameVar = gameMode;

    gameMode = gameCase.translateGameMode(gameVar);

        bot.sendMessage({
        to: channelID,
        embed: {
            title: `Detailed stats for the previous game of ${playerName}.`,
            description: `Performance rating: ${descriptionEmoji}`,
            fields:[
                {
                    name: "Placement:",
                    value: `${self.placement}`,
                    inline: true,
                },
                {
                    name: "Time Survived:",
                    value: `${self.minutes}m ${self.seconds}s`,
                    inline: true,
                },
                {
                    name: "Distance Traveled: ",
                    value: `${self.travelDistance}km`,
                    inline: true,
                },
                {
                    name: "Kills: ",
                    value: `${self.kills}`,
                    inline: true,
                },
                {
                    name: "DBNOs: ",
                    value: `${self.knocks}`,
                    inline: true,
                },
                {
                    name: "Assists: ",
                    value: `${self.assists}`,
                    inline: true,
                },
                {
                    name: "Damage dealt: ",
                    value: `${self.damageDealt}`,
                    inline: true,
                },
                {
                    name: "Headshots: ",
                    value: `${self.headShots}`,
                    inline: true,
                },
                {
                    name: "Longest Kill: ",
                    value: `${self.longestKill}m`,
                    inline: true,
                },
            ],
            footer: {
                text: `Gamemode: ${gameMode} `,
            },
          }
      });
})
.catch(error =>{
    console.log('9', error);
    bot.sendMessage({
        to: channelID,
        message: 'Oops, looks like something went wrong, please try again',
    });
})

}


function lastCustom(channelID, playerName, returnID){
    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/players?filter[playerNames]=${playerName}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

        const latestMatchID = res.data.data[0].relationships.matches.data[0].id;

        if(!returnID){
            getDetailedCustomMatchData(latestMatchID, playerName, channelID);
            console.log("getDetailedMatchData");
        } else if(returnID){
            getLastCustomMatch(latestMatchID, playerName, channelID);
            console.log("getLastCustomMatch");
        }

    })
    .catch(error =>{
        console.log('10', error);
        bot.sendMessage({
            to: channelID,
            message: 'Oops, looks like something went wrong, please try again',
        });
    })
}

function getDetailedCustomMatchData(latestMatchID, playerName, channelID){
    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/matches/${latestMatchID}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {

        var self = this;
        var placement = "";
        var knocks = "";
        var assists = "";
        var damageDealt = "";
        var kills = "";
        var longestKill = "";
        var headShots = "";
        var minutes = "";
        var seconds = "";
        var travelDistance = "";
        var descriptionEmoji = "";
        var matchData = res.data.data.attributes;
        var gameMode = res.data.data.attributes.gameMode;
        var isCustomMatch = res.data.data.attributes.isCustomMatch;

        res.data.included.forEach(function(player){
            if(player.type == 'participant'){
                var name = player.attributes.stats.name;
                var playerId = player.id;

                //time calc

                var timeSurvived = player.attributes.stats.timeSurvived;
                var minutes = Math.floor(timeSurvived / 60);
                var seconds = Math.round(timeSurvived - minutes * 60);

                if(name == playerName){
                    var placement = player.attributes.stats.winPlace;
                    var knocks = player.attributes.stats.DBNOs;
                    var assists = player.attributes.stats.assists;
                    var damageDealt = player.attributes.stats.damageDealt;
                    var kills = player.attributes.stats.kills;
                    var longestKill = player.attributes.stats.longestKill;
                    var headShots = player.attributes.stats.headshotKills;
                    var walkDistance = player.attributes.stats.walkDistance;
                    var rideDistance = player.attributes.stats.rideDistance;
                    var swimDistance = player.attributes.stats.swimDistance;
                    var travelDistance = swimDistance + rideDistance + walkDistance;

                    self.travelDistance = Math.round((travelDistance*100)/1000) /100;
                    self.placement = "#" + placement;
                        if(placement == 1){ self.placement = ':trophy:';}
                        else if(placement >= 25){ self.placement = "#" + placement + ":shit:";}
                    self.knocks = knocks;
                    self.assists = assists;
                    self.damageDealt = Math.floor(damageDealt);
                    self.kills = kills;
                    self.longestKill = Math.floor(longestKill);
                    self.headShots = headShots;
                    self.minutes = minutes;
                    self.seconds = seconds;
                }
            }
        });

    var caseVar = self.kills

    var descriptionEmoji = switchCase.getEmoji(caseVar);

    var gameVar = gameMode;

    gameMode = gameCase.translateGameMode(gameVar);

    if(isCustomMatch){
        bot.sendMessage({
        to: channelID,
        embed: {
            title: `Detailed stats for the previous game of ${playerName}.`,
            description: `${playerName}s performance rating: ${descriptionEmoji}`,
            fields:[
                {
                    name: "Placement:",
                    value: `${self.placement}`,
                    inline: true,
                },
                {
                    name: "Time Survived:",
                    value: `${self.minutes}m ${self.seconds}s`,
                    inline: true,
                },
                {
                    name: "Distance Traveled: ",
                    value: `${self.travelDistance}km`,
                    inline: true,
                },
                {
                    name: "Kills: ",
                    value: `${self.kills}`,
                    inline: true,
                },
                {
                    name: "DBNOs: ",
                    value: `${self.knocks}`,
                    inline: true,
                },
                {
                    name: "Assists: ",
                    value: `${self.assists}`,
                    inline: true,
                },
                {
                    name: "Damage dealt: ",
                    value: `${self.damageDealt}`,
                    inline: true,
                },
                {
                    name: "Headshots: ",
                    value: `${self.headShots}`,
                    inline: true,
                },
                {
                    name: "Longest Kill: ",
                    value: `${self.longestKill}m`,
                    inline: true,
                },
            ],
            footer: {
                text: `Gamemode: ${gameMode} `,
            },
          }
      });
  } else {
    bot.sendMessage({
    to: channelID,
    message: 'Sorry, looks like your last game was not a custom game.',
    });
  }
})
.catch(error =>{
    console.log('11', error);
    bot.sendMessage({
        to: channelID,
        message: 'Oops, looks like something went wrong, please try again',
    });
})
}



function getLastCustomMatch(latestMatchID, playerName, channelID){
        axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/matches/${latestMatchID}`, {
            timeout: 3000,
            headers: {
            'Authorization': APIkey,
            'Accept' : 'application/vnd.api+json'
        },
            responseEncoding: 'json',
        })

        .then(res => {
            var matchData = res.data.data.attributes;
            var gameMode = res.data.data.attributes.gameMode;
            var isCustomMatch = res.data.data.attributes.isCustomMatch;

        if(isCustomMatch){
            bot.sendMessage({
                to: channelID,
                message: `${playerName} just played a custom match with the ID of: ${latestMatchID} .`,
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: `Looks like ${playerName} has not played a custom match recently. :cold_sweat:`,
            });
        }
    })
    .catch(error =>{
        console.log('getLastCustomMatch', error);
    })
}

function teamRoster(channelID, playerName){
    //work in progress
}
// end of file

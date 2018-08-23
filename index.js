// https://izy521.github.io/discord.io-docs/Discord.Client.html#editChannelInfo

var config = require('./config.js');

const clientId = config.clientId;
const clientSecret = config.clientSecret;
const botUsername = config.botUsername;
const botToken = config.botToken;
const APIkey = config.APIkey;

const Discord = require('discord.io');
const axios = require('axios');

var lastSeason = "test";

//https://izy521.gitbooks.io/discord-io/content/Client.html
const bot = new Discord.Client({
    token: botToken, // Used for bot login
    autorun: true, // Connect immediately
});

// Events
//https://izy521.gitbooks.io/discord-io/content/Events/Client.html

// When the bot starts
bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
    greetUser();
    initialPresence();
    getSeasons();
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
            type: 3,
            name: "a cooking show",
        }
    });
}

setInterval(function presenceRotator(){

    var presenceVar = "";
    var typeVar = "";

    switch (Math.floor(Math.random() * 7)) {
        case 0:
        presenceVar = "PUBG"
        typeVar = 3
        break;

        case 2:
        presenceVar = "your mom shower"
        typeVar = 3
        break;

        case 3:
        presenceVar = "Porn"
        typeVar = 3
        break;

        case 4:
        presenceVar = "with fire"
        typeVar = 1
        break;

        case 5:
        presenceVar = "Pornhub VR Xtreme"
        typeVar = 1
        break;

        case 6:
        presenceVar = "Pornhub VR Anime Edition"
        typeVar = "3"
        break;

        case 7:
        presenceVar = "The adventures of Redvine"
        typevar = "2"
        break;

    }

    bot.setPresence({
        game: {
            type: typeVar,
            name: presenceVar,
        }
    });
}, 300000);



// Random logon message
function greetUser(){

    var botDev = "466199217199775754";

    var helloChannel = botDev;

    switch (Math.floor(Math.random() * 5)) {

    case 0:
        bot.sendMessage({
            to: helloChannel,
            message:'Me not that kind of orc',
        })
        break;
    case 1:
        bot.sendMessage({
            to: helloChannel,
            message:'Zug Zug',
        })
        break;
    case 2:
        bot.sendMessage({
            to: helloChannel,
            message:'Work Work',
        })
        break;

    case 3:
        bot.sendMessage({
            to: helloChannel,
            message:'Something need doing?',
        })
        break;
    case 4:
        bot.sendMessage({
            to: helloChannel,
            message:'Yes?',
        })
        break;

    }
}

// When chat messages are received
bot.on("message", function (user, userID, channelID, message, rawEvent)
{
    //http://www.w3schools.com/jsref/jsref_substring.asp
    if (message.substring(0, 1) == "!") // if message starts with "!"
    {
        var command = message.substring(1); // store the command for cleaner code/reading

        switch(command){
            //https://izy521.gitbooks.io/discord-io/content/Methods/Channels.html
            case "hi":
            bot.sendMessage({
                to: userID,
                message: "Me not that kind of orc!"
            })
            break;

            case "help":
            bot.sendMessage({
                to: channelID,
                embed: {
                    title: `Redvine Bot Commands:` ,
                    fields: [
                        {
                            name: `pubg PLAYERNAME`,
                            value: `swap PLAYERNAME with your ingame name to get a small summary of your last game`,
                            inline: true,
                        },
                        {
                            name: `inspect PLAYERNAME`,
                            value: `swap PLAYERNAME with your ingame name to get a detailed summary of your last game`,
                            inline: true,
                        },
                        {
                            name: `drop MAPNAME`,
                            value: `swap MAPNAME with a map name to get a random place to drop`,
                            inline: true,
                        },
                    ],
                    footer: {
                        text: '',
                    },
                }
            })
            break;
        }
    } else if (message.substring(0, 4) == "pubg"){
        var playerName = message.substring(5); // store the command for cleaner code/reading

        lastMatch(channelID, playerName);
    } else if(message.substring(0, 7) == "inspect"){
        var playerName = message.substring(8);

        inspectGame(channelID, playerName);
    } else if(message.substring(0, 2) == "KD"){
        var playerName = message.substring(3);

        inspectKD(channelID, playerName);
    } else if(message.substring(0, 6) == "custom"){
        var playerName = message.substring(7);

        lastCustom(channelID, playerName);
    } else if(message.substring(0, 6) == "season"){
        var playerName = message.substring(7);

        seasonStats(channelID, playerName);
    } else if (message.substring(0, 4) == "drop"){
        var mapName = message.substring(5);

        dropZone(channelID, mapName);
    } else if (message.substring(0, 4) == "help"){

        bot.sendMessage({
            to: channelID,
            embed: {
                title: `Redvine Bot Commands:` ,
                fields: [
                    {
                        name: `pubg PLAYERNAME`,
                        value: `swap PLAYERNAME with your ingame name to get a small summary of your last game`,
                        inline: true,
                    },
                    {
                        name: `inspect PLAYERNAME`,
                        value: `swap PLAYERNAME with your ingame name to get a detailed summary of your last game`,
                        inline: true,
                    },
                    {
                        name: `drop MAPNAME`,
                        value: `swap MAPNAME with a map name to get a random place to drop`,
                        inline: true,
                    },
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
function seasonStats(channelID, playerName){

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

    getPlayerSquadSeason(channelID, playerName, accountID);

    })
    .catch(error =>{
        console.log('1', error);
    })
}

function getPlayerSquadSeason(channelID, playerName, accountID){

    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/players/${accountID}/seasons/${lastSeason}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {
        // console.log(res.data.data.attributes.gameModeStats['squad-fpp']);
        var squadSeason = res.data.data.attributes.gameModeStats['squad-fpp'];

        var kills = squadSeason.kills;
        var assists = squadSeason.assists;
        var daysPlayed = squadSeason.days;
        var headShots = squadSeason.headshotKills;
        var longestKill = Math.round(squadSeason.longestKill * 100) / 100;
        var timeSurvived = squadSeason.timeSurvived;
        var wins = squadSeason.wins;
        var rounds = squadSeason.roundsPlayed;
        var kdRatio = Math.round(kills / rounds * 100) / 100;
        var avgSeconds = Math.round(timeSurvived / rounds * 100) / 100;
        var avgMinutes = Math.round(avgSeconds / 60 * 100) / 100;
        var hoursPlayed = Math.round(timeSurvived / 60 / 60 * 10)/10;
        var damageDealt = squadSeason.damageDealt;
        var avgDamage = Math.round(damageDealt / rounds);
        var suicides = squadSeason.suicides;
        var teamKills = squadSeason.teamKills;
        var topTen = squadSeason.top10s;


        // avg distance
        var distanceTraveled = squadSeason.rideDistance + squadSeason.walkDistance;

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
            description: `${playerName} has played at least one squad-game ${daysPlayed} days this season, and has an impressive ${hoursPlayed} hours spread across those days.`,
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
                    // self.placement = "#" + placement;
                    //     if(placement == 1){ self.placement = ':trophy:';}
                    //     else if(placement >= 25){ self.placement = "#" + placement + ":shit:";}
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

    switch(self.kills){

        case 0:
        descriptionEmoji = ":shit:"
        break;

        case 1:
        descriptionEmoji = ":facepalm:"
        break;

        case 2:
        case 3:
        descriptionEmoji = ":baby:"
        break;

        case 4:
        case 5:
        descriptionEmoji = ":older_woman:"
        break;

        case 6:
        descriptionEmoji = ":older_man:"
        break;

        case 7:
        descriptionEmoji = ":spy:"
        break;

        case 8:
        descriptionEmoji = ":skull:"
        break;

        default:
        descriptionEmoji = ":fire:"
        break;
    }

    switch(gameMode){
        case "squad-fpp":
        gameMode = "Squad"
        break;

        case "duo-fpp":
        gameMode = "Duo"
        break;

        case "solo-fpp":
        gameMode = "Solo"
        break;

        default:
        gameMode = gameMode
        break;
    }

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

function lastCustom(channelID, playerName){
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

        getDetailedCustomMatchData(latestMatchID, playerName, channelID);

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

    switch(self.kills){

        case 0:
        descriptionEmoji = ":shit:"
        break;

        case 1:
        descriptionEmoji = ":facepalm:"
        break;

        case 2:
        case 3:
        descriptionEmoji = ":baby:"
        break;

        case 4:
        case 5:
        descriptionEmoji = ":older_woman:"
        break;

        case 6:
        descriptionEmoji = ":older_man:"
        break;

        case 7:
        descriptionEmoji = ":spy:"
        break;

        case 8:
        descriptionEmoji = ":skull:"
        break;

        default:
        descriptionEmoji = ":fire:"
        break;
    }

    switch(gameMode){
        case "squad-fpp":
        gameMode = "Squad"
        break;

        case "duo-fpp":
        gameMode = "Duo"
        break;

        case "solo-fpp":
        gameMode = "Solo"
        break;

        default:
        gameMode = gameMode
        break;
    }

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

function teamRoster(channelID, playerName){

}
// end of file

const emojiPicker = require('../general/getEmoji.js');
const gameModeSwitch = require('./gameMode.js');

function getDetailedCustomMatchData(bot, axios, APIkey, latestMatchID, playerName, channelID){
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

    var descriptionEmoji = emojiPicker.getEmoji(caseVar);

    var gameVar = gameMode;

    gameMode = gameModeSwitch.translateGameMode(gameVar);

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

module.exports.getDetailedCustomMatchData = getDetailedCustomMatchData;

// this function is used by lastMatch.js

function getMatchData(bot, axios, APIkey, latestMatchID, playerName, channelID){
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

module.exports.getMatchData = getMatchData;

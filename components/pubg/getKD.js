// get KD

function getKD(bot, axios, APIkey, latestMatchID, playerName, channelID){
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

module.exports.getKD = getKD;

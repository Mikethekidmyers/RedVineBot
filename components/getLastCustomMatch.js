

function getLastCustomMatch(bot, axios, APIkey, latestMatchID, playerName, channelID){
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
        console.log(error);
    })
}

module.exports.getLastCustomMatch = getLastCustomMatch;

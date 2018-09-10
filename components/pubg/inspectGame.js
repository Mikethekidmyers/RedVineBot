const getDetailedMatchData = require('./getDetailedMatchData.js');

function inspectGame(bot, axios, APIkey, channelID, playerName){
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

        getDetailedMatchData.getDetailedMatchData(bot, axios, APIkey, latestMatchID, playerName, channelID);

    })
    .catch(error =>{
        console.log('8', error);
        bot.sendMessage({
            to: channelID,
            message: 'Oops, looks like something went wrong, please try again',
        });
    })
}

module.exports.inspectGame = inspectGame;

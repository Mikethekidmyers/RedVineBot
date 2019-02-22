const getPlayerSeason = require('./subcomponents/getPlayerSeason.js');

// get season stats

function seasonStats(bot, axios, APIkey, channelID, playerName, currentSeason, gameMode){

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

    getPlayerSeason.getPlayerSeason(bot, axios, APIkey, channelID, playerName, accountID, currentSeason, gameMode);

    })
    .catch(error =>{
        console.log('1', error);
    })
}

module.exports.seasonStats = seasonStats;

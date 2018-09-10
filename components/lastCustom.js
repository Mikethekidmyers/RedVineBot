const getDetailedCustomMatchData = require('./getDetailedCustomMatchData.js');
const getLastCustomMatch = require('./getLastCustomMatch.js');

function lastCustom(bot, axios, APIkey, channelID, playerName, returnID){
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
            getDetailedCustomMatchData.getDetailedCustomMatchData(bot, axios, APIkey, latestMatchID, playerName, channelID);
        } else if(returnID){
            getLastCustomMatch.getLastCustomMatch(bot, axios, APIkey, latestMatchID, playerName, channelID);
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

module.exports.lastCustom = lastCustom;

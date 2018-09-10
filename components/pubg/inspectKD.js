const getKD = require('./getKD');

function inspectKD(bot, axios, APIkey, channelID, playerName){
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
            getKD.getKD(bot, axios, APIkey, latestMatchID, playerName);
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

module.exports.inspectKD = inspectKD;

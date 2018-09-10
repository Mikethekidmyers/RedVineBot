function getSeasons(axios, APIkey){
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

        console.log(lastSeason);
    })
    .catch(error =>{
        console.log('getSeasons', error);
    })
}

module.exports.getSeasons = getSeasons;

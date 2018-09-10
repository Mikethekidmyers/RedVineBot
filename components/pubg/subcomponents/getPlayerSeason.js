function getPlayerSeason(bot, axios, APIkey, channelID, playerName, accountID, gameMode){

    axios.get(`https://api.playbattlegrounds.com/shards/pc-eu/players/${accountID}/seasons/${lastSeason}`, {
        timeout: 3000,
        headers: {
        'Authorization': APIkey,
        'Accept' : 'application/vnd.api+json'
    },
        responseEncoding: 'json',
    })

    .then(res => {
        switch(gameMode){
        case "solo":
        var season = res.data.data.attributes.gameModeStats['solo-fpp']
        break;

        case "duo":
        var season = res.data.data.attributes.gameModeStats['duo-fpp']
        break;

        case "squad":
        var season = res.data.data.attributes.gameModeStats['squad-fpp']
        break;

        default:
        var season = res.data.data.attributes.gameModeStats['squad-fpp']
        break;
        }

        var kills = season.kills;
        var assists = season.assists;
        var daysPlayed = season.days;
        var headShots = season.headshotKills;
        var longestKill = Math.round(season.longestKill * 100) / 100;
        var timeSurvived = season.timeSurvived;
        var wins = season.wins;
        var rounds = season.roundsPlayed;
        var deaths = season.losses;
        var kdRatio = Math.round(kills / deaths * 100) / 100;
        var avgSeconds = Math.round(timeSurvived / rounds * 100) / 100;
        var avgMinutes = Math.round(avgSeconds / 60 * 100) / 100;
        var hoursPlayed = Math.round(timeSurvived / 60 / 60 * 10)/10;
        var damageDealt = season.damageDealt;
        var avgDamage = Math.round(damageDealt / rounds);
        var suicides = season.suicides;
        var teamKills = season.teamKills;
        var topTen = season.top10s;

        // rating calc
        var winRating = season.winPoints;
        var killRating = season.killPoints;

        var overAllRating = Math.round(winRating + (killRating * 0.2));

        // avg distance
        var distanceTraveled = season.rideDistance + season.walkDistance;

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

        if(rounds > 0){
        bot.sendMessage({
        to: channelID,
        embed: {
            title: `Detailed season stats for ${playerName}.`,
            description: `${playerName} has played at least one ${gameMode} game ${daysPlayed} days this season, and has an impressive ${hoursPlayed} hours spread across those days.`,
            fields:[
                // In case the API gets support for #rank directly from the API
                // {
                //     name: "Player Rating:",
                //     value: `${overAllRating}`,
                // },
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
  } else {
      bot.sendMessage({
          to: channelID,
          message: `Looks like ${playerName} hasn't played any ${gameMode} games this season.`
      });
  }

    })
    .catch(error =>{
        console.log('3', error);
        bot.sendMessage({
            to: channelID,
            message: 'Oops, looks like something went wrong, please try again',
        });
    })
}

module.exports.getPlayerSeason = getPlayerSeason;

//banishes the user specified in the blackList variable
function banishPlayer(shortHand, userID){
    var afkChannel = JSON.stringify(shortHand.afk_channel_id);
    var serverID = JSON.stringify(shortHand.id);

    bot.moveUserTo({
        serverID: serverID,
        userID: userID,
        channelID: afkChannel,
    });
}

module.exports.banishPlayer = banishPlayer;

//chooses a random captain from the members currently in the voice channel

function chooseCaptain(bot, channelID, userID){
    // shortHand for accessing the server info
    var shortHand = bot.servers[bot.channels[channelID].guild_id];

    console.log(shortHand);
    //check if the user is in a voice channel
    if(shortHand.members[userID].voice_channel_id != undefined){
        // finds the voice channel the user who called the command is in
        var voiceChannelID = shortHand.members[userID].voice_channel_id;

        // finds the members of the voice channel
        var voiceMembers = shortHand.channels[voiceChannelID].members;

        // finds the name of the voice channel
        var voiceChannelName = shortHand.channels[voiceChannelID].name;

        let userIdArray = [];

        for(let memberID in shortHand.members){
            if (bot.users[memberID] != undefined){
                userIdArray.push(bot.users[memberID].id);
            }
        }

        let voiceMembersIdArray = [];

        for(let id in userIdArray){
            let y = userIdArray[id];
            let stringID = JSON.stringify(userIdArray[id]);

            if(voiceMembers[y] != undefined){
                if(userIdArray[id] == voiceMembers[y].user_id){
                    voiceMembersIdArray.push(voiceMembers[y].user_id);
                }
            }
        }

        let voiceMembersNickArray = [];

        for(let id in voiceMembersIdArray){
            for(let memberID in shortHand.members){
                if(bot.users[memberID] != undefined){
                    if(voiceMembersIdArray[id] == bot.users[memberID].id){
                        voiceMembersNickArray.push(bot.users[memberID].username);
                    }
                }
            }
        }

        let randomNumber = Math.floor(Math.random()*voiceMembersNickArray.length);

        bot.sendMessage({
            to: channelID,
            message: `The captain for this game is ${voiceMembersNickArray[randomNumber]}`,
            tts: true,
        });
    } else {
        bot.sendMessage({
            to: channelID,
            message: `Looks like you're not in a voice channel, join one and try again!`,
        });
    }
};

module.exports.chooseCaptain = chooseCaptain;

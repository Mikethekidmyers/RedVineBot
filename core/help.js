function help(bot, channelID){
    bot.sendMessage({
        to: channelID,
        embed: {
            title: `Redvine Bot Commands:` ,
            description: 'Swap the value of $value with a corresponding name to get the described response.',
            fields: [
                {
                    name: `pubg $value`,
                    value: `Write the ingame name of a player to get a small summary of their last game`,
                    inline: true,
                },
                {
                    name: `inspect $value`,
                    value: `Write the ingame name of a player to get a detailed summary of their last game`,
                    inline: true,
                },
                {
                    name: `drop $value`,
                    value: `Write a map name to get a random place to drop, if you're playing Miramar you can use additional commands like: north, center, west etc. at the end of the sentence`,
                    inline: true,
                },
                {
                    name: `custom $value`,
                    value: `Write the name of a player to get a detailed match summary of his or hers last custom game.`,
                    inline: true,
                },
                {
                    name: 'custom id $value',
                    value: 'Write the name of a player to get the match id for his or hers last custom game.',
                    inline: true,
                },
                {
                    name: 'season $gamemode $value',
                    value: 'Write the gamemode you want to see, and name of a player to get a detailed view of their season this far. Example: season duo MikeMyers',
                    inline: true,
                },
                {
                    name: 'captain',
                    value: 'Write captain to choose a random member from the voice channel to be your team captain',
                    inline: true,
                }
            ],
            footer: {
                text: '',
            },
        }
    });
}

module.exports.help = help;

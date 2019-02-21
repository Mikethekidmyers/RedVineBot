// handles audio and plays it in a voice channel

//local path
var path = '/Users/Thomas/desktop/sites/hobby/redvineapp';

// live path
// var path = '/app'

function audioHandler(jsBot, bot, userID, message){
    var voiceParam = message.substring(1);
    var playing = false;
    jsBot.on('message', message => {
        if(!message.guild) return;
        if(playing == true) return;
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
            if(voiceParam == "hi"){
                let audioGreeting = Math.floor((Math.random() * 3) + 1);
                switch (audioGreeting) {
                    case 1:
                        var voicePath = path + '/audiofiles/icandothat.mp3';
                        break;
                    case 2:
                        var voicePath = path + '/audiofiles/work-complete.mp3';
                        break;
                    case 3:
                        var voicePath = path + '/audiofiles/workwork.mp3';
                        break;
                    default:
                        return;
                }
            } else {
                switch (voiceParam){
                    case "yalla":
                    var voicePath = path + '/audiofiles/yalla.mp3';
                    break;

                    case "død":
                    var voicePath = path + '/audiofiles/alla.mp3';
                    break;

                    case "kaos":
                    var voicePath = path + '/audiofiles/kaos.ogg';
                    break;

                    case "seinfeld":
                    var voicePath = path + '/audiofiles/seinfeld.mp3';
                    break;

                    case "wow":
                    var voicePath = path + '/audiofiles/wow.mp3';
                    break;

                    case "xfiles":
                    var voicePath = path + '/audiofiles/xfiles.mp3';
                    break;

                    default:
                    var voicePath = path + 'audiofiles/xfiles.mp3';
                    break;
                }
            }

            playing = true;
            const dispatcher = connection.playFile(voicePath);

            if (voiceParam == "dc"){
                message.member.voiceChannel.leave();
            }

            dispatcher.on('end', () => {
                // The song has finished
                // find out why end event fires too many times and make it so that no sound files can be interrupted
                playing = false;
                console.log('Looks like the song has finished playing');
            });

            dispatcher.on('error', e => {
                  console.log(e);
            })

        })
        .catch(console.log);
    } else {
            if(bot.users[userID].bot == false) return;
            message.reply('You need to be in a voice channel for this to work..');
        }
    });
}

module.exports.audioHandler = audioHandler;

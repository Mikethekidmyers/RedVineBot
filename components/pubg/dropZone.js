//Function to find a drop zone

function dropZone(bot, channelID, mapName){
    var phraseArray = ["We're heading to ", "We're going to ", "It's hot drop time in ", "It's been a long time since we were in ", "", "Ready, set, ", "Oh how I've missed you ", "Fuck me I hate landing in ", "Let's drop in "];
    var landingPhrase = phraseArray[Math.floor(Math.random() * phraseArray.length)];

    switch(mapName){

        case "miramar":
        case "Miramar":
            var miramarArray = ['Alcantara', 'La Cobreria', 'Water Treatment', 'Torre Ahumada', 'Campo Militar', 'Tierra Bronca', 'Cruz Del Valle', 'El Azahar', 'Hacienda del Patron', 'San Martin', 'El Pozo', 'Monte Nuevo', 'Power Grid', 'Graveyard', 'Minas Generales', 'Junkyard', 'Impala', 'La Bendita', 'Pecado', 'Ladrillera', 'Chumacera', 'Los Leones', 'Puerto Paraiso', 'Los Higos', 'Valle del Mar', 'Prison', 'Minas del sur', 'Crater Fields'];
            var rand = miramarArray[Math.floor(Math.random() * miramarArray.length)];
        break;

        case "miramar south":
        case "Miramar south":
            var miramarSouthArray = ['Prison', 'Minas Del Sur', 'Valle Del Mar', 'Puerto Paraiso', 'Chumacera', 'Los Leones', 'Los Higos'];
            var rand = miramarSouthArray[Math.floor(Math.random() * miramarSouthArray.length)];
        break;

        case "miramar north":
        case "Miramar north":
            var miramarNorthArray = ['Alcantara', 'La Cobreria', 'Crater Fields', 'Trailer Park', 'Torre Ahumada', 'Water Treatment', 'Cruz Del Valle', 'Tierra Bronca', 'Campo Militar'];
            var rand = miramarNorthArray[Math.floor(Math.random() * miramarNorthArray.length)];
        break;

        case "miramar east":
        case "Miramar east":
            var miramarEastArray = ['Torre Ahumada', 'Campo Militar', 'Tierra Bronca', 'Cruz Del Valle', 'El Azahar', 'Junkyard', 'Minar Generales', 'Impala', 'La Bendita', 'Puerto Paraiso', 'Los Leones', 'Islands east of Impala'];
            var rand = miramarEastArray[Math.floor(Math.random() * miramarEastArray.length)];
        break;

        case "miramar west":
        case "Miramar west":
            var miramarWestArray = ['Prison', 'Minas Del Sur', 'Valle Del Mar', 'Los Higos', 'Chumacera', 'Ladrillera', 'Monte Nuevo', 'El Pozo', 'Trailer Park', 'Alcantara', 'La Cobreria', 'Crater Fields'];
            var rand = miramarWestArray[Math.floor(Math.random() * miramarWestArray.length)];
        break;

        case "miramar center":
        case "Miramar center":
            var miramarCenterArray = ['La Cobreria', 'Water Treatment', 'San Martin', 'Hacienda Del Patron', 'Cruz Del Valle', 'Power Grid', 'Graveyard', 'Pecado', 'La Bendita', 'Chumacera', 'Los Leones', 'Los Higos'];
            var rand = miramarCenterArray[Math.floor(Math.random() * miramarCenterArray.length)];
        break;

        case "erangel":
        case "Erangel":
            var erangelArray = ['Zharki', 'Shooting Range', 'Severny', 'Stalber', 'Yasnaya Polyana', 'Kameshki', 'Mansion', 'Lipovka', 'Prison', 'Shelter', 'School', 'Mylta Power', 'Rozhok', 'Ruins', 'Mylta', 'Farm', 'Novorepnoye', 'Military Factory', 'Military Police station', 'Military Barracks', 'Military Radio Station', 'Ferry Pier', 'Primorsk', 'Quarry', 'Gatka', 'North Georgopol', 'South Georgopol', 'Pochinki', 'Water Town'];
            var rand = erangelArray[Math.floor(Math.random() * erangelArray.length)];
        break;

        case "sanhok":
        case "Sanhok":
            var sanhokArray = ['Camp Alpha', 'Ha Tinh', 'Tat Mok', 'Khao', 'Mongnai', 'Paradise Resort', 'Camp Bravo', 'Ruins', 'Bootcamp', 'Lakawi', 'Kampong', 'Quarry', 'Camp Charlie', 'Ban Tai', 'Docks', 'Sahmee', 'Na Kham', 'Tambang', 'Pai Nan', 'Bhan'];
            var rand = sanhokArray[Math.floor(Math.random() * sanhokArray.length)];
        break;

        default:
        bot.sendMessage({
            to: channelID,
            message: `Looks like we got a typo in here somewhere, type "redvine help" in the chat if you need any help `,
        })
        break;
    }
    if(rand){
        bot.sendMessage({
            to: channelID,
            message: `${landingPhrase}${rand}`,
            tts: true,
        });
    }
}

module.exports.dropZone = dropZone;

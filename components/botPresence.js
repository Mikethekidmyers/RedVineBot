
function presenceRotator(){

    switch (Math.floor(Math.random() * 5)) {
        case 0:
        presenceVar = "PUBG"
        break;

        case 1:
        presenceVar = "The adventures of Redvine"
        break;

        case 2:
        presenceVar = "with fire"
        break;

        case 3:
        presenceVar = "Pornhub VR Xtreme"
        break;

        case 4:
        presenceVar = "Pornhub VR Anime Edition"
        break;
    }

    return presenceVar;
}

module.exports.presenceRotator = presenceRotator;


function presenceRotator(){

    switch (Math.floor(Math.random() * 10)) {
        case 0:
        presenceVar = "PLAYERUNKNOWN'S BATTLEGROUNDS"
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

        case 5:
        presenceVar = "bot meets world"
        break;

        case 6:
        presenceVar = "the Violin"
        break;

        case 7:
        presenceVar = "World of Warcraft: Battle for Virginity"
        break;

        case 8:
        presenceVar = "Stoke away on a rainy Tuesday night"
        break;

        case 9:
        presenceVar = "the stock market"
        break;
    }

    return presenceVar;
}

module.exports.presenceRotator = presenceRotator;

function translateGameMode(gameVar){

    switch(gameVar){
        case "squad-fpp":
        gameMode = "Squad"
        break;

        case "duo-fpp":
        gameMode = "Duo"
        break;

        case "solo-fpp":
        gameMode = "Solo"
        break;

        default:
        gameMode = gameMode
        break;
    }
    return gameMode;
}

module.exports.translateGameMode = translateGameMode;

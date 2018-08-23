// performance rating emoji

function getEmoji(caseVar){

    switch(caseVar){

        case 0:
        descriptionEmoji = ":shit:"
        break;

        case 1:
        descriptionEmoji = ":facepalm:"
        break;

        case 2:
        case 3:
        descriptionEmoji = ":baby:"
        break;

        case 4:
        case 5:
        descriptionEmoji = ":older_woman:"
        break;

        case 6:
        descriptionEmoji = ":older_man:"
        break;

        case 7:
        descriptionEmoji = ":spy:"
        break;

        case 8:
        descriptionEmoji = ":skull:"
        break;

        default:
        descriptionEmoji = ":fire:"
        break;
    }
    return descriptionEmoji;
}

module.exports.getEmoji = getEmoji;

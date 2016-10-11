
let shortenId = (id) => {
    let startPos = id.indexOf(':') + 1;
    let endPos = startPos + 12;
    return id.substring(startPos, endPos);
};

module.exports = shortenId;
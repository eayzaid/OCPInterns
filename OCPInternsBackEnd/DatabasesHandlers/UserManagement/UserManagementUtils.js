const bcrypt = require("bcrypt");

async function isMatch ( word , hashedWord ){
    return await bcrypt.compare( word , hashedWord );
}

async function hash ( word ) {
    const generatedSalt = await bcrypt.genSalt(12);
    return await bcrypt.hash(word , generatedSalt);
}

module.exports = {isMatch, hash};
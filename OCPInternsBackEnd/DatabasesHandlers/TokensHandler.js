const MongoClient = require( "mongoose" );

const TokenSchema = MongoClient.Schema({
    token : {
        type : String ,
        required: true
    },
    userId : {
        type : String , 
        required : true
    },
})

const TokenModel = MongoClient.model('TokenModel' , TokenSchema , "tokens");

//to add refresh token into the collection
async function addToken(token) {
    try {
        const tokenToBeAdded = new TokenModel(token);
        await tokenToBeAdded.save();
    } catch (error) {
        if (error instanceof MongoClient.Error.ValidationError) {
            error.statusCode = 400; //bad request;
        } else {
            error.statusCode = 500;
        }
        throw error;
    }
}


//to check the existence of refresh tokens in the collection
async function isTokenExist(searchedToken) {
    try {
        const result = await TokenModel.findOne({ token: searchedToken });
        return result !== null;
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
}

//to delete the refresh token from the collection
async function deleteToken(tokenToBeDeleted) {
    try {
        await TokenModel.deleteOne({ token: tokenToBeDeleted });
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
}

//to delete all refresh tokens associated with a userId from the collection
async function deleteAllUserTokens(userId) {
    try {
        await TokenModel.deleteMany({ userId: userId });
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
}

async function fetchUserIdFromToken(token) {
    try {
        const result = await TokenModel.findOne({ token: token });
        return result ? result.userId : null;
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }
}

module.exports = { addToken , isTokenExist , deleteToken , deleteAllUserTokens ,fetchUserIdFromToken};
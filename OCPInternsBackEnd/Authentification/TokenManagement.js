const jwt = require("jsonwebtoken");
const tokenDataBase = require("../DatabasesHandlers/TokensHandler");
const MongoClient = require("mongoose");

const ACC_TOK_EXPE_TIME = "15m";
const REF_TOK_EXPE_TIME = "7d";

/*
    token Instance in the database : 
    userId
    token
*/

//todo : token validation


//userRole is a string and not the model itself
function createAccessToken(userId, userRole) {
  return jwt.sign(
    { userId: userId, role: userRole },
    process.env.SECRET_JWT_KEY,
    { algorithm: "HS256", expiresIn: ACC_TOK_EXPE_TIME }
  );
}

// checked
async function createRefreshToken(userId, userRole) {
  try {
    const token = jwt.sign(
      { userId: userId, role: userRole },
      process.env.REFRESH_JWT_KEY,
      { algorithm: "HS256", expiresIn: REF_TOK_EXPE_TIME }
    );
    await tokenDataBase.addToken({ token: token, userId: userId });
    return token;
  } catch (error) {
    if (error instanceof MongoClient.Error.ValidationError) {
      error.message = "Token Format is wrong";
      error.statusCode = 400; //bad request;
    } else {
      error.statusCode = 500; //failed at inserting
      error.message = "something wrong during inserting";
    }
  }
}

//a transaction is needed to make sure no  mutliple tokens in the collection are present for the same user
async function handleRotationRefreshToken(userId, userRole, refreshToken) {
  //todo : link the sesssion with the queries to associate them within the same transaction

  try {
    await tokenDataBase.deleteToken(refreshToken);
    const newRefreshToken = await createRefreshToken(userId, userRole);

    return newRefreshToken;
  } catch (error) {
    throw error;
  }
}


async function verifyAndDecodeRefreshToken(refreshToken) {
  try {
    const decodedInfo = jwt.verify(refreshToken, process.env.REFRESH_JWT_KEY, {
      algorithm: "HS256",
    });
    if (decodedInfo && (await tokenDataBase.isTokenExist(refreshToken)))
      return decodedInfo;
    else throw new jwt.TokenExpiredError(); //send an error if the token is not found in the databased
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      error.message = "Token has expired";
      error.statusCode = 401;
    } else if (error instanceof jwt.JsonWebTokenError) {
      error.message = "Invalid token";
      error.statusCode = 401;
    } else error.statusCode = 500;
    throw error;
  }
}

//check access token
function verifyAndDecodeAccessToken(accessToken) {
  try {
    const decodedInfo = jwt.verify(accessToken, process.env.SECRET_JWT_KEY, {
      algorithms: "HS256",
    });
    return decodedInfo;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      error.message = "Access Token has expired";
      error.statusCode = 401;
    } else if (error instanceof jwt.JsonWebTokenError) {
      error.message = "Invalid token";
      error.statusCode = 401;
    } else error.statusCode = 500;
    throw error;
  }
}

async function grantAnotherTokens(refreshToken) {
  try {
    const decodedInfo = await verifyAndDecodeRefreshToken(refreshToken);
    return {
      refreshToken: await handleRotationRefreshToken(
        decodedInfo.userId,
        decodedInfo.role,
        refreshToken
      ),
      accessToken: createAccessToken(decodedInfo.userId, decodedInfo.role),
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      await tokenDataBase.deleteAllUserTokens(jwt.decode(refreshToken).userId); //delete all tokens granted to the specified user ( potential hacking ) associated with
      error.statusCode = 401;
    }
    throw error;
  }
}

async function grantNewTokens(userId, role) {
  try {
    return {
      refreshToken: await createRefreshToken(userId, role),
      accessToken: createAccessToken(userId, role),
    };
  } catch (error) {
    throw error;
  }
}

async function deleteAllTokens(refreshToken) {
  try {
    const userData = jwt.verify(refreshToken, process.env.REFRESH_JWT_KEY);
    await tokenDataBase.deleteAllUserTokens(userData.userId);
  } catch (error) {
    throw error;
  }
}
module.exports = {
    deleteAllTokens,
  grantNewTokens,
  grantAnotherTokens,
  verifyAndDecodeAccessToken,
};

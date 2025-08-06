const tokenManager = require("./TokenManagement");
const userManager = require("../DatabasesHandlers/UserManagement/UserManagementHandler");
const { JsonWebTokenError } = require("jsonwebtoken");

  const clientUrl = process.env.WEB_APP_URL;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res
      .status(401)
      .json({ errorMessage: "The client sent a request without the authorization header" })
    return;
  } else {
    const authToken = authHeader.split(" ")[1];
    try {
      const decodedInfo = tokenManager.verifyAndDecodeAccessToken(authToken);
      req.userId = decodedInfo.userId;
      req.role = decodedInfo.role;
      next();
    } catch (error) {
      res.status(error.statusCode || 401).redirect(`${clientUrl}/auth`); // An error occured during the verification (invalid token , or internal server problem)
    }
  }
}

//checked
async function refreshAccessToken(req, res, next) {
  const authHeader = req.cookies.refreshToken;
  if (!authHeader) {
    res.status(400).json({ errorMessage: "The client sent a bad request" });
    return;
  } else {
    const authToken = authHeader;
    try {
      const newAuthToken = await tokenManager.grantAnotherTokens(authToken);
      res.cookie("refreshToken", newAuthToken.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT expiration)
      });
      res.status(200).json({
        authorization: `Bearer ${newAuthToken.accessToken}`,
        role : newAuthToken.role
      });
    } catch (error) {
      next(error);
    }
  }
}

//checked
async function userRegistration(req, res, next) {
  try {
    const userInfo = req.body;
    const userRolefromPath = req.path.split("/")[1];
    const userRole = userManager.getUserModel(userRolefromPath); //the role will be included in the path
    const addedUser = await userManager.addUser(userRole, userInfo);
    const newAuthToken = await tokenManager.grantNewTokens(
      addedUser.userId,
      userManager.getUserRole(userRole)
    );
    res.cookie("refreshToken", newAuthToken.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT expiration)
      // Remove domain or set it properly for your environment
      // domain: "localhost" // This can cause issues in development
    });
    res.status(200).json({
      firstName: addedUser.firstName,
      lastName: addedUser.lastName,
      authorization: `Bearer ${newAuthToken.accessToken}`,
      role : userRolefromPath
    });
  } catch (error) {
    next(error);
  }
}

//checked
async function userAuthentification(req, res, next) {
  try {
    const userInfo = req.body; //{email , password}
    const userRole = userManager.getUserModel(
      await userManager.getUserRoleByEmail(userInfo.email)
    ); //we get the role from the email by fetching the "roles" collection
    const existingUser = await userManager.checkCredentials(userRole, userInfo);
    if (existingUser) {
      const newAuthToken = await tokenManager.grantNewTokens(
        existingUser.userId,
      userManager.getUserRole(userRole)
      );
      res.cookie("refreshToken", newAuthToken.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT expiration)
      });
      res.status(200).json({
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        authorization: `Bearer ${newAuthToken.accessToken}`,
        redirect : `/${userManager.getUserRole(userRole)}`,
        role : userManager.getUserRole(userRole)
      });
    }
  } catch (error) {
    next(error);
  }
}


//checked
async function userLogout(req, res, next) {
  const authHeader = req.cookies.refreshToken;
  if (!authHeader) {
    res.status(400).json({ errorMessage: "The client sent a bad request" });
    return;
  } else {
    const authToken = authHeader;
    await tokenManager.deleteAllTokens(authToken);
    try {
      res.status(200).clearCookie('refreshToken').json({
        message: "Successfull logout",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  authenticateToken,
  refreshAccessToken,
  userRegistration,
  userAuthentification,
  userLogout,
};

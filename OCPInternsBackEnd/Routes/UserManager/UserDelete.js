const express = require("express");
const userHandler = require("../../DatabasesHandlers/UserManagement/UserManagementHandler");
const locationHandler = require("../../DatabasesHandlers/LocationsHandler");
const userAuthentification = require("../../Authentification/UserAuthentification");

const router = express.Router();

router.use(userAuthentification.authenticateToken);
router.use((req, res, next) => {
  if (req.role !== "admin") {
    res
      .status(403)
      .json({ errorMessage: "the client can't acces the requested resources" });
  } else {
    next();
  }
});

router.delete("/mentor", async (req, res, next) => {
  try {
    if (!req.query.userId) {
      const error = new Error("client sent a bad request");
      error.statusCode = 400;
      throw error;
    }
    await userHandler.deleteUser(       //delete authenitifaction info of the mentor
      userHandler.getUserModel("mentor"),
      req.query.userId
    );
    await locationHandler.deleteMentorFromLocation(req.query.userId); //delete the mentor from the location
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

router.delete("/recruiter", async (req, res, next) => {
  try {
    if (!req.query.userId) {
      const error = new Error("client sent a bad request");
      error.statusCode = 400;
      throw error;
    }
    await userHandler.deleteUser(       //delete authentication info of the recruiter
      userHandler.getUserModel("recruiter"),
      req.query.userId
    );
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require("express");
const userAuthentification = require("../../Authentification/UserAuthentification");
const locationHandler = require("../../DatabasesHandlers/LocationsHandler");
const userHandler = require("../../DatabasesHandlers/UserManagement/UserManagementHandler");
const router = express.Router();

router.use(userAuthentification.authenticateToken);

router.put("/mentor", async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      const error = new Error(
        "client is not allowed to get the requested resources"
      );
      error.statusCode = 403;
      throw error;
    }

    const { departmentName, fields, ...authData } = req.body;

    const userDoc = await userHandler.updateUser(
      userHandler.getUserModel("mentor"),
      authData.userId,
      authData
    ); //edit the auth info to the appropriate collection

    //edit the location
    await locationHandler.deleteMentorFromLocation(userDoc.userId);
    await locationHandler.addMentorToLocation(departmentName, {
      mentorFullName: authData.firstName + " " + authData.lastName,
      mentorId: userDoc.userId,
      fields,
    });
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

router.put("/recruiter", async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      const error = new Error(
        "client is not allowed to get the requested resources"
      );
      error.statusCode = 403;
      throw error;
    }

    const authData = req.body;

    const userDoc = await userHandler.updateUser(
      userHandler.getUserModel("recruiter"),
      authData.userId,
      authData
    ); //edit the auth info to the appropriate collection

    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

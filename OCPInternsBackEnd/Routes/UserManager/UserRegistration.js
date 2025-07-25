const express = require("express");
const userAuthentification = require("../../Authentification/UserAuthentification");
const locationHandler = require("../../DatabasesHandlers/LocationsHandler");
const userHandler = require("../../DatabasesHandlers/UserManagement/UserManagementHandler");
const router = express.Router();


router.post("/candidate", userAuthentification.userRegistration);

router.use(userAuthentification.authenticateToken);
router.post("/admin",    userAuthentification.userRegistration);
router.post("/recruiter", userAuthentification.userRegistration);

router.post("/mentor", async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      const error = new Error(
        "client is not allowed to get the requested resources"
      );
      error.statusCode = 403;
      throw error;
    }

    const { departmentName, fields, ...authData } = req.body;
    const userDoc = await userHandler.addUser(
      userHandler.getUserModel("mentor"),
      authData
    ); //add the auth info to the appropriate collection
    //add to location

    await locationHandler.addMentorToLocation(departmentName, {
      mentorFullName: authData.firstName + " " + authData.lastName,
      mentorId : userDoc.userId,
      fields,
    });
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

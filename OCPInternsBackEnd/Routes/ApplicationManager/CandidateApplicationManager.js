const express = require("express");
const applicationManager = require("../../DatabasesHandlers/ApplicationManagement/ApplicationsHandler");
const allApplicationManager = require("../../DatabasesHandlers/ApplicationManagement/AllApplicationsHandler");

const router = express.Router();

//this is used for candidate to apply
router.post("/apply", async (req, res, next) => {
  try {
    if (await applicationManager.findAppliaction(req.userId)) {
      const error = new Error(
        "The candidate already submited an application this round"
      );
      error.statusCode = 400;
      throw error;
    }
    const newApplication = req.body;
    await applicationManager.addApplication(newApplication, req.userId);
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

//this is used to for candidate to view their applications in the platform
//application { applicationId , createdAt , generalInfo.internType ,status }

router.get("/view", async (req, res, next) => {
  try {
    if (!req.userId) {
      const error = new Error("Invalid Token or user");
      error.statusCode = 400;
      throw error;
    }
    // Define the projection object
    const projection = {
      applicationId: 1,
      createdAt: 1,
      "generalInfo.internType": 1,
      status: 1,
      _id: 0
    };

    const oldApplications = await allApplicationManager.findAppliactions(
      req.userId,
      projection
    ); //this return all applications from the previous years

    const currentApplication = await applicationManager.findAppliactionByUserId(
      req.userId,
      projection
    ); //this return current applications

    res.status(200).json({ oldApplications, currentApplication });
  } catch (error) {
    next(error);
  }
});

//this is check to see if the user is eligible to sumbit an application
router.get("/eligible", async (req, res, next) => {
  try {
    if (await applicationManager.findAppliactionByUserId(req.userId)) {
      const error = new Error(
        "The candidate already submited an application this round"
      );
      error.statusCode = 400;
      throw error;
    }
    res.status(200).end();
  } catch (error) {
    next(error);
  }
});
module.exports = router;

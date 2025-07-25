const express = require("express");
const candidateApplicationManager = require("./CandidateApplicationManager");
const {
  authenticateToken,
} = require("../../Authentification/UserAuthentification");
const applicationManager = require("../../DatabasesHandlers/ApplicationManagement/ApplicationsHandler");

const router = express.Router();
router.use(authenticateToken);
router.use("/candidate", candidateApplicationManager);

// this check for the eligibity of the user to access the resources
router.use((req, res, next) => {
  if (!["admin", "recruiter"].includes(req.role)) {
    res.status(401).json({
      error: "Client is not allowed the access the requested resources",
    });
  }
  next();
});

router.get("/view", async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    if (page >= 0 && limit > 0) {
      const documents = await applicationManager.getApplications(page, limit);
      res.status(200).json(documents.applications);
    } else {
      const error = new Error("Invalid Parameters");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
});

router.get("/view/:applicationId", async (req, res, next) => {
  try {
    const applicationId = req.params.applicationId;
    if (applicationId) {
      const application = await applicationManager.findAppliaction(
        applicationId
      );
      res.status(200).json(application);
    } else {
      const error = new Error("Invalid Parameters");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
});

router.post("/update/:applicationId", async (req, res, next) => {
  try {
    const applicationId = req.params.applicationId;
    if (applicationId) {
      const updatedApplication = req.body
      await applicationManager.updateApplication(applicationId , updatedApplication);
      res.status(200).end();
    } else {
      const error = new Error("Invalid Parameters");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
});

module.exports = router;

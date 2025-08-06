const express = require("express");
const candidateApplicationManager = require("./CandidateApplicationManager");
const {
  authenticateToken,
} = require("../../Authentification/UserAuthentification");
const applicationManager = require("../../DatabasesHandlers/ApplicationManagement/ApplicationsHandler");
const { findDownload } = require("../../DatabasesHandlers/DownloadsHandler")

const router = express.Router();

router.get("/verify/:documentID" , async ( req , res , next) =>{
  try{
    if(!req.params.documentID){
      const error = new Error("Client sent a bad request");
      error.statusCode = 400;
      throw error;
    }
    const download = await findDownload(req.params.documentID);
    res.status(200).json(download);
  }catch(error){
    next(error);
  }
})

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

//this route is set to get applications by fullName ,or get paginated resulted in default
router.get("/view", async (req, res, next) => {
  try {
    if (req.query.fullName) {
      const fullName = req.query.fullName;
      const applications = await applicationManager.findAppliactionByUFullName(
        fullName
      );
      res.status(200).json(applications);
    } else {
      let { page, limit } = req.query;
      page = parseInt(page) || 1 ;
      limit = parseInt(limit) || 20;
      if (page > 0 && limit > 0) {
        const documents = await applicationManager.getApplications(page, limit);
        res.status(200).json(documents);
      } else {
        const error = new Error("Invalid Parameters");
        error.statusCode = 400;
        throw error;
      }
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
      const updatedApplication = req.body;
      await applicationManager.updateApplication(
        applicationId,
        updatedApplication
      );
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

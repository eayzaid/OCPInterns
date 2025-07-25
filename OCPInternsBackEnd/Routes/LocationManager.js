const express = require("express");
const locationCollectionManager = require("../DatabasesHandlers/LocationsHandler");
const {
  authenticateToken,
} = require("../Authentification/UserAuthentification");

const router = express.Router();
router.use(authenticateToken);

router.use((req, res, next) => {
  if (!["admin", "recruiter"].includes(req.role)) {
    console.log(req.role);
    res.status(401).json({
      error: "Client is not allowed the access the requested resources",
    });
  }
  next();
});

//view only the name of departments
router.get("/view/departments", async (req, res, next) => {
  try {
    const projection = {
      departmentName: 1,
    };
    const locations = await locationCollectionManager.getAllLocations(
      projection
    );
    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
});

router.get("/view", async (req, res, next) => {
  try {
    //this will get all mentors from a single department
    if (req.query.department || req.query.field || req.query.fullName) {

      const projecton = {
        departmentName: 1,
        mentors: 1,
        _id: 0,
      };

      // Extract query object
      const query = {};
      if (req.query.department) {
        query.departmentName = req.query.department;
      }
      if (req.query.field) {
        query["mentors.fields"] = req.query.field;
      }
      if(req.query.fullName){
        query["mentors.mentorFullName"] = req.query.fullName;
      }

      let mentors = await locationCollectionManager.getLocationsByQuery(
        query,
        projecton
      );

      mentors = JSON.parse(JSON.stringify(mentors));
      if(req.query.field || req.query.fullName) mentors = mentors
        .map((department) =>
          department.mentors
        .filter((mentor) => ( req.query.field ? mentor.fields.includes(req.query.field) : mentor.mentorFullName === req.query.fullName))
        .map((mentor) => ({
          departmentName: department.departmentName,
          ...mentor,
        }))
        )
        .reduce((acc, curr) => [...acc, ...curr], []);

      res.status(200).json(mentors);
    } else {
      //view all locations at ones
      const locations = await locationCollectionManager.getAllLocations();
      res.status(200).json(locations);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

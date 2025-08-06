const express = require("express");
const router = express.Router();
const locationHandler = require("../../DatabasesHandlers/LocationsHandler");

router.get("/mentorship", async (req, res, next) => {
  try {
    const stages = [
      {
        $set: {
          totalMentors: { $size: { $ifNull: ["$mentors", []] } },
          totalMentees: { $sum: "$mentors.menteeCount" },
        },
      },
      {
        $project: {
          _id: 0,
          departmentName: 1,
          totalMentors: 1,
          totalMentees: 1,
        },
      },
    ];

    const document = await locationHandler.aggregateLocations(stages);
    req.dataToCache = {
      value: document,
    };
    res.status(200).json(document);
    next()
  } catch (error) {
    next(error);
  }
});

module.exports = router;

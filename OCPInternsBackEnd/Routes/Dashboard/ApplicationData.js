const express = require("express");
const router = express.Router();
const applicationsHandler = require("../../DatabasesHandlers/ApplicationManagement/ApplicationsHandler");

//this route is used to get the total submitted and reviewed applications ===>tested
router.get("/count", async (req, res, next) => {
  try {
    const stages = [
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          reviewed: {
            $sum: {
              $cond: [{ $ne: ["$status", "pending"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          reviewed: 1,
        },
      },
    ];

    const document = await applicationsHandler.aggregateApplications(stages);
    res.status(200).json(document[0]);
  } catch (error) {
    next(error);
  }
});

//this route send the number of applications belonging to each state
router.get("/status", async (req, res, next) => {
  try {
    const stages = [
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ];

    const document = await applicationsHandler.aggregateApplications(stages);
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
});

//this route send the number of applications belonging to each internship Type
router.get("/interntype", async (req, res, next) => {
  try {
    const stages = [
      {
        $group: {
          _id: { internType: "$generalInfo.internType" },
          countAccepted: {
            $sum: {
              $cond: [{ $eq: ["$status", "accepted"] }, 1, 0],
            },
          },

          countTotal: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          internType: "$_id.internType",
          countAccepted: 1,
          countTotal: 1
        },
      },
    ];

    const document = await applicationsHandler.aggregateApplications(stages);
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
});

//this route send the number of applications belonging to each internship duration
router.get("/internduration", async (req, res, next) => {
  try {
    const stages = [
        {
            $group: {
                _id: "$generalInfo.internDuration",
                countAccepted: {
                    $sum: {
                        $cond: [{ $eq: ["$status", "accepted"] }, 1, 0]
                    }
                },
                countTotal: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                internDuration: "$_id",
                countAccepted: 1,
                countTotal: 1
            }
        }
    ];

    const document = await applicationsHandler.aggregateApplications(stages);
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
});

//this route send the number of applications belonging to each internship Field
router.get("/internfield", async (req, res, next) => {
  try {
    const stages = [
      {
        $group: {
          _id: { internField: "$generalInfo.internField"},
          countAccepted: {
            $sum: {
              $cond: [{ $eq: ["$status", "accepted"] }, 1, 0],
            },
          },
          countTotal: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          internField: "$_id.internField",
          countAccepted :1 ,
          countTotal: 1,
        },
      },
    ];

    const document = await applicationsHandler.aggregateApplications(stages);   
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
});

//this route tracks daily submissions for the last 3 months
router.get("/submissions", async (req, res, next) => {
  try {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const stages = [
      {
        $addFields: {
          createdAt: { $toDate: "$createdAt" }
        }
      },
      {
        $match: {
          createdAt: { $gte: threeMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          submissions: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day"
            }
          },
          submissions: 1
        }
      },
      {
        $addFields: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
        }
      },
      {
        $sort: { date: 1 }
      }
    ];

    const document = await applicationsHandler.aggregateApplications(stages);
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

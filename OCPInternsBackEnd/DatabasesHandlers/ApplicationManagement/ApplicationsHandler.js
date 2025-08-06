const MongoClient = require("mongoose");
const Data = require("../../Data");
const { v4: uuidv4 } = require("uuid");
const { application } = require("express");

const applicationSchema = MongoClient.Schema({
  applicationId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    //firstName + lastName
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  generalInfo: {
    internType: {
      type: String,
      required: true,
      enum: Data.InternshipTypesFrancophone,
    },
    internDuration: {
      type: String,
      required: true,
      enum: Data.InternshipDurations,
    },
    internField: {
      type: String,
      required: true,
      enum: Data.OCPMajorFields,
    },
  },
  education: [
    {
      schoolName: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
        enum: Data.Degrees,
      },
      branch: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        validate: {
          validator: function (value) {
            return !this.startDate || !value || value >= this.startDate;
          },
        },
      },
    },
  ],
  experiences: [
    {
      organizationName: {
        type: String,
        required: true,
      },
      jobType: {
        type: String,
        required: true,
        enum: Data.JobTypes,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        validate: {
          validator: function (value) {
            return !this.startDate || !value || value >= this.startDate;
          },
        },
      },
    },
  ],
  languages: [
    {
      languageName: {
        type: String,
        required: true,
      },
      proficiencyLevel: {
        type: String,
        required: true,
        enum: Data.ProficiencyLanguageLevel,
      },
    },
  ],
  skills: [
    {
      skill: {
        type: String,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: Data.ApplicationStatus,
    default: "pending",
  },
  mentor: {
    mentorId: String,
    fullName: String,
  },
  department: {
    name: String,
    sousDepartment: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return !this.startDate || !value || value >= this.startDate;
      },
      message: "End date must be after or equal to start date",
    },
  },
});

// Remove _id from subdocuments in arrays
applicationSchema.path("education").schema.set(" _id", false);
applicationSchema.path("experiences").schema.set(" _id", false);
applicationSchema.path("languages").schema.set(" _id", false);
applicationSchema.path("skills").schema.set(" _id", false);

const ApplicationModel = MongoClient.model(
  "ApplicationModel",
  applicationSchema,
  "applications"
);

async function addApplication(newApplication, userId) {
  //when submited by the candidate
  try {
    const applicationDoc = new ApplicationModel({
      userId: userId,
      ...newApplication,
    });
    await applicationDoc.save();
  } catch (error) {
    if (error instanceof MongoClient.Error.ValidationError) {
      error.statusCode = 400;
    } else error.statusCode = 500;
    throw error;
  }
}

async function updateApplication(applicationId, updatedApplication) {
  try {
    // replace the entire document (except _id)
    const application = await ApplicationModel.findOneAndReplace(
      { applicationId },
      { applicationId, ...updatedApplication },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!application) {
      const notFoundError = new Error(`Application ${applicationId} not found`);
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    return application;
  } catch (error) {
    if (error instanceof MongoClient.Error.ValidationError) {
      error.statusCode = 400;
    } else {
      error.statusCode = 500;
    }
    throw error;
  }
}

async function findAppliaction(applicationId, projection) {
  try {
    const document = await ApplicationModel.findOne(
      { applicationId: applicationId },
      projection || {}
    );
    return document;
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
}

async function findAppliactionByUserId(userId, projection) {
  try {
    const document = await ApplicationModel.findOne(
      { userId: userId },
      projection || {}
    );
    return document;
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
}

async function findAppliactionByUFullName(fullName, projection) {
  try {
    const documents = await ApplicationModel.find(
      { fullName: fullName },
      projection || {}
    );
    return documents;
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
}

//this is used to get application for their review
async function getApplications(page, pageSize) {
  try {
    const documents = await ApplicationModel.aggregate([
      {
        $facet: {
          metadata: [{ $count: "totalApplications" }],
          applications: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            {
              $addFields: {
                mostRecentEducation: {
                  $reduce: {
                    input: "$education",
                    initialValue: null,
                    in: {
                      $cond: {
                        if: {
                          $or: [
                            { $eq: ["$$value", null] },
                            { $gt: ["$$this.startDate", "$$value.startDate"] },
                          ],
                        },
                        then: "$$this",
                        else: "$$value",
                      },
                    },
                  },
                },
              },
            },
            {
              $project: {
                applicationId: 1,
                createdAt: 1,
                status: 1,
                fullName: 1,
                education: "$mostRecentEducation",
                "generalInfo.internType": 1,
              },
            },
          ],
        },
      },
      { $unwind: "$metadata" },
      {
        $project: {
          applications: 1,
          totalPages: { $ceil: { $divide: ["$metadata.totalApplications", pageSize] } },
        },
      },
    ]);
    return documents[0];
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
}

async function aggregateApplications(stages) {
  try {
    const documents = await ApplicationModel.aggregate(stages);
    return documents;
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
}

module.exports = {
  findAppliactionByUFullName,
  aggregateApplications,
  getApplications,
  addApplication,
  updateApplication,
  findAppliaction,
  findAppliactionByUserId,
};

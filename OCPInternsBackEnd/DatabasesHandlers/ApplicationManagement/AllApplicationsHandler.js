const MongoClient = require("mongoose");
const Data = require("../../Data");
const { v4: uuidv4, stringify } = require("uuid");
//this file should contain all previous applications down from the first creation of the platfrom

//here userId may not be unique , because this collection cover all applications , and some can be redundent in the userId 

const applicationSchema = MongoClient.Schema({
  applicationId: {
    type: String , 
    default : uuidv4 ,
    unique : true
  },
  userId: {
    type: String,
    required: true,
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
    default: "pending", //the first state of an application is pending
  },
  mentor: {
    mentorId: String,
    fullName : String,
  },
  department: {
    name: String,
    sousDepartment: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return !this.startDate || !value || value >= this.startDate;
      },
    },
  },
});

// Remove _id from subdocuments in arrays
applicationSchema.path('education').schema.set(' _id', false);
applicationSchema.path('experiences').schema.set(' _id', false);
applicationSchema.path('languages').schema.set(' _id', false);
applicationSchema.path('skills').schema.set(' _id', false);


const OldApplicationModel = MongoClient.model(
  "OldApplicationModel",
  applicationSchema,
  "oldapplications"
);

async function addApplication( newApplication , userId ) { //when submited by the candidate
  try {
    const applicationDoc = new OldApplicationModel({ userId : userId ,...newApplication});
    await applicationDoc.save();
  } catch (error) {
    if (error instanceof MongoClient.Error.ValidationError) {
      error.statusCode = 400;
    } else error.statusCode = 500;
    throw error;
  }
}

async function findAppliactions ( userId , projection){
    try{
        const document = OldApplicationModel.find( { userId : userId} , projection || {}); 
        return document;
    }catch(error){
        error.statusCode = 500;
        throw error;
    }
}

module.exports = {
  addApplication,
  findAppliactions,
};
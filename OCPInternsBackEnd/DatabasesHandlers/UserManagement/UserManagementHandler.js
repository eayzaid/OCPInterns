const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { isMatch, hash } = require("./UserManagementUtils");

const userInfoSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

// Define a separate schema for userId and role
const userIdRoleSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["candidate", "recruiter", "mentor", "admin"],
    lowercase: true,
    trim: true,
  },
});

const CandidateModel = mongoose.model(
  "CandidateModel",
  userInfoSchema,
  "candidates"
);
const RecruiterModel = mongoose.model(
  "RecruiterModel",
  userInfoSchema,
  "recruiters"
);
const MentorModel = mongoose.model("MentorModel", userInfoSchema, "mentors");
const AdminModel = mongoose.model("AdminModel", userInfoSchema, "admins");
const RoleModel = mongoose.model("RoleModel", userIdRoleSchema, "roles");

function getUserRole(model) {
  switch (model) {
    case CandidateModel:
      return "candidate";
    case RecruiterModel:
      return "recruiter";
    case MentorModel:
      return "mentor";
    case AdminModel:
      return "admin";
    default:
      throw new Error("Invalid model provided", { statusCode: 500 }); //internal server problem , not an appropriate model
  }
}

function getUserModel(role) {
  switch (role) {
    case "candidate":
      return CandidateModel;
    case "recruiter":
      return RecruiterModel;
    case "mentor":
      return MentorModel;
    case "admin":
      return AdminModel;
    default:
      throw new Error("Invalid role provided", { statusCode: 400 }); //bad request or role from the client
  }
}

async function addUser(UserRole, user) {
  try {
    const isUserExist = await findUser(UserRole, { email: user.email });
    const isUserRoleExist = await findRole({ email: user.email });
    if (!isUserExist && !isUserRoleExist) {
      const generatedUserId = uuidv4();
      const userDoc = new UserRole({
        ...user,
        password: await hash(user.password),
        userId: generatedUserId,
      });
      const userRole = new RoleModel({
        email: user.email,
        role: getUserRole(UserRole),
      });
      await userDoc.save();
      await userRole.save();
      return userDoc;
    } else {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError || error.statusCode )
      error.statusCode = 400; //bad request
    else error.statusCode = 500;
    throw error;
  }
}

async function checkCredentials(UserRole, userInfo) {
  try {
    const existedUser = await findUser(UserRole, { email: userInfo.email }); //we're checking for only one user ( the unique constraint on the email field)
    if (!existedUser) {
      const error = new Error("User do not Exist");
      error.statusCode = 404;
      throw error;
    } else {
      if (await isMatch(userInfo.password, existedUser.password))
        return existedUser;
      else {
        const error = new Error("Invalid credentials");
        error.statusCode = 401;
        throw error;
      } //the user is Unauthorized
    }
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    throw error;
  }
}

async function findUser(UserRole, query , projection) {
  try {
    const response = await UserRole.findOne(query , projection || {});
    return response;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
}

async function findRole(query) {
  try {
    const response = await RoleModel.findOne(query);
    return response;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
}

async function findUsers(UserRole, query) {
  try {
    const response = await UserRole.find(query);
    return response;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
}

async function getUserRoleByEmail(email) {
  try {
    const roleDoc = await RoleModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!roleDoc) {
      const error = new Error("User not found for the given email");
      error.statusCode = 404;
      throw error;
    }
    return roleDoc.role;
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    throw error;
  }
}

async function deleteUser(UserRole,userId){
  try{
    const res = await UserRole.deleteOne({userId: userId})
    return res
  }catch(error){
    error.statusCode = 500
    throw error
  }
}

module.exports = {
  checkCredentials,
  CandidateModel,
  RecruiterModel,
  MentorModel,
  AdminModel,
  addUser,
  deleteUser,
  getUserRole,
  getUserModel,
  getUserRoleByEmail,
  findUser
};

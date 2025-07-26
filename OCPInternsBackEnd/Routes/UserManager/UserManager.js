const express = require("express");
const userAuthentification = require("../../Authentification/UserAuthentification");
const userRegistration = require("./UserRegistration");
const userDelete = require("./UserDelete");
const userHandler = require("../../DatabasesHandlers/UserManagement/UserManagementHandler");
const userEdit = require("./UserEdit");

const router = express.Router();
router.use(express.json());

router.use("/create", userRegistration);
router.use("/edit", userEdit);
router.post("/auth", userAuthentification.userAuthentification);
router.get("/refresh", userAuthentification.refreshAccessToken);
router.get("/logout", userAuthentification.userLogout);
router.use("/delete", userDelete);

router.use(userAuthentification.authenticateToken);

//used to get any user (admin only request)
router.get("/", async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      const error = new Error(
        "client is not allowed to get the requested resources"
      );
      error.statusCode = 403;
      throw error;
    }
    
    // If only role is provided, get all users of that role with optional filtering
    if (req.query.role && !req.query.userId) {
      let searchQuery = {};
      
      // Handle different search parameters from frontend
      if (req.query.search) {
        // Search in both firstName and lastName when search parameter is provided
        const searchValue = req.query.search.trim();
        searchQuery = {
          $or: [
            { firstName: { $regex: searchValue, $options: 'i' } },
            { lastName: { $regex: searchValue, $options: 'i' } },
            { 
              $expr: {
                $regexMatch: {
                  input: { $concat: ['$firstName', ' ', '$lastName'] },
                  regex: searchValue,
                  options: 'i'
                }
              }
            }
          ]
        };
      } else {
        // Handle specific firstName, lastName, or email filters
        if (req.query.firstName) {
          searchQuery.firstName = { $regex: req.query.firstName.trim(), $options: 'i' };
        }
        if (req.query.lastName) {
          searchQuery.lastName = { $regex: req.query.lastName.trim(), $options: 'i' };
        }
        if (req.query.email) {
          searchQuery.email = { $regex: req.query.email.trim(), $options: 'i' };
        }
      }
      
      const users = await userHandler.findUsers(
        userHandler.getUserModel(req.query.role),
        searchQuery
      );
      
      // Map to include only necessary fields
      const filteredUsers = users.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userId: user.userId
      }));
      
      return res.status(200).json(filteredUsers || []);
    }
    
    // If both role and userId are provided, get specific user
    if (!req.query.role || !req.query.userId) {
      const error = new Error("bad request");
      error.statusCode = 400;
      throw error;
    }

    const projection = {
      firstName: 1,
      lastName: 1,
      email: 1,
      userId: 1,
      _id: 0,
    };

    const user = await userHandler.findUser(
      userHandler.getUserModel(req.query.role),
      {
        userId: req.query.userId,
      },
      projection
    );
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

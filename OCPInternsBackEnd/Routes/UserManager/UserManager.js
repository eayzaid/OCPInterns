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
    if (!req.query.role || !req.query.userId) {
      const error = new Error("bad request");
      error.statusCode = 400;
      throw error;
    }

    const projection = {
      firstName: 1,
      lastName: 1,
      email: 1,
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

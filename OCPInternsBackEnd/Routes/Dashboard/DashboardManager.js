const express = require("express")
const applications = require("./ApplicationData")
const locations = require("./LocationData")


const router = express.Router();

router.use("/applications",applications);
router.use("/locations",locations);



module.exports = router;
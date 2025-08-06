const express = require("express");
const applications = require("./ApplicationData");
const locations = require("./LocationData");
const Authentification = require("../../Authentification/UserAuthentification");

const memorizedInfo = {};

function cacheInfo(req, res, next) {
  const dataToCache = req.dataToCache;
  if (!dataToCache || !dataToCache.value) return;
  const now = new Date();
  const keyCache = req.originalUrl.replaceAll("/", "_");
  memorizedInfo[keyCache] = {
    expireAt: new Date(now.getTime() + 48 * 60 * 60 * 1000),
    value: dataToCache.value,
  };
  return;
}

const router = express.Router();

router.use(Authentification.authenticateToken);
router.use((req, res, next) => {
  if (!["admin", "recruiter"].includes(req.role)) {
    res.status(401).json({
      error: "Client is not allowed the access the requested resources",
    });
  }
  const keyCache = req.originalUrl.replaceAll("/", "_");
  const requestedInfo = memorizedInfo[keyCache];
  if (!requestedInfo || !(requestedInfo.expireAt > Date.now())) next();
  else {
    res.status(200).json(requestedInfo.value);
  }
});

router.use("/applications", applications);
router.use("/locations", locations);

router.use(cacheInfo);
module.exports = router;

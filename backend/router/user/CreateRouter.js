const express = require("express");
const router1 = express.Router();
const {
  createCs,
  getCsData,
  playingmatch,
  checkisplaying,
  joinuser,
  trackusermodel,
  checkUserOrAdmin,
} = require("../../controller/CreateMatchCsController");
const userRateLimiter = require("../../middleware/reactLimit");
const Authverify = require("../../middleware/AuthVerify");
router1.post("/create", Authverify, userRateLimiter, createCs);
router1.get("/get", getCsData);
router1.get("/getsingle", playingmatch);
router1.post("/checkisplaying", Authverify, joinuser);
router1.post("/addinhost", Authverify, trackusermodel);
router1.post("/checkUserOrAdmin", Authverify, checkUserOrAdmin);
module.exports = router1;

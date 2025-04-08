const express = require("express");
const router1 = express.Router();
const {
  createCs,
  getCsData,
  playingmatch,
  joinuser,
  trackusermodel,
  checkUserOrAdmin,
  checkisplaying,
  create_FM,
  getFFmatch,
  joinuserff,
  addName,
  EnrollMatch,
  trackusermodeltdm,
  checkUserOrAdmintdm,
  getpubg,
} = require("../../controller/CreateMatchCsController");
const userRateLimiter = require("../../middleware/reactLimit");
const Authverify = require("../../middleware/AuthVerify");
const checkSlot = require("../../middleware/checkSlotFullOrNotMiddleware");
const verifyDidYouWinMatch = require("../../middleware/DidYouWinMatch");
const {
  DidYouWinMatch,
  DidYouWinMatchtdm,
} = require("../../controller/DidWinMatchController");
router1.post("/create", Authverify, userRateLimiter, createCs);
router1.get("/get", Authverify, getCsData);
router1.get("/getsingle", playingmatch);
router1.get("/getff", getFFmatch);
router1.get("/enrollmatch", Authverify, EnrollMatch);
router1.post("/create_FM", Authverify, create_FM);
router1.post("/addNameff", Authverify, addName);
router1.post("/addinhost", Authverify, trackusermodel);
router1.post("/addinhosttdm", Authverify, trackusermodeltdm);
router1.post("/checkUserOrAdmin", Authverify, checkUserOrAdmin);
router1.post("/checkUserOrAdmintdm", Authverify, checkUserOrAdmintdm);
router1.post("/join", Authverify, userRateLimiter, checkSlot, joinuser);
router1.post("/check", Authverify, checkisplaying);
router1.post("/joinff", Authverify, joinuserff);
router1.post("/checkBoolean", Authverify, verifyDidYouWinMatch, DidYouWinMatch);
router1.post(
  "/checkBooleantdm",
  Authverify,
  verifyDidYouWinMatch,
  DidYouWinMatchtdm
);
router1.get("/getpubg", getpubg);
module.exports = router1;

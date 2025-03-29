const express = require("express");
const router = express.Router();
const updateAndHide = require("./updateAndHide");

const geminiVal = require("../admin/geminiVal");
const money = require("../admin/money");

// Using routes properly
router.use("/", geminiVal);

router.use("/money", money);
router.use("/", updateAndHide);

module.exports = router;

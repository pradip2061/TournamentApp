const express = require("express");
const router = express.Router();

const chatRoutes = require("../admin/chatRoutes");
const geminiVal = require("../admin/geminiVal");
const money = require("../admin/money");

// Using routes properly
router.use("/", geminiVal);
router.use("/", chatRoutes);
router.use("/money", money);

module.exports = router;

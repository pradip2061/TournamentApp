const express = require("express");
const router = express.Router();

router.post("/hideMatch", async (req, res) => {
  const { matchId, matchType } = req.body;
  const adminId = await req.user;
  const admin = await User.findById(adminId);
  if (!admin || admin.role != "admin") {
    console.log("Unauthorized .........");
    return { status: 401, message: "Unauthorized" };
  }

  try {
    let match = {};
    if (matchType === "pubG") {
      match = await pubgfull.findById(matchId);
    } else if (matchType === "freefire") {
      match = await FFfreefire.findById(matchId);
    }

    if (!match) {
      console.log("Match Not found ......");
      return res.status(200).send({ message: "Match Not found" });
    }
    match.hidden(true);
    await match.save();
    return res.status(200).send({ message: "Match hidden successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;

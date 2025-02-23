const express = require("express");
const router = express.Router();

router.get("/getMoneyRequest", (req, res) => {
  moneyRequest
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

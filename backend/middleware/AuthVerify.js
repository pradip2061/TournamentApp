const promisify = require("util").promisify;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Authverify = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = await promisify(jwt.verify)(token, process.env.secret_key);
    if (!decoded) {
      return res.status(400).send({
        message: "you need to login again",
      });
    }

    console.log("Auth Verify ");
    req.user = decoded.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Invalid token" });
  }
};

module.exports = Authverify;

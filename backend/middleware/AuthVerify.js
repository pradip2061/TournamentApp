const jwt = require("jsonwebtoken");
const { promisify } = require("util");
require("dotenv").config();

const Authverify = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    const decoded = await promisify(jwt.verify)(token, process.env.secret_key);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in again." });
    }

    console.log("Auth Verify Successful");
    req.user = decoded.id;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = Authverify;

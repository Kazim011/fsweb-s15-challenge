require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "shh";
const jwt = require("jsonwebtoken");

const generateToken = (payload, time) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: time });
};

module.exports = {
  generateToken,
  JWT_SECRET,
};

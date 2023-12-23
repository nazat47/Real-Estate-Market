const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);
const attachCookies = (res, user) => {
  const token = createToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    signed: true,
  });
};
module.exports = { createToken, isTokenValid, attachCookies };

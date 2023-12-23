const { BadRequest, Unauthenticated } = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new Unauthenticated("User not authenticated");
  }
  try {
    const payload = isTokenValid(token);
    const { name, email, id } = payload;
    req.user = {
      name,
      email,
      id,
    };
    next();
  } catch (error) {
    throw new Unauthenticated("authentication invalid");
  }
};
module.exports = authenticateUser;

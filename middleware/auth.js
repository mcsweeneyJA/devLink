const jwt = require("jsonwebtoken");
const config = require("config");

//then we can add AUTH as a parameter
// which makes it a protected route

//middleware function made to be exported
module.exports = function(req, res, next) {
  //Get jwt token from header
  const token = req.header("x-auth-token");

  // Check if theres no token
  if (!token) {
    return res.status(401).json({ msg: "not authorized - no token" });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtsecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token invalid" });
  }
};

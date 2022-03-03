const jwt = require("jsonwebtoken");
const config = require("config");
//const config = process.env;

const verifyToken = (req, res, next) => {
  //console.log("token::" + req.headers["x-access-token"]);
  //console.log("TOKEN_KEY::" + config.get("TOKEN_KEY"));

  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.get("TOKEN_KEY"));
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;

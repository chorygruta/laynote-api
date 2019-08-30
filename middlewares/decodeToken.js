const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  req.decoded = {};

  if (!authHeader) {
    req.decoded.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.decoded.isAuth = false;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.app_secret);
  } catch (err) {
    req.decoded.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.decoded.isAuth = false;
    return next();
  }
  req.decoded.isAuth = true;
  req.decoded.userId = decodedToken.userId;
  req.decoded.email_address = decodedToken.email_address;
  req.decoded.last_login = decodedToken.last_login;

  next();
};

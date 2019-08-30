const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");

module.exports = async req => {
  if (!req.decoded.isAuth) {
    /*  throw new Error('User must be logged in.'); */
    throw new AuthenticationError("User must be logged in.");
  }
};

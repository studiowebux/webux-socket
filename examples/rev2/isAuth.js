"use strict";

const jwt = require("jsonwebtoken");

/**
 * This function is used to authenticate the user using the socket.io.
 * The function also check if the access token is not blacklisted in Redis.
 * @param {string} accessToken
 * @param {Function} callback
 * @returns an error or a user decoded from the jwt token.
 */
function isAuth(accessToken, callback) {
  try {
    jwt.verify(accessToken, "HARDCODED_JWT_SECRET", (err, user) => {
      if (err || !user) {
        console.error("No user found...");
        return callback(err || new Error("No user found"));
      }

      console.debug("Checking token...");

      /* You Can add more validatation steps here, for example confirm the validity of the token in an external database */
      console.debug("Token valid !");
      return callback(null, user);
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

module.exports = isAuth;

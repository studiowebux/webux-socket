/**
 * File: authentication.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const { checkAuth } = require("../utils/checkAuth");
const cookie = require("cookie");

function authenticate(io, options, log = console) {
  return new Promise(resolve => {
    try {
      log.debug(
        "webux-Socket - The isAuthenticated is a function, configuring the authentication middleware for socket connections."
      );
      // to initialize the checkAuth function
      const Auth = checkAuth(options.isAuthenticated, log);

      io.use(async (socket, next) => {
        const cookies = cookie.parse(String(socket.handshake.headers.cookie));
        // if the cookies are present and the access token is also there
        if (cookies && cookies[options.accessTokenKey]) {
          log.debug(
            "webux-socket - Try to authenticate the socket.io connection"
          );
          // the socket instance and the access token value
          await Auth(socket, cookies[options.accessTokenKey]);
          log.debug("webux-Socket - The authenticate feature is initialized.");
          next();
          return;
        } else {
          log.debug("webux-socket - No access token provided.");
          next(new Error("Authentication error"));
        }
      });
      resolve(io);
      return;
    } catch (e) {
      throw e;
    }
  });
}

module.exports = {
  authenticate
};

// ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗
// ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝
// ███████╗██║   ██║██║     █████╔╝ █████╗     ██║
// ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║
// ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║
// ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝

/**
 * File: config.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const socketio = require("socket.io");
const auth = require("socketio-auth");
const redisAdapter = require("socket.io-redis");
const {
  authenticate,
  postAuthenticate,
  disconnect
} = require("./utils/authentication");

/**
 * this function initialise the socket.io
 * @param {Object} options the options to configure the socket.io server, Mandatory
 * @param {Object} server the http server object, Mandatory
 * @param {Function} isAuthenticated a function to validate that the user is authenticated, optional
 * @param {String} accessKey The name of the parameter that contains the token, optional
 * @param {Number} timeout The timeout in seconds to established the connection and validate the token, optional
 * @param {Object} log The log function, optional
 * @return {VoidFunction} return nothing
 */
module.exports = (
  options,
  server,
  isAuthenticated,
  accessKey = "accessToken",
  timeout = 5000,
  log = console
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let io = socketio(server, {
        path: options.path
      });

      if (options.redis.enabled === true) {
        log.debug("webux-socket - Redis is enabled.");
        io.adapter(
          redisAdapter({
            host: options.redis.host,
            port: options.redis.port,
            auth_pass: options.redis.password
          })
        );

        log.info(`\x1b[33mwebux-Socket - Redis adapter configured.\x1b[0m`);
      }

      // if the authentication is enabled or not.
      if (isAuthenticated && typeof isAuthenticated === "function") {
        log.debug(
          "webux-Socket - The isAuthenticated is a function, configuring the authentication middleware for socket connections."
        );
        auth(io, {
          authenticate: authenticate(isAuthenticated, accessKey, log),
          postAuthenticate: postAuthenticate(log),
          disconnect: disconnect(log),
          timeout: timeout // time for the client to authenticate
        });
      }

      return resolve(io);
    } catch (e) {
      throw e;
    }
  });
};

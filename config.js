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
const attachAdapter = require("./config/redisAdapter");
const { authenticate } = require("./config/authentication");
/**
 * this function initialise the socket.io
 * @param {Object} options the options to configure the socket.io server, Mandatory
 * @param {Object} expressServer the http expressServer object, Mandatory
 * @param {Object} log The log function, optional
 * @return {VoidFunction} return nothing
 */
module.exports = (options, expressServer, log = console) => {
  return new Promise(async resolve => {
    try {
      log.debug("webux-socket - create socket.io instance");
      let io = socketio(expressServer);

      // if redis enabled, we have to attach the adpater to the io object.
      if (options.redis && options.redis.enabled === true) {
        await attachAdapter(io, options, log);
      }

      // if the authentication is required, add the io.use function
      if (
        options.isAuthenticated &&
        typeof options.isAuthenticated === "function"
      ) {
        await authenticate(io, options, log);
      }

      return resolve(io);
    } catch (e) {
      throw e;
    }
  });
};

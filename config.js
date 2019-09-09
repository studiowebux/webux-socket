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
const {
  authenticate,
  postAuthenticate,
  disconnect
} = require("./utils/authentication");

/**
 * this function initialise the socket.io
 * @param {Object} options the options to configure the socket.io server, Mandatory
 * @param {Function} isAuthenticated a function to validate that the user is authenticated, optional
 * @param {String} accessKey The name of the parameter that contains the token, optional
 * @param {Number} timeout The timeout in seconds to established the connection and validate the token, optional
 * @param {Object} log The log function, optional
 * @return {VoidFunction} return nothing
 */
const init = (
  options,
  isAuthenticated,
  accessKey = "accessToken",
  timeout = 5000,
  log = console
) => {
  if (isAuthenticated && typeof isAuthenticated !== "function") {
    throw new Error(
      "The isAuthenticated parameter is optional and must be a function"
    );
  }
  if (accessKey && typeof accessKey !== "string") {
    throw new Error("The accessKey parameter is optional and must be a string");
  }
  if (timeout && typeof timeout !== "number") {
    throw new Error("The timeout parameter is optional and must be a number");
  }
  if (log && typeof log !== "object") {
    throw new Error("The log parameter is optional and must be an object");
  }

  let socket = socketio({
    path: options.path
  });

  // if the authentication is enabled or not.
  if (isAuthenticated && typeof isAuthenticated === "function") {
    auth(socket, {
      authenticate: authenticate(isAuthenticated, accessKey, log),
      postAuthenticate: postAuthenticate,
      disconnect: disconnect,
      timeout: timeout // time for the client to authenticate
    });
  }

  return socket;
};

module.exports = init;

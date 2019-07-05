// ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗
// ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝
// ███████╗██║   ██║██║     █████╔╝ █████╗     ██║
// ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║
// ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║
// ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝

/**
 * File: authentication.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

/**
 * this function authenticate the request.
 * @param {Function} isAuthenticated a function to validate that the user is authenticated, optional
 * @param {String} accessKey The name of the parameter that contains the token, optional
 * @param {Number} timeout The timeout in seconds to established the connection and validate the token, optional
 * @param {Object} log The log function, optional
 * @return {VoidFunction} return callback with error or decoded user.
 */
const authenticate = (isAuthenticated, accessKey = "accessToken", log = console) => {
  return (socket, data, callback) => {
    log.info(socket.id + " is trying to establish a connection.")
    if (!data && !data[accessKey]) {
      return callback(
        "Please provide a token, check the documentation for more details."
      );
    }

    isAuthenticated(data[accessKey].toString(), (err, user) => {
      if (err || !user) {
        return callback(err || "Not authenticated");
      }

      return callback(null, user);
    });
  };
};

/**
 * this function is executed after a successful authentication, it links the user returned in the socket
 * @param {Any} socket
 * @param {Object} user
 * @return {VoidFunction}
 */
const postAuthenticate = (socket, user) => {
  socket.client.user = user;
};

/**
 * this function is executed after a disconnect
 * @param {Any} socket
 * @return {VoidFunction}
 */
const disconnect = socket => {
  // for now this is not required.
};

module.exports = {
  authenticate,
  postAuthenticate,
  disconnect
};

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
 * @param {Function} isAuthenticated a function to validate that the user is authenticated, Mandatory
 * @param {Object} log The log function, optional
 * @return {VoidFunction} return callback with error or decoded user, and set the socket.user to the decoded user value.
 */
const checkAuth = (isAuthenticated, log = console) => {
  /**
   * @param {Object} socket The socket instance, Mandatory
   * @param {String} accessToken The current access token, Mandatory
   * @return an error or a decoded user, and set the socket.user to the decoded user value.
   */
  return (socket, accessToken) => {
    return new Promise((resolve, reject) => {
      try {
        log.debug(
          `\x1b[32mwebux-socket - ${socket.id} is trying to establish a connection.\x1b[0m`
        );
        if (!accessToken) {
          log.debug(
            `\x1b[32mwebux-socket - ${socket.id} did not provide a token.\x1b[0m`
          );
          return reject(
            new Error(
              "Please provide a token, check the documentation for more details."
            )
          );
        }

        // this function take a string in parameter and return a callback.
        // this function definition must be provide by the user.
        isAuthenticated(accessToken.toString(), (err, user) => {
          if (err || !user) {
            log.debug(
              `\x1b[32mwebux-socket - ${socket.id} is not authenticated.\x1b[0m`
            );
            return reject(err || new Error("Not authenticated"));
          }

          log.debug(
            `\x1b[32mwebux-socket - ${socket.id} is authenticated.\x1b[0m`
          );

          socket.user = user;

          return resolve(user);
        });
      } catch (e) {
        throw e;
      }
    });
  };
};

module.exports = {
  checkAuth
};

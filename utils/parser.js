// ███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗
// ██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝
// ███████╗██║   ██║██║     █████╔╝ █████╗     ██║
// ╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║
// ███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║
// ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { FirstLetterCaps } = require("./helpers");

/**
 * this function get all the sockets form a given directory
 * @param {String} baseDir the baseDir is the folder location that contains the socket definiton (absolute path), Mandatory
 * @param {Array} components list of files/folders in a directory, Mandatory
 * @param {Object} log The log function, optional
 * @return {Object} return the sockets to be added in the app.
 */
const Parser = (baseDir, components, log = console) => {
  return new Promise((resolve, reject) => {
    try {
      if (!components || typeof components !== "object") {
        return reject(
          new Error("The components list is required and must be an array.")
        );
      }

      // create empty array to store the sockets
      let sockets = new Array();
      // read the actions directory and keep only the files that have a socket definition.
      components.forEach(folder => {
        const actions = fs.readdirSync(path.join(baseDir, folder));
        actions.forEach(action => {
          if (require(path.join(baseDir, folder, action))["socket"]) {
            log.info(
              "\x1b[33m",
              "webux-socket - Creating the listener, " +
                folder +
                "/" +
                action +
                " => " +
                action.split(".js")[0] +
                FirstLetterCaps(folder),
              "\x1b[0m"
            );
            sockets[
              action.split(".js")[0] + FirstLetterCaps(folder)
            ] = require(path.join(baseDir, folder, action))["socket"];
          }
        });
      });

      return resolve(sockets);
    } catch (e) {
      throw e;
    }
  });
};

module.exports = { Parser };

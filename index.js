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
const config = require("./config");
const { Parser } = require("./utils/parser");
const cluster = require("cluster");

/**
 * this function initialize the socket endpoint based on an action directory
 * @param {Object} options the options to configure the socket.io server, Mandatory
 * @param {String} baseDir the baseDir is the folder location that contains the socket definiton (absolute path), Mandatory
 * @param {Function} isAuthenticated a function to validate that the user is authenticated, optional
 * @param {String} accessKey The name of the parameter that contains the token, optional
 * @param {Number} timeout The timeout in seconds to established the connection and validate the token, optional
 * @param {Object} log The log function, optional
 * @return {Function} return the socket.
 */
const init = (
  options,
  baseDir,
  isAuthenticated,
  accessKey = "accessToken",
  timeout = 5000,
  log = console
) => {
  try {
    return new Promise(async (resolve, reject) => {
      log.info(`\x1b[33mwebux-socket - Initialize Socket.IO\x1b[0m`);
      // initialise the socket
      const io = await config(options, isAuthenticated, accessKey, timeout);

      // Get all the folders in given directory
      const components = fs.readdirSync(path.join(baseDir));
      const socketActions = await Parser(baseDir, components, log);

      // on connection check
      // the authentication status
      // load all the sockets
      io.on("connection", client => {
        log.debug(`Worker ID : ${cluster.worker.id}`);
        if (!isAuthenticated) {
          log.warn(
            `\x1b[31mwebux-socket - Socket.io Authentication disabled.\x1b[0m`
          );
          client.auth = true;
        }

        console.log(`Socket ${client.id} connected.`);

        io.emit("joined", `New user has join`);

        client.on("disconnect", () => {
          console.log(`Socket ${client.id} disconnected.`);
        });

        if (socketActions) {
          // generate the socket entries
          Object.keys(socketActions).forEach(entry => {
            log.debug(`\x1b[33mwebux-socket - ${entry} added\x1b[0m`);
            client.on(entry, socketActions[entry](client, io));
          });
        }
      });
      log.info(`\x1b[33mwebux-socket - Socket.IO Initialized\x1b[0m`);
      return resolve(io);
    });
  } catch (e) {
    throw e;
  }
};

module.exports = init;

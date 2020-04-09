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
const Parser = require("../utils/parser");
const cluster = require("cluster");

/**
 * this function initialize the socket endpoint based on an action directory
 * @param {Object} options the options to configure the socket.io server, Mandatory
 * @param {Object} expressServer the express instance, Mandatory
 * @param {Object} log The log function, optional
 * @return {Promise<Object>} return the socket.
 */
const init = (options, expressServer, log = console) => {
  return new Promise(async resolve => {
    log.info(`\x1b[33mwebux-socket - Initialize Socket.IO\x1b[0m`);

    if (!options) {
      log.debug(`\x1b[33mwebux-socket - The option object is NULL\x1b[0m`);
      options = {};
    }
    // initialize the socket
    const io = await config(options, expressServer, log);

    // on connection check
    // the authentication status
    // load all the sockets
    log.debug(`\x1b[33mwebux-socket - Start io.on 'connection'\x1b[0m`);

    io.on("connection", async socket => {
      
      // if the cluster mode is enabled,
      // to facilitate the debugging we can see on which process the client is connected.
      if (cluster && cluster.worker) {
        log.debug(`Worker ID : ${cluster.worker.id}`);
      }
      // if no function nor string is provide for the authentication,
      // we can disable it.
      if (!options.isAuthenticated) {
        log.warn(
          `\x1b[31mwebux-socket - Socket.io Authentication disabled.\x1b[0m`
        );
        socket.user = {}; // we return an empty user, it may cause issues with the frontend..
      }

      log.debug(`webux-socket - Socket ${socket.id} connected.`);

      socket.on("disconnect", () => {
        log.debug(`webux-socket - Socket ${socket.id} disconnected.`);
      });

      // Get all the folders in given directory
      if (options.baseDir) {
        const components = fs.readdirSync(path.join(options.baseDir));
        const socketActions = await Parser(options.baseDir, components, log);

        if (socketActions) {
          log.info(
            `\x1b[33mwebux-socket - Generate Socket.IO Listeners using the basedir ${options.baseDir}\x1b[0m`
          );
          // generate the socket entries
          Object.keys(socketActions).forEach(entry => {
            log.debug(`\x1b[33mwebux-socket - ${entry} added\x1b[0m`);
            socket.on(entry, socketActions[entry](socket, io));
          });
        }
      } else {
        log.warn(
          `\x1b[31mwebux-socket - No Base Directory provided, no actions are defined automatically.\x1b[0m`
        );
      }
    });
    log.info(`\x1b[33mwebux-socket - Socket.IO Initialized\x1b[0m`);
    // return the io object to the client.
    return resolve(io);
  });
};

module.exports = init;

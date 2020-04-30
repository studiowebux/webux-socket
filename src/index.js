/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

const socketio = require("socket.io");

const ConfigureRedis = require("./helpers/redis/index");
const ConfigureAuthentication = require("./helpers/authentication/index");
const LoadActions = require("./helpers/actions/index");

/**
 * @class Socket
 * It exposes Socket.IO with some helpers
 * - Redis
 * - Authentication
 */
class Socket {
  /**
   * It initializes the Socket.IO instance
   * @param {Object} opts The configuration
   * @param {Object} app The HTTP or Express Instance
   * @param {Object} log The custom logger function, by default: console
   */
  constructor(opts, app, log = console) {
    this.config = opts;
    this.log = log;
    this.io = socketio(app); // Socket io instance with Express or HTTP
  }

  /**
   * To start the instance using the automatic actions
   */
  Start() {
    this.LoadActions();
  }

  /**
   * To start the instance freely
   * @return {Object} the io
   */
  Standalone() {
    return this.io;
  }
}

Socket.prototype.AddRedis = ConfigureRedis;
Socket.prototype.AddAuthentication = ConfigureAuthentication;
Socket.prototype.LoadActions = LoadActions;

module.exports = Socket;

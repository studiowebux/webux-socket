/**
 * File: redisAdapter.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const redisAdapter = require("socket.io-redis");

/**
 *
 * @param {Function} io The SocketIO Instance, Mandatory
 * @param {Object} options The Configuration, Mandatory
 * @param {Object} log The custom logger function, Optional
 * @returns {Promise}
 */
function attachAdapter(io, options, log = console) {
  return new Promise(resolve => {
    try {
      if (!options) {
        log.debug("webux-Socket - The provided option object is empty.");
        log.debug("webux-Socket - Unable to configure Redis.");
        return resolve(io);
      }

      log.debug("webux-socket - Redis is enabled.");
      io.adapter(
        redisAdapter({
          host: options.redis.host,
          port: options.redis.port,
          auth_pass: options.redis.password
        })
      );

      log.info(`\x1b[33mwebux-Socket - Redis adapter configured.\x1b[0m`);

      return resolve(io);
    } catch (e) {
      throw e;
    }
  });
}

module.exports = attachAdapter;

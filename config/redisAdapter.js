/**
 * File: redisAdapter.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const redisAdapter = require("socket.io-redis");

function attachAdapter(io, options, log = console) {
  return new Promise(resolve => {
    try {
      log.debug("webux-socket - Redis is enabled.");
      io.adapter(
        redisAdapter({
          host: options.redis.host,
          port: options.redis.port,
          auth_pass: options.redis.password
        })
      );

      log.info(`\x1b[33mwebux-Socket - Redis adapter configured.\x1b[0m`);

      resolve(io);
      return;
    } catch (e) {
      throw e;
    }
  });
}

module.exports = attachAdapter;

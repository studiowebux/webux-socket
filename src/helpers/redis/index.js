/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const redisAdapter = require("socket.io-redis");

/**
 * Configure the redis adapter
 * @returns {VoidFunction}
 */
function attachAdapter() {
  if (!this.config || !this.config.redis) {
    this.log.debug("webux-Socket - Unable to configure Redis.");
    throw new Error("No Options provided to configure redis");
  }

  this.log.info("webux-socket - Configuring Redis Adapter.");

  this.io.adapter(
    redisAdapter({
      host: this.config.redis.host,
      port: this.config.redis.port,
      auth_pass: this.config.redis.password,
    })
  );

  this.log.info(`\x1b[33mwebux-Socket - Redis adapter configured.\x1b[0m`);
}

module.exports = attachAdapter;

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2020-04-08
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { FirstLetterCaps } = require("../lib/helpers");

function AttachAction(socket, io, paths) {
  paths.forEach(_path => {
    const _actions = fs.readdirSync(_path);
    const parentFolder = _path.split("/")[_path.split("/").length - 1];

    console.log(parentFolder);
    _actions.forEach(_method => {
      if (
        !_method.includes(".js") ||
        !require(path.join(_path, _method))["socket"]
      ) {
        return;
      }

      console.log(_method);
      const name = _method.split(".js")[0] + FirstLetterCaps(parentFolder);
      console.log(name);

      console.log("Creating the socket.on");
      socket.on(name, require(path.join(_path, _method)).socket(socket, io));
    });
    console.log(_actions);
  });
}

function Actions() {
  if (!this.config || !this.config.namespaces) {
    throw new Error("No Namespace defined");
  }

  Object.keys(this.config.namespaces).forEach(namespace => {
    const paths = this.config.namespaces[namespace];

    if (namespace === "default") {
      this.io.on("connection", socket => {
        console.log("DEFAULT - Get .js files within the provided path");
        AttachAction(socket, this.io, paths);
      });
    } else {
      this.io.of(`/${namespace}`).on("connection", socket => {
        console.log(`/${namespace} - Get .js files within the provided path`);
        AttachAction(socket, this.io.of(`/${namespace}`), paths);
      });
    }
  });
}

module.exports = Actions;

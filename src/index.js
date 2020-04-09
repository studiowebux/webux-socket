const socketio = require("socket.io");

const ConfigureRedis = require("./helpers/redis/index");
const ConfigureAuthentication = require("./helpers/authentication/index");
const LoadActions = require("./helpers/actions/index");

class socket {
  constructor(opts, app, log = console) {
    this.config = opts;
    this.log = log;
    this.io = socketio(app); // Socket io instance with Express or HTTP
  }

  async Start() {
    this.LoadActions();
  }

  Standalone() {
    return this.io;
  }
}

socket.prototype.AddRedis = ConfigureRedis;
socket.prototype.AddAuthentication = ConfigureAuthentication;
socket.prototype.LoadActions = LoadActions;

module.exports = socket;
